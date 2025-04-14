from flask import Blueprint, request, jsonify, render_template
from . import db
from .models import Appointment
from datetime import datetime

appointment_bp = Blueprint('appointments', __name__)


@appointment_bp.route('/home')
def home():
    return render_template('index.html')


@appointment_bp.route('/')
def appointments_page():
    return render_template('index.html')


@appointment_bp.route('/api/appointments/', methods=['GET', 'POST'])
def appointments():
    if request.method == 'POST':
        data = request.get_json()
        print("Received data:", data)
        try:
            title = data['title']
            start = datetime.fromisoformat(data['start'])
            end = datetime.fromisoformat(data['end'])
            color = data['color']
            draggable = data.get('draggable', True)

            new_appointment = Appointment(
                title=title,
                start_time=start,
                end_time=end,
                color=color,
                draggable=draggable,
                user_id=1
            )
            db.session.add(new_appointment)
            db.session.commit()
            return jsonify({'message': 'Appointment created'}), 201
        except Exception as e:
            print("Error saving appointment:", e)
            return jsonify({"error": str(e)}), 400

    else:
        appointments = Appointment.query.all()
        return jsonify([
            {
                "id": appt.id,
                "title": appt.title,
                "start": appt.start_time.strftime("%Y-%m-%dT%H:%M:%S"),
                "end": appt.end_time.strftime("%Y-%m-%dT%H:%M:%S"),
                "color": appt.color
            } for appt in appointments
        ])
