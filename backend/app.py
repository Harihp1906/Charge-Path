from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chargepath.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'chargepath-secret-key-2024'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=True)
    google_id = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    bookings = db.relationship('Booking', backref='user', lazy=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    station_name = db.Column(db.String(200), nullable=False)
    station_lat = db.Column(db.Float, nullable=False)
    station_lon = db.Column(db.Float, nullable=False)
    station_type = db.Column(db.String(50), default='charging')
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    duration = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='confirmed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/')
def home():
    return jsonify({'message': 'Charge-Path API is running'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409
    hashed = generate_password_hash(password)
    user = User(name=name, email=email, password=hashed)
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': {'id': user.id, 'name': user.name, 'email': user.email}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not user.password:
        return jsonify({'error': 'Invalid email or password'}), 401
    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': {'id': user.id, 'name': user.name, 'email': user.email}})

@app.route('/api/google-auth', methods=['POST'])
def google_auth():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    google_id = data.get('google_id')
    if not email or not name:
        return jsonify({'error': 'Missing data'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(name=name, email=email, google_id=google_id)
        db.session.add(user)
        db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': {'id': user.id, 'name': user.name, 'email': user.email}})

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email, 'created_at': str(user.created_at)})

@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    booking = Booking(
        user_id=user_id,
        station_name=data.get('station_name'),
        station_lat=data.get('station_lat'),
        station_lon=data.get('station_lon'),
        station_type=data.get('station_type', 'charging'),
        date=data.get('date'),
        time=data.get('time'),
        duration=data.get('duration', 1)
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({'message': 'Booking confirmed', 'booking_id': booking.id}), 201

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
    result = []
    for b in bookings:
        result.append({
            'id': b.id,
            'station_name': b.station_name,
            'station_lat': b.station_lat,
            'station_lon': b.station_lon,
            'station_type': b.station_type,
            'date': b.date,
            'time': b.time,
            'duration': b.duration,
            'status': b.status,
            'created_at': str(b.created_at)
        })
    return jsonify(result)

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first()
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    booking.status = 'cancelled'
    db.session.commit()
    return jsonify({'message': 'Booking cancelled'})

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)