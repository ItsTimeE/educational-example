from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
CORS(app)

# Configure Flask-JWT-Extended
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
jwt = JWTManager(app)

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')

        # Dummy validation, replace with actual logic
        if name == 'a' and password == '1':
            # Create JWT token
            token = create_access_token(identity=name)
            return jsonify({"message": "Login successful", "token": token}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({"message": "Error during login"}), 500

@app.route('/')
def index():
    return 'Flask server is running'

@socketio.on('connect')
def handle_connect():
    print("User is connected")  # Print when a user connects from the frontend

@socketio.on('disconnect')
def handle_disconnect():
    print("User disconnected")  # Print when a user disconnects

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
