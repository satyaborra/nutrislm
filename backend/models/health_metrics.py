from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class HealthMetrics(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weight = Column(Float)
    water_intake = Column(Float) # liters
    recorded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="health_metrics")
