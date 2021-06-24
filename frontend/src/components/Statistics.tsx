import { Col, Empty, Row, Typography, Divider, Card } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Statistics, CodeVariables, LiskCard } from "../types";
import { getStatistics, getGraveyard } from "../utils/api";
import { extractCode } from "../utils/extractCode";
import { calculateRarity } from "../utils/calculateRarity";
import CardViewer from "./CardViewer";
import { truncateMiddle } from "../utils/helpers";
import { Link } from "react-router-dom";

export default function Stats() {
  const [statistics, setStatistics] = useState<Statistics>({
    rarestCard: undefined,
    mostSoldCard: undefined,
    highestPriceSoldCard: undefined,
  });

  const [graveyard, setGraveyard] = useState<LiskCard[]>([]);
  const history = useHistory();

  const fetchStatistics = async () => {
    const data = await getStatistics();
    setStatistics(data);
  };

  const fetchGraveyard = async () => {
    const data = await getGraveyard();
    setGraveyard(data);
  };

  useEffect(() => {
    fetchStatistics();
    fetchGraveyard();
  }, []);

  const showRarity = (code: string) => {
    const codeVariables: CodeVariables = extractCode(code);

    const cardRarity: string = calculateRarity(codeVariables);
    return cardRarity;
  };

  const handleClick = (id: string | undefined) => {
    if (!id) return;

    history.push(`/card/${id}`);
  };

  const { rarestCard, mostSoldCard, highestPriceSoldCard } = statistics;

  return (
    <>
      <Divider orientation="left">Top Cards</Divider>
      <Row gutter={64}>
        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>Rarest Card</Typography.Title>

          {rarestCard ? (
            <>
              <div onClick={() => handleClick(rarestCard.id)}>
                <CardViewer code={rarestCard.code} />
              </div>
              <Typography.Text style={{ display: "block" }}>
                Rarity: <strong>{showRarity(rarestCard.code)}</strong>
                <br />
                Owner:{" "}
                <Link to={`/account/${rarestCard.owner}`}>
                  {truncateMiddle(rarestCard.owner, 16)}
                </Link>
              </Typography.Text>
            </>
          ) : (
            <Empty />
          )}
        </Col>

        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>Most Sold Card</Typography.Title>

          {mostSoldCard ? (
            <>
              <div onClick={() => handleClick(mostSoldCard.id)}>
                <CardViewer code={mostSoldCard.code} />
              </div>
              <Typography.Text style={{ display: "block" }}>
                Times sold: <strong>{mostSoldCard.timesSold}</strong>
                <br />
                Owner:{" "}
                <Link to={`/account/${mostSoldCard.owner}`}>
                  {truncateMiddle(mostSoldCard.owner, 16)}
                </Link>
              </Typography.Text>
            </>
          ) : (
            <Empty />
          )}
        </Col>

        <Col span={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>Most Expensive Card</Typography.Title>

          {highestPriceSoldCard ? (
            <>
              <div onClick={() => handleClick(highestPriceSoldCard.id)}>
                <CardViewer code={highestPriceSoldCard.code} />
              </div>
              <Typography.Text style={{ display: "block" }}>
                Price: <strong>{highestPriceSoldCard.price} LCA</strong>
                <br />
                Owner:{" "}
                <Link to={`/account/${highestPriceSoldCard.owner}`}>
                  {truncateMiddle(highestPriceSoldCard.owner, 16)}
                </Link>
              </Typography.Text>
            </>
          ) : (
            <Empty />
          )}
        </Col>
      </Row>

      <Divider orientation="left" style={{ marginTop: "6em" }}>
        Graveyard (destroyed cards)
      </Divider>

      {graveyard.length > 0 ? (
        <Row gutter={24}>
          {graveyard.map((card) => (
            <Col span={6} xs={24} sm={12} md={8} lg={6} key={card.id}>
              <Card bordered={false}>
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "none",
                  }}
                  hoverable={false}
                >
                  <CardViewer code={card.code} isDestroyed />
                  Owner:{" "}
                  <Link to={`/account/${card.owner}`}>
                    {truncateMiddle(card.owner, 16)}
                  </Link>
                </Card.Grid>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
    </>
  );
}
