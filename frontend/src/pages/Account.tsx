import { useParams } from "react-router-dom";
import Account from "../components/Account";
import PageTitle from "../components/PageTitle";

export default function AccountPage() {
  const { address } = useParams<{ address: string }>();

  return (
    <div>
      <PageTitle title="Account" />
      <Account address={address} IsNotUser />
    </div>
  );
}
