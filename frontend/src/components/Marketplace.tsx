import { Row, Col, Card, Empty, Divider } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LiskCard } from "../types";
import CardViewer from "./CardViewer";
import * as api from "../utils/api";

export default function Marketplace() {
  const [liskCards, setLiskCards] = useState<LiskCard[]>([]);
  const history = useHistory();

  const getAllCardsOnSale = async () => {
    const allCards = await api.getCardsOnSale();
    setLiskCards(allCards);
  };

  useEffect(() => {
    getAllCardsOnSale();
  }, []);

  const handleClick = (id: string) => {
    history.push(`/card/${id}`);
  };

  return (
    <div>
      <Divider orientation="left" style={{ marginBottom: "3em" }}>
        Cards for sale
      </Divider>
      {liskCards.length ? (
        <Row gutter={32}>
          {liskCards.map((card) => (
            <Col span={6} xs={24} sm={12} md={8} lg={6} key={card.id}>
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
                  <p>
                    Price: <strong>{card.price} LCA</strong>
                  </p>
                </Card.Grid>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
    </div>
  );
}
