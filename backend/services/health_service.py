from sqlalchemy.orm import Session
from models.user import User

def calculate_health_summary(db: Session, user: User):
    bmi = 0
    if user.weight and user.height:
        height_m = user.height / 100
        bmi = round(user.weight / (height_m * height_m), 1)
        
    # very basic BMR
    daily_calories = 2000 
    if user.weight and user.height and user.age:
        # Mifflin-St Jeor
        if user.gender == "Male":
            daily_calories = int(10 * user.weight + 6.25 * user.height - 5 * user.age + 5)
        else:
            daily_calories = int(10 * user.weight + 6.25 * user.height - 5 * user.age - 161)
            
    return {
        "bmi": bmi,
        "daily_calories": daily_calories,
        "target_protein": round(user.weight * 1.6) if user.weight else 100,
        "target_carbs": int(daily_calories * 0.4 / 4),
        "target_fat": int(daily_calories * 0.3 / 9)
    }
