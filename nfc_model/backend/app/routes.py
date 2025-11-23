# backend/app/routes.py
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import datetime
import json
import traceback

from app.models import get_reports_collection
from app.utils.clip_model import compute_similarity, truncate_text
from app.utils.geocode import reverse_geocode
from app.utils.hotspot import detect_hotspots

main = Blueprint("main", __name__)


def build_token_text(token_metadata: dict) -> str:
    """Extract meaningful descriptive text from metadata for CLIP comparison."""
    if not isinstance(token_metadata, dict):
        return truncate_text(str(token_metadata))

    # prioritize descriptive fields
    priority_keys = ["name", "brand", "product", "title", "type", "color", "category", "description"]
    parts = []
    for k in priority_keys:
        if k in token_metadata and token_metadata[k]:
            parts.append(str(token_metadata[k]))
    # fallback: all values
    if not parts:
        for v in token_metadata.values():
            if v:
                parts.append(str(v))
    return truncate_text(" ".join(parts))


@main.route("/api/report_mismatch", methods=["POST"])
def report_mismatch():
    """
    POST fields:
      - photo (file)
      - reported_brand (string)
      - lat, lon (optional floats)
      - token_metadata (JSON string)
    """
    try:
        photo = request.files.get("photo")
        reported_brand = request.form.get("reported_brand")
        lat = request.form.get("lat")
        lon = request.form.get("lon")
        token_metadata_raw = request.form.get("token_metadata")

        if not photo or not reported_brand or not token_metadata_raw:
            return jsonify({"error": "Missing required fields"}), 400

        try:
            token_metadata = json.loads(token_metadata_raw)
        except Exception:
            token_metadata = {"raw": token_metadata_raw}

        # Save file with timestamp prefix
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        safe_name = secure_filename(photo.filename or "upload.jpg")
        timestamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = f"{timestamp}_{safe_name}"
        filepath = os.path.join(upload_folder, filename)
        photo.save(filepath)

        # Build descriptive text for CLIP
        token_text = build_token_text(token_metadata)

        # Compute similarities
        try:
            sim_results = compute_similarity(filepath, [reported_brand, token_text])
            sim_brand = sim_results.get(truncate_text(reported_brand), 0.0)
            sim_token = sim_results.get(truncate_text(token_text), 0.0)
        except Exception as e:
            print("CLIP error:", e)
            traceback.print_exc()
            sim_brand = sim_token = 0.0

        # Decide label
        if sim_brand > 0.7:
            final_label = "verified"
        elif sim_token > 0.65 and sim_brand < 0.45:
            final_label = "confirmed_mismatch"
        else:
            final_label = "uncertain"

        # Reverse geocode
        try:
            lat_f = float(lat) if lat not in (None, "", "null") else None
            lon_f = float(lon) if lon not in (None, "", "null") else None
        except Exception:
            lat_f = lon_f = None
        city = reverse_geocode(lat_f, lon_f) if lat_f and lon_f else "Unknown"

        # Save report
        report_doc = {
            "photo_url": filepath,
            "photo_filename": filename,
            "reported_brand": reported_brand,
            "token_metadata": token_metadata,
            "sim_token": float(sim_token),
            "sim_brand": float(sim_brand),
            "final_label": final_label,
            "lat": lat_f,
            "lon": lon_f,
            "city": city,
            "created_at": datetime.datetime.utcnow()
        }
        get_reports_collection().insert_one(report_doc)

        # Debug log
        print(f"[report_mismatch] brand='{reported_brand}', token_text='{token_text}', "
              f"sim_brand={sim_brand:.4f}, sim_token={sim_token:.4f}, final_label={final_label}")

        return jsonify({
            "message": "Report stored",
            "final_label": final_label,
            "sim_brand": float(sim_brand),
            "sim_token": float(sim_token),
            "city": city
        }), 200

    except Exception as exc:
        print("Unhandled error in report_mismatch:", exc)
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


@main.route("/api/hotspots", methods=["GET"])
def get_hotspots():
    """
    Return aggregated hotspots where mismatches are concentrated.
    """
    try:
        reports = list(get_reports_collection().find({}, {"_id": 0}))
        result = detect_hotspots(reports)
        return jsonify(result), 200
    except Exception as exc:
        print("Error in get_hotspots:", exc)
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
    
    
@main.route("/api/get_reports", methods=["GET"])
def get_reports():
    """
    Return all reports from MongoDB (latest first)
    """
    try:
        reports_cursor = get_reports_collection().find().sort("created_at", -1).limit(100)
        reports = []
        for r in reports_cursor:
            r["_id"] = str(r["_id"])  # convert ObjectId to string for React
            reports.append(r)
        return jsonify({"reports": reports}), 200
    except Exception as exc:
        print("Error fetching reports:", exc)
        return jsonify({"error": "Internal server error"}), 500
    



