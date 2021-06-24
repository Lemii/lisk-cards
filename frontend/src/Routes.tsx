import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import MarketplacePage from "./pages/Marketplace";
import MyAccountPage from "./pages/MyAccount";
import AccountPage from "./pages/Account";
import LoginPage from "./pages/Login";
import StatisticsPage from "./pages/Statistics";
import MintCardPage from "./pages/MintCard";
import CardDetailsPage from "./pages/CardDetails";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/marketplace" component={MarketplacePage} />
      <Route exact path="/account" component={MyAccountPage} />
      <Route exact path="/account/:address" component={AccountPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/statistics" component={StatisticsPage} />
      <Route exact path="/mintcard" component={MintCardPage} />
      <Route exact path="/card/:id" component={CardDetailsPage} />
    </Switch>
  );
};

export default Routes;
