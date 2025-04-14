from . import db


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    color = db.Column(db.String(20), default="#007bff")
    draggable = db.Column(db.Boolean, default=True)
    room_id = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "color": self.color,
            "draggable": self.draggable,
            "room_id": self.room_id,
            "user_id": self.user_id
        }
