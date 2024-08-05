'use client'
import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
import Contract from "../../../partnerly-contract/artifacts/contracts/Partnership.sol/Partnership.json";

export default function WithdrawPage() {
  const [hasWalletWarning, setHasWalletWarning] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContractAddress, setDeployedContractAddress] = useState("");
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

  useEffect(() => {
    const hasWallet = checkIfWalletIsConnected();
    setHasWalletWarning(!hasWallet);
  }, []);

  useEffect(() => {
    if (web3.current) {
      return;
    }

    if (!checkIfWalletIsConnected()) {
      return;
    }

    web3.current = new Web3((window as any).ethereum);
    web3.current.eth.getBlock("latest").then((block) => console.log(block));
  }, []);

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
              console.warn("on change newPartnersState", newPartnersState);
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
              console.log("on blur newPartnersState", newPartnersState);
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

  const handleStartPartnership = async () => {
    const addresses = [partners[0].address, partners[1].address];

    const splitRatios = [partners[0].split, partners[1].split];

    const contractArguments = [addresses, splitRatios];

    const { abi, bytecode } = Contract;
    const contract = new web3.current!.eth.Contract(abi);

    const contractDeploymentData = {
      data: bytecode,
      arguments: contractArguments,
    };

    const gas = await contract.deploy(contractDeploymentData).estimateGas();

    setIsDeploying(true);

    contract
      .deploy(contractDeploymentData)
      .send({ from: currentAccount!, gas: `${gas}` })
      .on("error", (error) => {
        console.error(error);
        setIsDeploying(false);
      })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setIsDeploying(false);

        setDeployedContractAddress(receipt.contractAddress as string);
      })
      .on("confirmation", () => {
        console.log("confirmation");
        setIsDeploying(false);
      });
  };

  const hasErrors = partners.some((partner) => partner.error);
  const hasEmptyValues = partners.some((partner) => !partner.address);

  const handleConfirm = () => {
    setDeployedContractAddress("");
  };

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
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.error(e);
    }
  };
  const addressInput = (
    <AddressInput
      label={""}
      value={address}
      onChange={(value) => {
        setAddress(value);
      }}
      onBlur={(value) => {
        const isValueAddress = web3.current!.utils.isAddress(value);
        setError(isValueAddress ? "" : "Enter a valid wallet address");
      }}
      error={error}
    />
  );

  function MainButton({
    onClick,
    disabled = false,
    label,
  }: {
    onClick: () => void;
    disabled?: boolean;
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

  const handleWithdraw = async () => {
    const { abi } = Contract;
    const contract = new web3.current!.eth.Contract(abi, address);

    const gas = await contract.methods.withdraw().estimateGas();

    setIsProcessing(true);

    contract.methods
      .withdraw()
      .send({ from: currentAccount!, gas: gas + "" })
      .on("error", (error) => {
        console.log("error", error);
        setIsProcessing(false);
      })
      .on("receipt", (receipt) => {
        // receipt will contain deployed contract address
        console.log("Receipt", receipt);

        setIsProcessing(false);
      })
      .on("confirmation", () => {
        console.log("Confirmed");
      });
  };
  return (
    <main className="flex flex-1 flex-col items-center justify-start py-8 pt-12 md:pt-20 text-zinc-700 px-6">
      <h1 className="text-5xl font-extrabold mb-3 pb-2">Withdraw</h1>

      <section className="max-w-md text-center">
        <p className="text-md mb-4">
          Initiate a payout from a given Partnerly contract to the recorded
          addresses in that contract.
        </p>

        {hasWalletWarning && (
          <p className="mt-4 text-red-600">
            You will need Metamask or equivalent to use this app.
          </p>
        )}

        {!currentAccount && (
          <div className="mt-4">
            <MainButton onClick={connectWallet} label={"Connect Wallet"} />
          </div>
        )}

        {currentAccount && (
          <section>
            <div className="grid grid-cols-1 gap-3 mb-3">{addressInput}</div>

            <div className="flex flex-col justify-center items-center">
              <div>
                <MainButton
                  onClick={handleWithdraw}
                  disabled={Boolean(error) || !Boolean(address) || isProcessing}
                  label={isProcessing ? "Processing" : "Withdraw"}
                />
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
