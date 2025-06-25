from flask import Flask, jsonify, render_template, send_from_directory, request
from flask_cors import CORS
import os
import csv
from datetime import datetime
from collections import deque
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000", "http://127.0.0.1:5000"],
        "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

CSV_PATH = "telemetry.csv"

def tail_last_line(path):
    try:
        with open(path, 'r') as f:
            lines = f.readlines()
            if not lines:
                logger.warning("Telemetry file is empty")
                return {}
                
            last_line = lines[-1].strip()
            if not last_line:
                last_line = lines[-2].strip() if len(lines) > 1 else ""
                
            logger.info(f"Processing line: {last_line}")
            
            # Split the CSV line
            fields = last_line.split(',')
            
            if len(fields) < 22:
                logger.error(f"Invalid data format. Expected at least 22 fields, got {len(fields)}")
                return {}
            
            try:
                # Map the fields to the expected format
                telemetry = {
                    "Team_Id": fields[0],
                    "TimeStamp": fields[1],
                    "PacketCount": fields[2],
                    "Altitude": fields[3],
                    "Pressure": fields[4],
                    "Temperature": fields[5],
                    "Voltage": fields[6],
                    "GpsTime": fields[7],
                    "GpsLatitude": fields[8],
                    "GpsLongitude": fields[9],
                    "GpsAltitude": fields[10],
                    "GpsSats": fields[11],
                    "a_x": fields[12],
                    "a_y": fields[13],
                    "a_z": fields[14],
                    "gyro_x": fields[15],
                    "gyro_y": fields[16],
                    "gyro_z": fields[17],
                    "FSW_State": fields[18],
                    "AngleX": fields[19],
                    "AngleY": fields[20],
                    "AngleZ": fields[21] if len(fields) > 21 else "0.0"
                }
                
                # Add Tilt and RotZ for backward compatibility with the frontend
                telemetry["TiltX"] = telemetry["a_x"]
                telemetry["TiltY"] = telemetry["a_y"]
                telemetry["RotZ"] = telemetry["gyro_z"]
                
                logger.info(f"Successfully parsed telemetry data")
                return telemetry
                
            except Exception as e:
                logger.error(f"Error parsing telemetry data: {e}")
                return {}
                
    except Exception as e:
        logger.error(f"Error reading telemetry file: {e}")
        return {}

@app.route("/")
def index():
    return send_from_directory('dist', 'index.html')

# API endpoint for telemetry data
@app.route("/api/telemetry")
def telemetry():
    logger.info("Received request for telemetry data")
    data = tail_last_line(CSV_PATH)
    logger.info(f"Sending response: {data}")
    
    # Add CORS headers
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    
    return response

# Serve static files from the dist directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)

if __name__ == "__main__":
    # Create telemetry.csv if it doesn't exist
    if not os.path.exists(CSV_PATH):
        with open(CSV_PATH, 'w') as f:
            pass  # Create empty file
    
    app.run(debug=True, port=5000)
