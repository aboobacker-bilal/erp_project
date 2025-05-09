from flask import Blueprint, request, jsonify, render_template
from . import db
from .models import Appointment
from datetime import datetime

appointment_bp = Blueprint('appointments', __name__)


@appointment_bp.route('/home')
def home():
    return render_template('index.html')


@appointment_bp.route('/', methods=['GET', 'POST'])
def handle_appointments():
    if request.method == 'POST':
        data = request.get_json()
        try:
            new_appointment = Appointment(
                title=data['title'],
                start_time=datetime.fromisoformat(data['start']),
                end_time=datetime.fromisoformat(data['end']),
                color=data['color'],
                draggable=data.get('draggable', True),
                user_id=1
            )
            db.session.add(new_appointment)
            db.session.commit()
            return jsonify({'message': 'Appointment created'}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        appointments = Appointment.query.all()
        return jsonify([{
            "id": appt.id,
            "title": appt.title,
            "start": appt.start_time.strftime("%Y-%m-%dT%H:%M:%S"),
            "end": appt.end_time.strftime("%Y-%m-%dT%H:%M:%S"),
            "color": appt.color
        } for appt in appointments])

    return render_template('index.html')
