"use client";

import { useState, useEffect } from "react";

function Title({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}

export default function Home() {
  const [hasWalletWarning, setHasWalletWarning] = useState(false);
  const checkIfWalletIsConnected = () => {
    return Boolean((window as any).ethereum);
  };

  useEffect(() => {
    const hasWallet = checkIfWalletIsConnected();
    setHasWalletWarning(!hasWallet);
  }, []);

  return (
    <main>
      <Title name="Time" />

      {hasWalletWarning ? (
        <p>You will need MetaMask or equivalent to use this app.</p>
      ) : (
        <p>Your wallet is connected!</p>
      )}
    </main>
  );
}
