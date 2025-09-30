import { useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import EmailResponseModal from "./EmailResponseModal";
import { classifyFile, classifyText, type ClassificationResult } from "../api";
import Logo from "../assets/logo-autou.webp";

const EmailForm = () => {
  const [response, setResponse] = useState<ClassificationResult | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);
  const [emailText, setEmailText] = useState("");

  const handleTextSubmit = async (values: { text: string }) => {
    try {
      const res = await classifyText(values.text);
      setResponse(res);
    } catch (err) {
      console.error(err);
      message.error("Erro ao classificar o texto.");
    }
  };

  const handleFileSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("Selecione um arquivo antes de enviar.");
      return;
    }

    try {
      const res = await classifyFile(fileList[0]);
      setResponse(res);
    } catch (err) {
      console.error(err);
      message.error("Erro ao classificar o arquivo.");
    }
  };

  const handleCloseModal = () => setResponse(null);

  return (
    <Flex
      align="center"
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#e1e1e1",
      }}
      vertical
      gap="64px"
    >
      <Image src={Logo} style={{ marginTop: "64px" }} preview={false} />

      <Flex
        align="center"
        style={{
          width: "70%",
          backgroundColor: "#ffffff",
          padding: "12px",
          borderRadius: "16px",
        }}
        gap="middle"
      >
        <Flex
          style={{
            width: "65%",
            border: "solid 1px #d0d0d0",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <Form
            style={{ width: "100%" }}
            onFinish={handleTextSubmit}
            layout="vertical"
          >
            <Form.Item name="text" label="Texto do Email">
              <Input.TextArea
                disabled={fileList.length > 0}
                onChange={(e) => {
                  setEmailText(e.target.value);
                }}
                rows={4}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={fileList.length > 0}
              >
                Classificar Texto
              </Button>
            </Form.Item>
          </Form>
        </Flex>

        <Flex
          vertical
          justify="center"
          align="center"
          style={{
            width: "35%",
            height: "100%",
            border: "solid 1px #d0d0d0",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <Upload
            style={{ width: "100%" }}
            beforeUpload={(file) => {
              setFileList([file]);
              return false; // evita upload automático
            }}
            fileList={fileList}
            onRemove={() => setFileList([])}
          >
            <Button
              disabled={!!emailText}
              style={{ width: "100%" }}
              icon={<UploadOutlined />}
            >
              Selecionar Arquivo
            </Button>
          </Upload>
          <Button
            type="primary"
            style={{ marginTop: 10 }}
            onClick={handleFileSubmit}
            disabled={fileList.length === 0}
          >
            Classificar Arquivo
          </Button>
        </Flex>
      </Flex>

      {response && (
        <EmailResponseModal response={response} onClose={handleCloseModal} />
      )}
    </Flex>
  );
};

export default EmailForm;
