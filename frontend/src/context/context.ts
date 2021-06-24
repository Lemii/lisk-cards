import { createContext } from "react";
import { UserContextType } from "../types";

// This needs to be initialized with the correct fields
export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => null,
});
