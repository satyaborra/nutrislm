import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model 'en_core_web_sm' not found. Run 'python -m spacy download en_core_web_sm' to install it.")
    nlp = None

def extract_food_entities(text: str) -> list[str]:
    if not nlp:
        # Fallback simplistic extraction if model fails to load
        return [word for word in text.split() if len(word) > 3]
        
    doc = nlp(text)
    # Basic logic: combining NOUN chunks as potential food items.
    # In a full system, a custom NER pipeline or rule-based matching is preferred.
    foods = []
    for chunk in doc.noun_chunks:
        foods.append(chunk.text.lower().strip())
    
    # Very simplistic filter to remove common non-food noise (I, we, they, etc)
    stopwords = {"i", "we", "he", "she", "it", "they", "me", "this", "that"}
    return [f for f in foods if f not in stopwords]
