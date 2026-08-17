from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from models.notification import Notification
from schemas.notification_schema import NotificationResponse, NotificationCreate
from auth.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@router.post("/", response_model=NotificationResponse)
def create_notification(data: NotificationCreate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = Notification(user_id=current_user.id, title=data.title, message=data.message)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

@router.patch("/read-all", response_model=dict)
def mark_all_as_read(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.patch("/{notif_id}/read", response_model=NotificationResponse)
def mark_as_read(notif_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif
