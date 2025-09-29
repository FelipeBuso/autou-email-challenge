# src/api/email_classify.py
from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from src.nlp_utils import classify_email

router = APIRouter()


@router.post("/classify-email")
async def classify_email_endpoint(
    text: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)
):
    """
    Classifica um email enviado como texto ou arquivo PDF/TXT
    e sugere resposta automática.
    """
    if not text and not file:
        return {"error": "Envie texto ou arquivo para classificação."}

    if file:
        # salva temporariamente
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        result = classify_email(file_path=temp_path)
    else:
        result = classify_email(text=text)

    return result
