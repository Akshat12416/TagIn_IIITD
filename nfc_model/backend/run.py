from app import create_app

app = create_app()

if __name__ == "__main__":
    # Run Flask on all interfaces, port 5000, with debug enabled
    app.run(host="0.0.0.0", port=5002, debug=True)
