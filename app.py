from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)

socketio = SocketIO(app)

@app.route("/")
def main():
    return render_template("main.html")

# Initial connection, public announcement of connection
# sid = Session ID
@socketio.on("connect")
def on_connect():
    sid = request.sid
    emit("user_connect", sid, broadcast=True)

# Chat
@socketio.on("messaging")
def send_message(message):
    sid = request.sid
    emit("chat_message", {"id": sid, "message": message}, broadcast=True)

# Disconnect
@socketio.on("disconnect")
def user_disconnect():
    sid = request.sid
    emit("user_disconnect", sid, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)
