import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def truncate_text(text, max_len=70):
    """Ensure text does not exceed CLIP context length."""
    words = str(text).split()
    if len(words) > max_len:
        return " ".join(words[:max_len])
    return str(text)

def compute_similarity(image_path, text_queries):
    """Compute similarity scores between image and text queries."""
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
    safe_queries = [truncate_text(q) for q in text_queries]
    text = clip.tokenize(safe_queries).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)
        similarities = (100.0 * image_features @ text_features.T).softmax(dim=-1)

    result = {}
    for idx, query in enumerate(text_queries):
        result[query] = similarities[0][idx].item()
    return result