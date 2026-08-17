import type { AICapabilityState } from '../../contexts/AIContext';

export interface AIAnalysisRequest {
  imageFile?: File;
  text?: string;
}

export interface AIAnalysisResponse {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  suggestion: string;
}

export interface IOnlineProcessor {
  analyzeFood(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
}

export interface IOfflineProcessor {
  analyzeFood(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
}

export interface IProcessingRouter {
  process(request: AIAnalysisRequest, mode: 'auto' | 'online' | 'offline', capabilityState: AICapabilityState): Promise<AIAnalysisResponse>;
}

import { analyzeMeal } from '../nutritionService';

// Online Processor implementation (wraps the existing logic)
export class OnlineProcessor implements IOnlineProcessor {
  async analyzeFood(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    let query = '';
    if (request.text) {
      query = request.text;
    } else if (request.imageFile) {
      query = `Analyzed image of ${request.imageFile.name}`;
    }

    const response = await analyzeMeal(query);
    if (!response || response.calories === 0) {
      throw new Error('Failed to analyze food online.');
    }
    return response;
  }
}

// Offline Processor implementation (preparation phase)
export class OfflineProcessor implements IOfflineProcessor {
  async analyzeFood(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    // This explicitly prevents faking offline capability by returning an error 
    // unless local models are actually available.
    throw new Error('OFFLINE_MODEL_UNAVAILABLE');
  }
}

// Processing Router to handle traffic based on AI capability state
export class ProcessingRouter implements IProcessingRouter {
  private onlineProcessor: IOnlineProcessor;
  private offlineProcessor: IOfflineProcessor;

  constructor() {
    this.onlineProcessor = new OnlineProcessor();
    this.offlineProcessor = new OfflineProcessor();
  }

  async process(request: AIAnalysisRequest, mode: 'auto' | 'online' | 'offline', capabilityState: AICapabilityState): Promise<AIAnalysisResponse> {
    
    if (mode === 'offline') {
      if (capabilityState === 'OFFLINE_READY') {
        return this.offlineProcessor.analyzeFood(request);
      } else {
        throw new Error('OFFLINE_MODEL_UNAVAILABLE');
      }
    }

    if (mode === 'online') {
      return this.onlineProcessor.analyzeFood(request);
    }

    // Auto mode logic
    const isOnline = navigator.onLine;

    if (isOnline && capabilityState === 'OFFLINE_READY') {
      // Internet available + local model available -> Choose preferred/local strategy
      try {
        return await this.offlineProcessor.analyzeFood(request);
      } catch (err) {
        console.warn("Offline processor failed in auto mode, falling back to online", err);
        return this.onlineProcessor.analyzeFood(request);
      }
    } else if (isOnline && capabilityState === 'OFFLINE_MODEL_MISSING') {
      // Internet available + local model missing -> Online
      return this.onlineProcessor.analyzeFood(request);
    } else if (!isOnline && capabilityState === 'OFFLINE_READY') {
      // Internet unavailable + local model available -> Offline
      return this.offlineProcessor.analyzeFood(request);
    } else {
      // Internet unavailable + local model missing -> Cannot process
      throw new Error('OFFLINE_MODEL_UNAVAILABLE');
    }
  }
}

export const processingRouter = new ProcessingRouter();
