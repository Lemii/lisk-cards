import { useState, useContext } from "react";
import { UserContext } from "../context/context";
import { Form, Input, Button, Row, Col, Card, Space, Typography } from "antd";
import { validation } from "@liskhq/lisk-passphrase";
import { useHistory } from "react-router";
import { Credentials } from "../types";
import { getCredentials } from "../utils/crypto";
import { saveCredentialsToStorage } from "../utils/storage";
import { notify } from "../utils/userFeedback";

const { Text } = Typography;

export default function Login() {
  const history = useHistory();
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const { setUserInfo } = useContext(UserContext);

  const onFinish = (values: { password: string }) => {
    const userPassphrase = values.password;

    //verify if the passphrase is correct
    const errors = validation.getPassphraseValidationErrors(userPassphrase);

    if (!errors.length) {
      const credentials = getCredentials(userPassphrase);
      setUserInfo(credentials);
      saveCredentialsToStorage(credentials);
      notify("success", "Login successful", "Welcome back!");
      history.push(`/account`);
    } else {
      notify("error", "Login failed", "Incorrect passphrase");
    }
  };

  const newAccount = () => {
    const credentials = getCredentials();
    setCredentials(credentials);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12} xs={24} sm={24} md={12} lg={12}>
          <Card title="Login">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Passphrase"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your passphrase!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12} xs={24} sm={24} md={12} lg={12}>
          <Card title="New account">
            <Space direction="vertical">
              <Button onClick={newAccount}>Generate new account</Button>
              <br />
              {credentials && (
                <>
                  <Text strong>Lisk address: </Text>{" "}
                  <Text copyable style={{ overflowWrap: "anywhere" }}>
                    {credentials.liskAddress}
                  </Text>
                  <br />
                  <Text strong>Binary address: </Text>{" "}
                  <Text copyable style={{ overflowWrap: "anywhere" }}>
                    {credentials.binaryAddress}
                  </Text>
                  <br />
                  <Text strong>Passphrase: </Text>{" "}
                  <Text copyable style={{ overflowWrap: "anywhere" }}>
                    {credentials.passphrase}
                  </Text>
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
