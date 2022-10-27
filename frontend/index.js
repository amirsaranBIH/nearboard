// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// NEAR
import { Wallet } from './near-wallet';
import { LoadingContextProvider } from './store/LoadingContext';
import { NearboardContextProvider } from './store/NearboardContext';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()

  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(
    <LoadingContextProvider>
      <NearboardContextProvider isSignedInParam={isSignedIn} wallet={wallet}>
        <App />
      </NearboardContextProvider>
    </LoadingContextProvider>
  );
}