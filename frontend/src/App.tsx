import { useState } from "react";
import Routes from "./Routes";
import AppLayout from "./components/Layout";
import { UserContext } from "./context/context";
import { Credentials } from "./types";
import { getCredentialsFromStorage } from "./utils/storage";

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<Credentials | null>(
    getCredentialsFromStorage()
  );

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <AppLayout>
        <Routes />
      </AppLayout>
    </UserContext.Provider>
  );
};

export default App;
