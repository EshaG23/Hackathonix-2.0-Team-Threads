from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth
import json, os, threading

from utils import distance_in_meters
from ai.plant_score import calculate_plant_percentage

with open("lakes.json", "r") as f:
    LAKES = json.load(f)

app = Flask(__name__)
CORS(app)
os.makedirs("uploads", exist_ok=True)

# Firebase initialization
cred = credentials.Certificate("firebase_admin.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def verify_user(request):
    header = request.headers.get("Authorization")
    if not header:
        return None

    try:
        token = header.split(" ")[1]
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

# ------------------------
# BACKGROUND SAM WORKER
# ------------------------
def run_sam_pipeline(doc_id, image_path):
    try:
        plant_percentage = calculate_plant_percentage(image_path)

        db.collection("reports").document(doc_id).update({
            "plant_percentage": plant_percentage,
            "status": "DONE"
        })
    except Exception as e:
        db.collection("reports").document(doc_id).update({
            "status": "FAILED",
            "error": str(e)
        })


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/create-user", methods=["POST"])
def create_user():
    decoded = verify_user(request)
    if not decoded:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = decoded["uid"]
    email = decoded["email"]

    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()

    if user_doc.exists:
        return jsonify({
            "message": "User already registered",
            "status": "EXISTS"
        }), 200

    user_ref.set({
        "user_id": user_id,
        "email": email,
        "ecoToken": 0,
        "createdAt": firestore.SERVER_TIMESTAMP
    })

    return jsonify({
        "message": "User created successfully",
        "status": "CREATED"
    }), 201


@app.route("/test-firebase")
def test_firebase():
    db.collection("test").add({
        "status": "Firebase connected"
    })
    return "Firebase OK"
@app.route("/report")
def report_page():
    return render_template("report.html")

@app.route("/api/lakes")
def get_lakes():
    return jsonify(LAKES)

@app.route("/api/user-coins")
def get_user_coins():
    decoded = verify_user(request)
    if not decoded:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = decoded["uid"]
    user_doc = db.collection("users").document(user_id).get()
    
    if user_doc.exists:
        coins = user_doc.get("ecoToken") or 0
        return jsonify({"coins": coins}), 200
    
    return jsonify({"coins": 0}), 200

# Submit Report
@app.route("/submit-report", methods=["POST"])
def submit_report():
    decoded = verify_user(request)
    if not decoded:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = decoded["uid"]

    lake_name = request.form.get("lake")
    lat = request.form.get("latitude")
    lng = request.form.get("longitude")
    image = request.files.get("image")

    if not lake_name or not lat or not lng or not image:
        return jsonify({"error": "Missing fields"}), 400

    if lake_name not in LAKES:
        return jsonify({"error": "Invalid lake"}), 400

    user_lat = float(lat)
    user_lng = float(lng)

    lake = LAKES[lake_name]
    lake_lat = lake["lat"]
    lake_lng = lake["lng"]

    # 🔴 100 meter distance check
    distance = distance_in_meters(
        user_lat, user_lng,
        lake_lat, lake_lng
    )

    if distance > 100:
        return jsonify({
            "error": "You are too far from the selected lake",
            "distance_m": round(distance, 2)
        }), 403

    # ✅ Passed distance check → continue
    os.makedirs("uploads", exist_ok=True)
    image_path = os.path.join("uploads", f"{user_id}_{lake['id']}.jpg")
    image.save(image_path)

    # 🔜 SAM will be added here later
    plant_percentage = None

    doc_ref = db.collection("reports").document()
    doc_ref.set({
        "user_id": user_id,
        "lake_id": lake["id"],
        "lake_name": lake_name,
        "latitude": user_lat,
        "longitude": user_lng,
        "distance_m": round(distance, 2),
        "plant_percentage": plant_percentage,
        "status": "PROCESSING",
        "createdAt": firestore.SERVER_TIMESTAMP
    })

    # 🪙 Reward user with +1 coin
    try:
        db.collection("users").document(user_id).update({
            "ecoToken": firestore.Increment(1)
        })
    except Exception as e:
        print(f"Error updating coins: {e}")

    # 🔥 TRIGGER SAM IMMEDIATELY
    threading.Thread(
        target=run_sam_pipeline,
        args=(doc_ref.id, image_path)
    ).start()

    return jsonify({
         "message": "Image received. AI processing started.",
        "distance_m": round(distance, 2),
        "coins_earned": 1
    }), 200



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
