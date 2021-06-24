import { useContext, useState } from "react";
import { Card, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { UserContext } from "../context/context";
import { useHistory } from "react-router";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { removeCredentialsFromStorage } from "../utils/storage";

const { Header, Content, Footer } = Layout;

const menuItems = [
  {
    title: "Mint Card",
    path: "/mintcard",
    private: false,
  },
  {
    title: "Marketplace",
    path: "/marketplace",
    private: false,
  },
  {
    title: "Statistics",
    path: "/statistics",
    private: false,
  },
  {
    title: "My Account",
    path: "/account",
    private: true,
  },
];

const maxWidth = "1200px";

const AppLayout: React.FC = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState("home");
  const history = useHistory();
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleLogout = () => {
    setUserInfo(null);
    removeCredentialsFromStorage();
    history.push(`/`);
  };

  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          zIndex: 2,
          width: "100%",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[selectedItem]}
          onClick={({ key }) => setSelectedItem(key)}
          style={{ maxWidth, margin: "auto" }}
        >
          <Menu.Item key="home">
            <Link to="/">
              <span
                style={{
                  fontSize: "1.4em",
                  fontWeight: "bolder",
                  color: "white",
                  float: "left",
                }}
              >
                Lisk.Cards
              </span>
            </Link>
          </Menu.Item>

          {menuItems.map((item) => (
            <Menu.Item key={item.title} disabled={!userInfo && item.private}>
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          ))}

          {userInfo ? (
            <Menu.Item onClick={handleLogout}>
              Logout <LogoutOutlined />
            </Menu.Item>
          ) : (
            <Menu.Item key="login">
              <Link to="/login">
                Login{" "}
                <LoginOutlined
                  style={{
                    verticalAlign: "middle",
                    display: "inline-flex",
                    marginLeft: "0.3em",
                  }}
                />
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Content
        className="site-layout"
        style={{
          // padding: "3em",
          marginTop: 32,
          paddingBottom: 32,
          backgroundColor: "white",
          border: "none",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "auto",
            border: "none",
          }}
        >
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, border: "none" }}
          >
            {children}
          </div>
        </Card>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Lisk Cards ©2021 korben3 &amp; lemii
      </Footer>
      ;
    </Layout>
  );
};

export default AppLayout;
