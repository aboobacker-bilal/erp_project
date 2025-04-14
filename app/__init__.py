from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_admin import Admin
from dotenv import load_dotenv
from flask_admin.contrib.sqla import ModelView

load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    from app.models import Appointment

    admin = Admin(app, name="ERP Admin", template_mode="bootstrap4")
    admin.add_view(ModelView(Appointment, db.session))

    from app.routes import appointment_bp
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')

    return app
