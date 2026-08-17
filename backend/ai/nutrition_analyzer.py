import pandas as pd
import os

class NutritionAnalyzer:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        dataset_dir = os.path.join(base_dir, 'datasets')
        self.food_db = pd.DataFrame()
        
        usda_path = os.path.join(dataset_dir, 'usda_food_data.csv')
        if os.path.exists(usda_path):
            self.food_db = pd.read_csv(usda_path)

    def analyze_foods(self, food_items: list[str]) -> dict:
        totals = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
        
        if self.food_db.empty:
            return totals

        # Very simplistic static lookup mapping
        for item in food_items:
            # simple substring matching
            matches = self.food_db[self.food_db['FoodItem'].str.contains(item, case=False, na=False)]
            if not matches.empty:
                first_match = matches.iloc[0]
                totals["calories"] += float(first_match['Calories'])
                totals["protein"] += float(first_match['Protein'])
                totals["carbs"] += float(first_match['Carbs'])
                totals["fat"] += float(first_match['Fat'])

        return totals

nutrition_analyzer_engine = NutritionAnalyzer()
