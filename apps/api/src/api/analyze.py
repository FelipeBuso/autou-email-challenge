from fastapi import APIRouter, UploadFile, File, Form
from src.nlp_utils import classify_email, extract_text_from_pdf, extract_text_from_txt
import shutil
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.get("/")
def read_root():
    return {"Python": "on Vercel"}


@router.post("/classify-text")
async def classify_text_endpoint(text: str = Form(...)):
    return classify_email(text)


@router.post("/classify-file")
async def classify_file_endpoint(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file.filename.endswith(".txt"):
        text = extract_text_from_txt(file_path)
    else:
        return {"error": "Formato de arquivo não suportado."}

    return classify_email(text)
