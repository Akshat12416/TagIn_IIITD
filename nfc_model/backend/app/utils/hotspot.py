# backend/app/utils/hotspot.py
from collections import Counter

def detect_hotspots(reports, min_reports=3):
    """
    Detect hotspot cities based on mismatch frequency.
    """
    # Count only mismatched or uncertain labels
    city_counts = Counter(
        r.get("city", "Unknown")
        for r in reports
        if r.get("final_label") in ["confirmed_mismatch", "uncertain"]
    )

    # ✅ keep Unknown if you want testing to show aggregation
    hotspots = [
        {"city": city, "count": count}
        for city, count in city_counts.items()
        if count >= min_reports
    ]

    hotspots.sort(key=lambda x: x["count"], reverse=True)

    return {"hotspots": hotspots}