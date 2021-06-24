import { useContext, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Divider,
  Image,
  Typography,
  Button,
  Empty,
} from "antd";
import CardViewer from "./CardViewer";
import { useHistory } from "react-router";
import { UserContext } from "../context/context";
import MintNewCardImage from "../assets/mintNewCard.svg";
import * as api from "../utils/api";
import * as tx from "../utils/tx";
import { Account } from "../types";
import { formatBalance } from "../utils/helpers";

type Props = {
  address?: string;
  IsNotUser?: boolean;
};

export default function MyAccount({ address, IsNotUser }: Props) {
  const history = useHistory();
  const { userInfo } = useContext(UserContext);
  const [account, setAccount] = useState<Account | null>(null);
  const [funded, setFunded] = useState(false);

  useEffect(() => {
    const getAccountInfo = async () => {
      if (address) {
        try {
          const account = await api.getAccount(address);
          setAccount(account);
          return;
        } catch (err) {
          console.error(err);
          return;
        }
      }

      if (userInfo) {
        const account = await api.getAccount(userInfo.liskAddress);
        setAccount(account);
      }
    };

    getAccountInfo();
  }, [address, userInfo]);

  const addFunds = async () => {
    await tx.fundAccount(userInfo!.liskAddress);

    setFunded(true);
  };

  const handleClick = (id: string) => {
    history.push(`/card/${id}`);
  };

  const goto = (location: string) => {
    history.push(`/${location}`);
  };

  if (funded) {
    return (
      <div style={{ textAlign: "center", marginTop: "3em" }}>
        <Typography.Title level={3}>
          Account funded, refresh in a few seconds
        </Typography.Title>
      </div>
    );
  }

  if (!account && !IsNotUser && userInfo) {
    return (
      <div style={{ textAlign: "center", marginTop: "3em" }}>
        <Button onClick={addFunds} type="primary">
          Add Funds
        </Button>
      </div>
    );
  }

  if (!account) {
    return <Empty description="No account found" />;
  }

  const { cards } = account!.lc;

  return (
    <div>
      <Divider orientation="left">Account info</Divider>
      <Typography.Text style={{ display: "block", padding: "5px" }}>
        Address: <strong>{userInfo?.liskAddress || address}</strong>
      </Typography.Text>
      <Typography.Text style={{ display: "block", padding: "5px" }}>
        Balance:{" "}
        <strong>{formatBalance(BigInt(account.token.balance))} LCA</strong>
      </Typography.Text>
      <Typography.Text style={{ display: "block", padding: "5px" }}>
        Total cards owned: <strong>{account.lc.cards.length}</strong>
      </Typography.Text>

      <Divider orientation="left" style={{ marginTop: "3em" }}>
        Cards owned
      </Divider>

      <Row gutter={24}>
        {cards.map((card) => (
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
              </Card.Grid>
            </Card>
          </Col>
        ))}

        {!address && userInfo && (
          <Col span={6} xs={24} sm={12} md={8} lg={6} key="mintNewCard">
            <Card onClick={() => goto("mintcard")} bordered={false}>
              <Card.Grid
                style={{
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "none",
                }}
              >
                <Image
                  src={MintNewCardImage}
                  preview={false}
                  style={{
                    width: `100%`,

                    cursor: "pointer",
                  }}
                />
              </Card.Grid>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
