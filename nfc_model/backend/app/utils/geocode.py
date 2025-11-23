import requests

def reverse_geocode(lat, lon):
    """Return city/town/village name from latitude and longitude."""
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
        headers = {"User-Agent": "nfc-hotspot-app"}
        res = requests.get(url, headers=headers, timeout=10)
        data = res.json()
        return data.get("address", {}).get("city") \
            or data.get("address", {}).get("town") \
            or data.get("address", {}).get("village") \
            or "Unknown"
    except Exception as e:
        print("Geocoding error:", e)
        return "Unknown"