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
    return (
      <h1 className="text-7xl md:text-6xl font-extrabold text-indigo-600 mb-3 pb-285">
        {name}
      </h1>
    );
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
      <button
        className={`inline-flex rounded-md shadow disabled:opacity-50`}
        onClick={onClick}
        disabled={disabled}
      >
        <span
          className={`inline-flex items-center justify-center px-5 py-3 border-transparent 
            text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700`}
        >
          {label}
        </span>
      </button>
    );
  }

  function WalletMessage({
    onClick,
    isConnected,
  }: {
    onClick: () => void;
    isConnected: boolean;
  }) {
    return (
      <div>
        <button onClick={onClick}></button>
        <span>
          {isConnected ? "Wallet is connected" : "wallet is not connected"}
        </span>
      </div>
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
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col items-center justify-start py-8 pt-12 px-6 md:pt-20 text-zinc-700">
        <Title name="Partnerly" />

        <section className="max-w-md text-center mb-12">
          <p className="text-xl">
            Partnerly creates a smart contract for you and your partner that
            distributes the payments to the partnership contract in a
            predetermined split ratio.
          </p>
          {hasWalletWarning ? (
            <p className="mt-4 text-red-600">
              You will need MetaMask or equivalent to use this app.
            </p>
          ) : (
            <p>Your wallet is connected!</p>
          )}
          {!currnetAccount && (
            <div className="mt-4">
              <MainButton
                onClick={connectWallet}
                disabled={hasWalletWarning}
                label="Connect Wallet"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
