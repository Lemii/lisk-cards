import { Button } from "antd";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { LiskCard } from "../types";
import CardViewer from "./CardViewer";

type Props = { card: LiskCard; resetState: () => void };

export default function MintResult({ card, resetState }: Props) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          maxWidth: "300px",
          margin: "auto",
        }}
      >
        <CardViewer code={card.code} />

        <Button
          type="primary"
          style={{ marginTop: "3em" }}
          onClick={resetState}
          size="large"
        >
          Mint Another Card
        </Button>
      </div>
    </div>
  );
}
