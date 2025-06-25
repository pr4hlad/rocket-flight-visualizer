import csv
import time
import math
import random
from datetime import datetime

CSV_PATH = "telemetry.csv"
INTERVAL = 0.5  # seconds between entries

# Initial conditions
team_id = "TEAM42"
packet_count = 0
altitude = 0.0        # meters
vertical_speed = 0.0  # m/s
acceleration = 2.0    # m/s² during boost
descent_acceleration = -1.0  # m/s² during descent
phase = "IDLE"        # IDLE, ASCENT, COAST, DESCENT, LANDED

# GPS start coordinates
gps_lat = 37.7749
gps_lon = -122.4194
gps_alt = 0.0

# Battery
voltage = 12.6            # volts
voltage_drop_per_entry = 0.001  # V per sample

# CSV header
headers = [
    "Team_Id", "TimeStamp", "PacketCount", "Altitude", "Pressure", "Temperature",
    "Voltage", "GpsTime", "GpsLatitude", "GpsLongitude", "GpsAltitude", "GpsSats",
    "a_x", "a_y", "a_z", "gyro_x", "gyro_y", "gyro_z",
    "FSW_State", "AngleX", "AngleY", "AngleZ"
]

# Write header if file doesn't exist
try:
    with open(CSV_PATH, 'r') as f:
        pass
except FileNotFoundError:
    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)

def barometric_pressure(alt):
    """Approximate pressure in hPa using barometric formula."""
    return 1013.25 * math.exp(-alt / 8434.5)

def temperature_lapse(alt):
    """Approximate temperature in °C (ISA lapse rate)."""
    return 15.0 - 0.0065 * alt

while True:
    # Phase transitions
    if phase == "IDLE" and packet_count >= 2:
        phase = "ASCENT"
    if phase == "ASCENT" and vertical_speed >= 120:
        phase = "COAST"
    if phase == "COAST" and vertical_speed <= 0:
        phase = "DESCENT"
    if phase == "DESCENT" and altitude <= 0:
        phase = "LANDED"

    # Update dynamics
    if phase == "ASCENT":
        vertical_speed += acceleration * INTERVAL
    elif phase == "DESCENT":
        vertical_speed += descent_acceleration * INTERVAL
    elif phase == "COAST":
        vertical_speed *= 0.99  # simulate drag

    altitude += vertical_speed * INTERVAL
    altitude = max(0.0, altitude)
    gps_alt = altitude

    # GPS drift
    gps_lat += random.uniform(-0.00001, 0.00001)
    gps_lon += random.uniform(-0.00001, 0.00001)

    # Battery voltage drop
    voltage = max(9.0, voltage - voltage_drop_per_entry)

    # Sensor readings
    a_x = random.uniform(-0.2, 0.2)
    a_y = random.uniform(-0.2, 0.2)
    a_z = (vertical_speed - (vertical_speed - acceleration * INTERVAL)) / INTERVAL  # approx

    gyro_x = random.uniform(-5, 5)
    gyro_y = random.uniform(-5, 5)
    gyro_z = random.uniform(-5, 5)

    angle_x = a_x * 5 + random.uniform(-1, 1)
    angle_y = a_y * 5 + random.uniform(-1, 1)
    angle_z = gyro_z * 0.1 + random.uniform(-0.5, 0.5)

    fsw_state = phase

    # Timestamps
    ts = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    gps_time = datetime.utcnow().strftime("%H:%M:%S")

    packet_count += 1

    # Compose CSV row
    row = [
        team_id,
        ts,
        packet_count,
        f"{altitude:.2f}",
        f"{barometric_pressure(altitude):.2f}",
        f"{temperature_lapse(altitude):.2f}",
        f"{voltage:.3f}",
        gps_time,
        f"{gps_lat:.6f}",
        f"{gps_lon:.6f}",
        f"{gps_alt:.2f}",
        random.randint(5, 12),  # satellites
        f"{a_x:.3f}",
        f"{a_y:.3f}",
        f"{a_z:.3f}",
        f"{gyro_x:.2f}",
        f"{gyro_y:.2f}",
        f"{gyro_z:.2f}",
        fsw_state,
        f"{angle_x:.2f}",
        f"{angle_y:.2f}",
        f"{angle_z:.2f}",
    ]

    # Append to CSV
    with open(CSV_PATH, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(row)

    time.sleep(INTERVAL)
