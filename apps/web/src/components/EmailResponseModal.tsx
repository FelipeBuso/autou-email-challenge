// src/components/EmailResponseModal.tsx
import React from "react";
import { Modal } from "antd";
import type { ClassificationResult } from "../api";

interface EmailResponseModalProps {
  response: ClassificationResult | null;
  onClose: () => void;
}

const EmailResponseModal: React.FC<EmailResponseModalProps> = ({
  response,
  onClose,
}) => {
  return (
    <Modal
      title="Classificação do Email"
      open={!!response}
      onCancel={onClose}
      onOk={onClose}
      okText="Fechar"
    >
      {response && (
        <div>
          <p>
            <strong>Texto Original:</strong> {response.original_text}
          </p>
          <p>
            <strong>Texto Pré-processado:</strong> {response.preprocessed_text}
          </p>
          <p>
            <strong>Categoria:</strong> {response.label}
          </p>
          <p>
            <strong>Score:</strong> {response.score.toFixed(2)}
          </p>
          <p>
            <strong>Resposta Sugerida:</strong> {response.suggested_response}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default EmailResponseModal;
