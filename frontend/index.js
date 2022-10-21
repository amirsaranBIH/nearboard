// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// NEAR
import { Nearboard } from './near-interface';
import { Wallet } from './near-wallet';
import { NearboardContextProvider } from './store/NearboardContext';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })

// Abstract the logic of interacting with the contract to simplify your flow
const nearboard = new Nearboard({ contractId: process.env.CONTRACT_NAME, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()

  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(
  <NearboardContextProvider isSignedInParam={isSignedIn} Nearboard={nearboard} wallet={wallet}>
    <App />
  </NearboardContextProvider>
  );
}