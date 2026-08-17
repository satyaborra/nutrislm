export type ModelStatus = 'Installed' | 'Available' | 'Not Installed' | 'Downloading' | 'Unavailable';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  status: ModelStatus;
  sizeMB: number;
  type: 'VLM' | 'SLM' | 'KnowledgeBase' | 'Database';
}

export const aiModels: AIModel[] = [
  {
    id: 'llava-vision',
    name: 'LLaVA / Vision Model',
    description: 'Local Vision-Language Model for food recognition.',
    status: 'Not Installed',
    sizeMB: 3200,
    type: 'VLM'
  },
  {
    id: 'quantized-slm',
    name: 'Quantized SLM',
    description: 'Nutrition Specific Language Model.',
    status: 'Not Installed',
    sizeMB: 2800,
    type: 'SLM'
  },
  {
    id: 'ifct-2017',
    name: 'IFCT 2017',
    description: 'Indian Food Composition Tables Knowledge Base.',
    status: 'Available',
    sizeMB: 180,
    type: 'KnowledgeBase'
  },
  {
    id: 'usda-fooddata',
    name: 'USDA FoodData',
    description: 'USDA FoodData Central Database.',
    status: 'Available',
    sizeMB: 250,
    type: 'Database'
  }
];

export const isAnyLocalModelInstalled = (): boolean => {
  return aiModels.some(model => model.status === 'Installed' && (model.type === 'VLM' || model.type === 'SLM'));
};
