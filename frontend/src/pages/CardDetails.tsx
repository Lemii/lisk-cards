import { useParams } from "react-router-dom";
import Card from "../components/CardDetails";
import PageTitle from "../components/PageTitle";

export default function CardPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <PageTitle title="Card Details" />
      <Card id={id} />
    </div>
  );
}
