from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True) # Null if using OAuth
    auth_provider = Column(String, default="email")
    height = Column(Float, nullable=True) # cm
    weight = Column(Float, nullable=True) # kg
    age = Column(Integer, nullable=True)
    healthGoal = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    activityLevel = Column(String, nullable=True)
    target_weight = Column(Float, nullable=True)
    healthCondition = Column(String, nullable=True, default='general')
    created_at = Column(DateTime, default=datetime.utcnow)

    meals = relationship("Meal", back_populates="user")
    diet_plans = relationship("DietPlan", back_populates="user")
    health_metrics = relationship("HealthMetrics", back_populates="user")
