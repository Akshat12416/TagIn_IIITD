from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['product_verification']
products_collection = db['products']
transfers_collection = db['transfers']  
 
#Register product by the user
@app.route('/api/register', methods=['POST'])
def register_product():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["name", "serial", "model", "type", "color", "date", 
                       "tokenId", "metadataHash", "manufacturer", "owner"]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        data['tokenId'] = str(data['tokenId'])  # 👈 force to string
        products_collection.insert_one(data)
        return jsonify({"message": "✅ Product registered successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Manufacturer dashboard routing to get all products data
@app.route('/api/products', methods=['GET'])
def get_all_products():
    try:
        products = list(products_collection.find({}, {"_id": 0}))
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#Verifying product by user (backend part)
@app.route('/api/product/<token_id>', methods=['GET'])
def get_product_by_token_id(token_id):
    try:
        product = products_collection.find_one({"tokenId": str(token_id)}, {"_id": 0})
        if product:
            return jsonify(product), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#Ownership transfer by the manufacturer
@app.route('/api/transfer', methods=['POST'])
def transfer_ownership():
    data = request.json
    required_fields = ['tokenId', 'from', 'to', 'timestamp']

    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        token_id = str(data['tokenId'])
        from_address = data['from']
        to_address = data['to']
        timestamp = data['timestamp']

        # Update the owner in the product document
        update_result = products_collection.update_one(
            {'tokenId': token_id},
            {'$set': {'owner': to_address}}
        )

        if update_result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404

        # Insert transfer record
        transfers_collection.insert_one({
            'tokenId': token_id,
            'from': from_address,
            'to': to_address,
            'timestamp': timestamp
        })

        return jsonify({"message": "Ownership transferred successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#showing trasnfer history to user by transfers collection
@app.route('/api/transfers/<token_id>', methods=['GET'])
def get_transfer_history(token_id):
    try:
        history = list(transfers_collection.find({"tokenId": token_id}, {"_id": 0}))
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
