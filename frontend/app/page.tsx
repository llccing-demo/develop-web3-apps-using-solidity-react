"use client";

import { on } from "events";
import {
  useState,
  useEffect,
  useRef,
  ChangeEventHandler,
  ChangeEvent,
} from "react";
import { Web3 } from "web3";

interface Address {
  id: string;
  label: string;
  address: string;
  error: string;
  split: number;
}

export default function Home() {
  const [hasWalletWarning, setHasWalletWarning] = useState(false);
  const [currnetAccount, setCurrnetAccount] = useState(null);
  const web3 = useRef<Web3 | null>(null);

  const [partners, setPartners] = useState([
    {
      id: "1",
      label: "Parnter A",
      address: "",
      error: "",
      split: 1,
    },
    {
      id: "2",
      label: "Parnter B",
      address: "",
      error: "",
      split: 1,
    },
  ]);

  const addressInputs = partners.map((partner, index) => {
    return (
      <PartnerInput
        address={{
          label: partner.label,
          value: partner.address,
          onChange: (value) => {
            setPartners((oldPartnersState) => {
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].address = value;
              return newPartnersState;
            });
          },
          onBlur: (value) => {
            setPartners((oldPartnersState) => {
              const isValueAddress = web3.current?.utils.isAddress(value);
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].error = isValueAddress
                ? ""
                : "Invalid Address";
              return newPartnersState;
            });
          },
          error: partner.error,
        }}
        split={{
          name: partner.label,
          value: partner.split,
          onChange: (value) => {
            setPartners((oldPartnersState) => {
              const newPartnersState = [...oldPartnersState];
              newPartnersState[index].split = value;
              return newPartnersState;
            });
          },
        }}
        key={partner.label}
      />
    );
  });

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

  function AddressInput({
    label,
    value,
    onChange,
    onBlur,
    error,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: (value: string) => void;
    error: string;
  }) {
    return (
      <div className="flex flex-col">
        <label htmlFor={label}>{label}</label>
        <input
          name={label}
          value={value}
          type="text"
          onChange={(event) => onChange(event.target.value)}
          onBlur={(event) => onBlur(event.target.value)}
          className={"form-input rounded px-4 py-3"}
          placeholder="Wallet Address"
        />
        {error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : (
          <p className="text-sm">&nbsp;</p>
        )}
      </div>
    );
  }

  function SplitInput({
    name,
    value,
    onChange,
  }: {
    name: string;
    value: number;
    onChange: (value: number) => void;
  }) {
    return (
      <div className="flex flex-col">
        <label htmlFor={`split-${name}`}>Split</label>
        <input
          name={`split-${name}`}
          value={value}
          type="number"
          onChange={(event) => onChange(Number(event.target.value))}
          className={"form=-input rounded px-4 py-3"}
          placeholder={1 + ""}
          min={1}
          step={1}
        />
      </div>
    );
  }

  function PartnerInput({
    address,
    split,
  }: {
    address: {
      label: string;
      value: string;
      onChange: (value: string) => void;
      onBlur: (value: string) => void;
      error: string;
    };
    split: {
      name: string;
      value: number;
      onChange: (value: number) => void;
    };
  }) {
    return (
      <div className={"flex"}>
        <div className={"mr-3 w-full"}>
          <AddressInput
            label={address.label}
            value={address.value}
            onChange={address.onChange}
            onBlur={address.onBlur}
            error={address.error}
          />
        </div>
        <div className={"w-1/5"}>
          <SplitInput
            name={split.name}
            value={split.value}
            onChange={split.onChange}
          />
        </div>
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
          {hasWalletWarning && (
            <p className="mt-4 text-red-600">
              You will need MetaMask or equivalent to use this app.
            </p>
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

        { currnetAccount && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {addressInputs}
          </div>
        )}
      </main>
    </div>
  );
}
