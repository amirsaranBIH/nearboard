import { createContext, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
});

export function LoadingContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const context = {
    isLoading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={context}>
      {children}
    </LoadingContext.Provider>
  );
}

export default LoadingContext;