import { useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Typography,
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
      <Typography.Title level={4}>Classificador de e-mail</Typography.Title>
      <Row
        justify="center"
        align="middle"
        style={{
          width: "70%",
          height: "50%",
          backgroundColor: "#ffffff",
          padding: "12px",
          borderRadius: "16px",
        }}
      >
        <Col
          xs={24}
          lg={15}
          style={{
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <Form
            style={{ width: "100%" }}
            onFinish={handleTextSubmit}
            layout="vertical"
          >
            <Form.Item name="text">
              <Input.TextArea
                placeholder="Cole ou digite o texto do email"
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
        </Col>
        <Col xs={24} lg={1}>
          <Flex style={{ width: "100%" }} justify="center">
            <Typography.Text>ou</Typography.Text>
          </Flex>
        </Col>
        <Col
          xs={24}
          lg={8}
          style={{
            width: "100%",
            height: "100%",

            padding: "16px",
            borderRadius: "8px",
            maxHeight: "180px",
          }}
        >
          <Flex
            vertical
            justify="space-around"
            align="center"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Upload
              style={{ width: "100%" }}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
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
        </Col>
      </Row>

      {response && (
        <EmailResponseModal response={response} onClose={handleCloseModal} />
      )}
    </Flex>
  );
};

export default EmailForm;
