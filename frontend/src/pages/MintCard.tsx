import { Divider } from "antd";
import MintCard from "../components/MintCard";
import PageTitle from "../components/PageTitle";

export default function MintCardPage() {
  return (
    <div>
      <PageTitle title="Mint Card" />

      <Divider style={{ marginBottom: "3em" }} />

      <MintCard />
    </div>
  );
}
