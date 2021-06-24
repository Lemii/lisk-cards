import { useCallback, useContext, useEffect, useState } from "react";
import { Typography, Button, Popconfirm } from "antd";
import { UserContext } from "../context/context";
import * as tx from "../utils/tx";
import * as api from "../utils/api";
import MintResult from "./MintResult";
import { LiskCard } from "../types";
import MintProgress from "./MintProgress";
import { handleError, notify } from "../utils/userFeedback";

export default function MintCard() {
  const { userInfo } = useContext(UserContext);
  const [showResult, setShowResult] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [mintedCard, setMintedCard] = useState<LiskCard | null>(null);
  const [infiniteMinterId, setInfiniteMinterId] = useState<any>();

  const stopInfiniteMinter = useCallback(() => {
    if (infiniteMinterId) {
      notify("info", "Infinite minter stopped", "Nay?");
      clearInterval(infiniteMinterId);
      setInfiniteMinterId(undefined);
    }
  }, [infiniteMinterId]);

  useEffect(() => {
    const subscribeHandler = (card: LiskCard) => {
      if (userInfo?.liskAddress === card.owner) {
        setMintedCard(card);
      }
    };

    api.subscribeToMintCard(subscribeHandler);

    return () => {
      stopInfiniteMinter();
    };
  }, [stopInfiniteMinter, userInfo?.liskAddress]);

  const mintCard = async () => {
    if (!userInfo) {
      notify("error", "Mint card failed", "User is not logged in.");
      return;
    }

    try {
      await tx.mintCard(userInfo.passphrase);
      setShowProgress(true);
    } catch (err) {
      handleError(err);
    }
  };

  const startInfiniteMinter = () => {
    // infinite minter, dev purposes only
    notify("info", "Infinite minter started", "Yay.");

    const id = setInterval(async () => {
      if (userInfo) {
        await tx.mintCard(userInfo.passphrase);
        notify(
          "success",
          "Card successfully minted!",
          "Powered by Infinite Miner ©2021"
        );
      }
    }, 10000);

    setInfiniteMinterId(id);
  };

  const progressCallback = () => {
    setShowResult(true);
    setShowProgress(false);
    notify("success", "Card successfully minted!", "Yay!");
  };

  const resetState = () => {
    setMintedCard(null);
    setShowResult(false);
  };

  return (
    <div>
      {showProgress && <MintProgress callback={progressCallback} />}

      {!showResult && !showProgress && (
        <>
          <div style={{ textAlign: "center", marginBottom: "3em" }}>
            <Typography.Title level={3}>
              Click on the button below to create a new Lisk Card!
            </Typography.Title>
            <Popconfirm
              title="Minting a new card costs 100 LCA, continue?"
              onConfirm={mintCard}
              okText="Yes"
              cancelText="No"
              placement="topRight"
              disabled={!userInfo}
            >
              <Button type="primary" size="large" disabled={!userInfo}>
                Mint a new card
              </Button>
            </Popconfirm>
          </div>

          <div
            style={{ maxWidth: "800px", margin: "auto", textAlign: "justify" }}
          >
            <p>
              Creating a new card costs 100 LCA tokens, the card will be
              randomly generated and assigned to the person paying the fee.
              <br />
              All new cards consist of 3 primary components:
            </p>
            <ul>
              <li>Color</li>
              <li>Image</li>
              <li>Stars</li>
            </ul>
            <p>
              Certain images and colors, like the lisk logo and gold color, are
              more rare and there is less chance to obtain these.
              <br />
              Each time you request a new card it will be a surprise!
            </p>
            <p>
              The "Type" you see on the card indicates the total rarity of the
              card, combining all the above mentioned components.
              <br />
              The scale goes from "common" to "legendary" which is the rarest
              type a card can be.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div style={{ textAlign: "center", marginTop: "5em" }}>
              <Button
                onClick={() =>
                  infiniteMinterId
                    ? stopInfiniteMinter()
                    : startInfiniteMinter()
                }
              >
                {infiniteMinterId ? "Stop" : "Start"} auto-minter (dev only)
              </Button>
            </div>
          )}
        </>
      )}

      {showResult && mintedCard && (
        <MintResult card={mintedCard} resetState={resetState} />
      )}
    </div>
  );
}
