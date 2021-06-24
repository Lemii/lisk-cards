import {
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Popconfirm,
  Input,
  Empty,
} from "antd";
import { useEffect, useState, useContext } from "react";
import CardViewer from "./CardViewer";
import * as api from "../utils/api";
import { CodeVariables, LiskCard } from "../types";
import { UserContext } from "../context/context";
import * as tx from "../utils/tx";
import { handleError, notify } from "../utils/userFeedback";
import { getDateFromTimestamp } from "../utils/helpers";
import { Link } from "react-router-dom";
import { extractCode } from "../utils/extractCode";
import { imageNames } from "../constants";

type Props = { id: string };

export default function CardDetails({ id }: Props) {
  const [card, setCard] = useState<LiskCard | null>(null);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [showRip, setShowRip] = useState(false);
  const { userInfo } = useContext(UserContext);
  const [sellPrice, setSellPrice] = useState<number | undefined>();

  useEffect(() => {
    const getCardDetails = async () => {
      const data = await api.getCardById(id);
      setCard(data);
    };

    getCardDetails();
  }, [id]);

  useEffect(() => {
    if (isDestroyed) {
      setTimeout(() => {
        setShowRip(true);
      }, 5000);
    }
  }, [isDestroyed]);

  const handlePriceChange = (numberAsString: string) => {
    const num = Number(numberAsString);
    if (isNaN(num)) {
      return;
    }
    setSellPrice(num);
  };

  const sellCard = async () => {
    if (!sellPrice || sellPrice < 1) {
      notify("error", "Sell Error", "Sell price should be higher than 1");
      return;
    }

    try {
      await tx.sellCard(id, sellPrice, userInfo!.passphrase);
      notify(
        "success",
        "Sell Successful!",
        `Your card is now on the marketplace for: ${sellPrice} LCA`
      );
      // Optimistically update state
      setCard({ ...(card as LiskCard), forSale: true, price: sellPrice });
    } catch (err) {
      handleError(err);
    }
  };

  const buyCard = async () => {
    try {
      await tx.buyCard(id, userInfo!.passphrase);
      notify(
        "success",
        "Buy Successful!",
        "Congratulations! You just bought a new card!"
      );
      // Optimistically update state
      setCard({
        ...(card as LiskCard),
        forSale: false,
        owner: userInfo!.liskAddress,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const cancelCard = async () => {
    try {
      await tx.cancelCard(id, userInfo!.passphrase);
      notify(
        "success",
        "Cancel successful!",
        "Your card is no longer on the marketplace"
      );
      // Optimistically update state
      setCard({ ...(card as LiskCard), forSale: false });
    } catch (err) {
      handleError(err);
    }
  };

  const destroyCard = async () => {
    try {
      await tx.destroyCard(id, userInfo!.passphrase);
      setIsDestroyed(true);
      setTimeout(() => {
        setShowRip(true);
      }, 3000);

      notify(
        "success",
        "Destroyed Successfully!",
        "Your card has been destroyed."
      );
    } catch (err) {
      handleError(err);
    }
  };

  if (!card) {
    // insert cool 'not found' element here, like <Empty />
    return <Empty description="Card not found" />;
  }

  const getName = () => {
    const codeVariables: CodeVariables = extractCode(card.code);
    return imageNames[codeVariables.image];
  };

  const disableBuyButton = !userInfo || !card.forSale;
  const disableSellButton = card.forSale;
  const userIsOwner = userInfo?.liskAddress === card.owner;

  return showRip ? (
    <div style={{ textAlign: "center" }}>
      <Typography.Title level={2} style={{ marginTop: "3em" }}>
        Rest in Peace, {getName()} ☠️
      </Typography.Title>

      <Typography.Text>Card id: {card.id}</Typography.Text>
      <br />
      <br />
      <br />

      <Typography.Text style={{ marginTop: "3em" }}>
        <Link to={`/statistics`}>Go to Statistics</Link>
      </Typography.Text>
    </div>
  ) : (
    <div className={isDestroyed ? "death" : ""}>
      <Row gutter={32}>
        <Col
          style={{ textAlign: "right" }}
          span={12}
          xs={24}
          sm={12}
          md={12}
          lg={12}
          key={card.id}
        >
          <div style={{ width: "80%" }}>
            <CardViewer code={card.code} />
          </div>
        </Col>
        <Col span={12} xs={24} sm={12} md={12} lg={12} key="Descriptions">
          <Divider orientation="left">Price</Divider>

          <Typography.Title level={2}>
            {card.timesSold === 0 && !card.forSale
              ? "N/A"
              : `${card.price} LCA`}
          </Typography.Title>

          {userIsOwner && card.forSale && (
            <Popconfirm
              title={`Would you like to remove this card from the marketplace?`}
              onConfirm={cancelCard}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button type="primary" size="large">
                Cancel sell order
              </Button>
            </Popconfirm>
          )}

          {userIsOwner && !card.forSale && (
            <div>
              <Input
                placeholder="Input a sell price"
                maxLength={6}
                disabled={disableSellButton}
                style={{
                  display: "inline-block",
                  width: "10em",
                  marginRight: "1em",
                }}
                value={sellPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
              />

              <Popconfirm
                title={`Selling this card costs 1 LCA, continue?`}
                okText="Yes"
                cancelText="No"
                placement="topRight"
                onConfirm={sellCard}
                style={{ display: "inline-block" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disableSellButton}
                >
                  Sell
                </Button>
              </Popconfirm>
            </div>
          )}

          {!userIsOwner && (
            <Popconfirm
              title={`Buying this card costs ${card.price} LCA + 1 LCA fee, continue?`}
              onConfirm={buyCard}
              okText="Yes"
              cancelText="No"
              placement="topRight"
              disabled={disableBuyButton}
            >
              <Button type="primary" size="large" disabled={disableBuyButton}>
                Buy now
              </Button>
            </Popconfirm>
          )}

          <Divider orientation="left" style={{ marginTop: "3em" }}>
            Card Details
          </Divider>
          <Typography.Text style={{ display: "block", padding: "5px" }}>
            Owner:{" "}
            <strong>
              <Link to={`/account/${card.owner}`}>{card.owner}</Link>
            </strong>
          </Typography.Text>
          <Typography.Text style={{ display: "block", padding: "5px" }}>
            Date first minted <small>(YYYY-MM-DD)</small>:{" "}
            <strong>{getDateFromTimestamp(+card.dateMinted)}</strong>
          </Typography.Text>
          <Typography.Text style={{ display: "block", padding: "5px" }}>
            Times sold: <strong>{card.timesSold}</strong>
          </Typography.Text>
          <Typography.Text style={{ display: "block", padding: "5px" }}>
            Id: <strong>{id}</strong>
          </Typography.Text>

          {userIsOwner && (
            <div style={{ textAlign: "right", paddingTop: "50%" }}>
              <Popconfirm
                title={`Destroying this card  costs 5 LCA, continue?`}
                onConfirm={destroyCard}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Button danger>Destroy card</Button>
              </Popconfirm>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
