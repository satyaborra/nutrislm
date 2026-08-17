from sqlalchemy import Column, Integer, String, Float
from database.base import Base

class Nutrition(Base):
    __tablename__ = "nutrition_data"

    id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String, unique=True, index=True)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    fiber = Column(Float)
