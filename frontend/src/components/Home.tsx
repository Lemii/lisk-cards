import { Row, Col, Typography, Divider, Button, Space, Card } from "antd";
import { useEffect, useState } from "react";
import { LiskCard } from "../types";
import CardViewer from "./CardViewer";
import { useHistory } from "react-router";
import * as api from "../utils/api";

const { Title } = Typography;

export default function Home() {
  const [liskCards, setLiskCards] = useState<LiskCard[]>([]);
  const history = useHistory();

  const getRecentCards = async () => {
    const cards = await api.getAllCards();
    setLiskCards(cards);
  };

  useEffect(() => {
    // load cards here
    getRecentCards();
  }, []);

  const handleClick = (id: string) => {
    history.push(`/card/${id}`);
  };

  const goto = (location: string) => {
    history.push(`/${location}`);
  };

  return (
    <div>
      <div
        style={{ textAlign: "center", marginTop: "6em", marginBottom: "6em" }}
      >
        <Title style={{ marginBottom: "5px" }}>
          Collect, share and trade Lisk Cards
        </Title>
        <Title level={4} style={{ marginTop: "0", marginBottom: "2em" }}>
          on the first Lisk collectables marketplace
        </Title>
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => goto("Marketplace")}
          >
            Explore
          </Button>
          <Button size="large" onClick={() => goto("mintcard")}>
            Mint a new card
          </Button>
        </Space>
      </div>
      <Divider orientation="left">Newest cards</Divider>
      <Row gutter={32} justify="center">
        {liskCards.slice(0, 3).map((card) => (
          <Col span={8} xs={24} sm={12} md={8} lg={8} key={card.id}>
            <Card onClick={() => handleClick(card.id)} bordered={false}>
              <Card.Grid
                style={{
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "none",
                }}
                hoverable={false}
              >
                <CardViewer code={card.code} />
              </Card.Grid>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
