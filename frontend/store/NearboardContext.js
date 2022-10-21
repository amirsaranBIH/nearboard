import { createContext, useState } from "react";

const NearboardContext = createContext({
  wallet: null,
  Nearboard: null,
  isSignedIn: false,
});

export function NearboardContextProvider({ children, isSignedInParam, wallet, Nearboard }) {
  const [isSignedIn, setIsSignedIn] = useState(isSignedInParam);

  const context = {
    wallet,
    Nearboard,
    isSignedIn,
    setIsSignedIn,
  };

  return (
    <NearboardContext.Provider value={context}>{children}</NearboardContext.Provider>
  );
}

export default NearboardContext;