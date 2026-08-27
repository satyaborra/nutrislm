_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        try:
            import spacy
            _nlp = spacy.load("en_core_web_sm", disable=["ner", "lemmatizer", "textcat"])
        except Exception as e:
            print(f"Warning: spaCy model 'en_core_web_sm' could not be loaded: {e}")
            _nlp = False
    return _nlp if _nlp is not False else None

def extract_food_entities(text: str) -> list[str]:
    nlp = get_nlp()
    if not nlp:
        # Fallback simplistic extraction if model fails to load
        return [word for word in text.split() if len(word) > 3]
        
    doc = nlp(text)
    # Basic logic: combining NOUN chunks as potential food items.
    foods = []
    for chunk in doc.noun_chunks:
        foods.append(chunk.text.lower().strip())
    
    # Very simplistic filter to remove common non-food noise (I, we, they, etc)
    stopwords = {"i", "we", "he", "she", "it", "they", "me", "this", "that"}
    return [f for f in foods if f not in stopwords]
