import React, { createContext, useState, useContext } from "react";
import { Nearboard } from "../near-interface";
import LoadingContext from "./LoadingContext";

const NearboardContext = createContext({
  wallet: null,
  Nearboard: null,
  isSignedIn: false,
});

export function NearboardContextProvider({ children, isSignedInParam, wallet }) {
    const loadingContext = useContext(LoadingContext);
    const [isSignedIn, setIsSignedIn] = useState(isSignedInParam);

    const contract = new Nearboard({ contractId: process.env.CONTRACT_NAME || "", walletToUse: wallet, loadingContext });

    wallet.walletSelector.on("signedIn", () => {
        setIsSignedIn(true);
    });

    const context = {
        wallet,
        contract,
        isSignedIn,
        setIsSignedIn,
    };

    return (
        <NearboardContext.Provider value={context}>{children}</NearboardContext.Provider>
    );
}

export default NearboardContext;