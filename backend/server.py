from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for your frontend URL (localhost:5173)
CORS(app, origins="*")

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
jwt = JWTManager(app)

# SocketIO setup
socketio = SocketIO(app, cors_allowed_origins="*")  # This should allow connections

# Store connected users
connected_users = {}

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        
        # Dummy validation, replace with actual logic
        if password == '1':
            # Check if the user is already connected
            if name in connected_users.values():
                return jsonify({"message": "User already logged in"}), 400
            
            # Create JWT token
            token = create_access_token(identity=name)

            # Emit user connection event with the name to all connected clients
            socketio.emit('user_connected', {'name': name}, namespace='/')

            return jsonify({"message": "Login successful", "token": token}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({"message": f"Error during login: {str(e)}"}), 500

# Handle new socket connections
@socketio.on('connect')
def handle_connect():
    print("User connected")

# Handle disconnections
@socketio.on('disconnect')
def handle_disconnect():
    user_name = connected_users.pop(request.sid, None)
    if user_name:
        print(f'{user_name} disconnected')
        # Broadcast disconnection to all connected clients
        emit('user_disconnected', {'name': user_name}, broadcast=True)

# Handle user connection and store their name
@socketio.on('user_connected')
def handle_user_connected(data):
    name = data.get('name')
    connected_users[request.sid] = name
    print(f'{name} connected')
    # Broadcast the connection to all clients
    emit('user_connected', {'name': name}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
