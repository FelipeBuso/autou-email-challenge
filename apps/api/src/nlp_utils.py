import os
import re
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    pipeline,
)
from datasets import Dataset
from PyPDF2 import PdfReader

MODEL_DIR = "./email_classifier"
LABEL_MAP = {"Improdutivo": 0, "Produtivo": 1}

DATA = [
    {"text": "Preciso abrir um chamado para reativar a internet", "label": "Produtivo"},
    {"text": "Obrigado pela ajuda!", "label": "Improdutivo"},
    {"text": "Atualizar senha do sistema", "label": "Produtivo"},
    {"text": "Parabéns pelo trabalho!", "label": "Improdutivo"},
]


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9áéíóúãõç\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def prepare_dataset(data):
    texts = [preprocess_text(d["text"]) for d in data]
    labels = [LABEL_MAP[d["label"]] for d in data]
    return Dataset.from_dict({"text": texts, "label": labels})


def train_model():
    dataset = prepare_dataset(DATA)
    tokenizer = AutoTokenizer.from_pretrained("neuralmind/bert-base-portuguese-cased")
    tokenized = dataset.map(
        lambda x: tokenizer(
            x["text"], truncation=True, padding="max_length", max_length=128
        ),
        batched=True,
    )

    model = AutoModelForSequenceClassification.from_pretrained(
        "neuralmind/bert-base-portuguese-cased", num_labels=2
    )

    args = TrainingArguments(
        output_dir=MODEL_DIR,
        per_device_train_batch_size=4,
        num_train_epochs=3,
        logging_steps=1,
        save_strategy="no",
    )

    trainer = Trainer(model=model, args=args, train_dataset=tokenized)

    trainer.train()
    os.makedirs(MODEL_DIR, exist_ok=True)
    model.save_pretrained(MODEL_DIR)
    tokenizer.save_pretrained(MODEL_DIR)


if not os.path.exists(MODEL_DIR):
    print("Treinando modelo BERT para classificação de emails...")
    train_model()
    print("Treinamento concluído.")

classifier = pipeline(
    "text-classification", model=MODEL_DIR, tokenizer=MODEL_DIR, device=-1
)


def classify_email(text: str):
    preprocessed = preprocess_text(text)
    result = classifier(preprocessed)[0]
    label = "Produtivo" if result["label"] == "LABEL_1" else "Improdutivo"
    suggested_response = (
        "Entraremos em contato em breve."
        if label == "Produtivo"
        else "Agradecemos sua mensagem!"
    )
    return {
        "original_text": text,
        "preprocessed_text": preprocessed,
        "label": label,
        "score": result["score"],
        "suggested_response": suggested_response,
    }


def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def extract_text_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()
