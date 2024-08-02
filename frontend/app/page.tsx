"use client";

import { useState, useEffect, useRef } from "react";
import { Web3 } from "web3";

export default function Home() {
  const [hasWalletWarning, setHasWalletWarning] = useState(false);
  const [currnetAccount, setCurrnetAccount] = useState(null);
  const web3 = useRef<Web3 | null>(null);

  const checkIfWalletIsConnected = () => {
    return Boolean((window as any).ethereum);
  };

  const connectWallet = async () => {
    if (!checkIfWalletIsConnected()) {
      return;
    }

    try {
      const { ethereum } = window as any;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrnetAccount(accounts[0]);
    } catch (e) {
      console.error(e);
    }
  };

  function Title({ name }: { name: string }) {
    return <h1>Hello {name}</h1>;
  }

  function MainButton({
    onClick,
    disabled,
    label,
  }: {
    onClick: () => void;
    disabled: boolean;
    label: string;
  }) {
    return (
      <button onClick={onClick} disabled={disabled}>
        <span>{label}</span>
      </button>
    );
  }

  useEffect(() => {
    if (web3.current) {
      return;
    }

    const hasWallet = checkIfWalletIsConnected();
    setHasWalletWarning(!hasWallet);
    if (!hasWallet) {
      return;
    }

    web3.current = new Web3((window as any).ethereum);
    web3.current.eth.getBlock("latest").then((block) => console.log(block));
  }, []);

  return (
    <main>
      <Title name="Time" />

      {hasWalletWarning ? (
        <p>You will need MetaMask or equivalent to use this app.</p>
      ) : (
        <p>Your wallet is connected!</p>
      )}
      {!currnetAccount && (
        <div>
          <MainButton
            onClick={connectWallet}
            disabled={hasWalletWarning}
            label="Connect Wallet"
          />
        </div>
      )}
    </main>
  );
}
