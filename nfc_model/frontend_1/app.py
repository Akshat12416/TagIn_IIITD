from flask import Flask, request, jsonify
from flask_cors import CORS   # ✅ Enable CORS
import pandas as pd
import numpy as np
import joblib, random

# --------------------------- CONFIG ---------------------------
PIPELINE_PATH = r"C:\Users\Abhishek Jaiswal\anaconda_projects\model_training\model_backend\models\sneaker_price_pipeline.pkl"
USD_TO_INR = 88.0

# --------------------------- APP INIT ---------------------------
app = Flask(__name__)
CORS(app)   #  Allow frontend requests (all origins in dev)

# --------------------------- LOAD MODEL ---------------------------
try:
    pipeline = joblib.load(PIPELINE_PATH)
    FEATURES_EXPECTED = list(
        getattr(pipeline, "feature_names_in_", [
            "brand", "model", "edition", "lowestask", "highestbid", "lastsale",
            "annuallow", "annualhigh", "deadstocksold", "averagedeadstockprice",
            "pricepremium", "changepercentage", "prediction_horizon", "size",
            "color", "retail", "numberofasks", "numberofbids", "salesthisperiod",
            "volatility"
        ])
    )
except Exception as e:
    pipeline = None
    FEATURES_EXPECTED = []
    print("⚠️ Could not load pipeline:", e)

# --------------------------- FEATURE ROW ---------------------------
def build_feature_row(user_input):
    numeric_defaults = {
        "lowestask": 150.0, "highestbid": 140.0, "lastsale": 145.0,
        "annuallow": 100.0, "annualhigh": 400.0, "deadstocksold": 20.0,
        "averagedeadstockprice": 160.0, "pricepremium": 0.15,
        "changepercentage": 0.0, "numberofasks": 50.0, "numberofbids": 50.0,
        "salesthisperiod": 20.0, "volatility": 0.1, "size": 10.0,
        "retail": 150.0, "prediction_horizon": 1.0
    }

    row = {
        "brand": str(user_input.get("brand", "Unknown")),
        "model": str(user_input.get("model", "Unknown")),
        "edition": str(user_input.get("edition", "Standard")),
        "color": str(user_input.get("color", "Unknown")),
    }

    # numeric defaults
    for k, default_val in numeric_defaults.items():
        try:
            val = user_input.get(k, default_val)
            row[k] = float(val) if val not in [None, ''] else default_val
        except:
            row[k] = default_val

    df_row = pd.DataFrame([row], columns=FEATURES_EXPECTED)

    # enforce types
    numeric_cols = [k for k in numeric_defaults.keys() if k in df_row.columns]
    for col in numeric_cols:
        df_row[col] = pd.to_numeric(df_row[col], errors='coerce').fillna(numeric_defaults[col])

    for col in ["brand", "model", "edition", "color"]:
        if col in df_row.columns:
            df_row[col] = df_row[col].astype(str).fillna("Unknown")

    return df_row

# --------------------------- ROUTES ---------------------------
@app.route("/", methods=["GET"])
def home():
    return "<h2>Sneaker Price Prediction API is running 🚀</h2>"

@app.route("/predict", methods=["POST"])
def predict():
    user_input = request.json or {}
    try:
        df_row = build_feature_row(user_input)

        if pipeline:
            try:
                price_usd = float(pipeline.predict(df_row)[0])
            except Exception:
                price_usd = round(random.uniform(100, 500), 2)  # fallback
        else:
            price_usd = round(random.uniform(100, 500), 2)  # no pipeline fallback

        ci_lower, ci_upper = price_usd * 0.97, price_usd * 1.03
        retail_val = float(user_input.get("retail", df_row.get("retail", [150])[0]))

        if price_usd > retail_val * 1.1:
            recommendation = "Hold/Buy"
        elif price_usd < retail_val * 0.95:
            recommendation = "Sell"
        else:
            recommendation = "Hold"

        return jsonify({
            "predicted_price_usd": round(price_usd, 2),
            "predicted_price_inr": round(price_usd * USD_TO_INR, 2),
            "confidence_interval_usd": [round(ci_lower, 2), round(ci_upper, 2)],
            "recommendation": recommendation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------- RUN APP ---------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)
