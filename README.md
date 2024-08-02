# Introduction to Web3.0

## History of the web

### Web 1.0

focus on providing information and resources to users. rather than allowing users to actively contribute or interact with the content on websites.

### Web 2.0

Allowed users to create, share, and exchange information and content online in a more interactive and collaborative way.

Issues like Denial of Service(Dos) attacks, censorship, third-party interference, downtime, etc.

The data and content are centralized in a small group of companies referred to the "Big Tech". 

*Big Four*, Google, Amazon, Fackbook, Apple, known as GAFA. GAMA, cause facebook rebranded itself as Meta.

*Big Five*, GAMA add Microsoft.

### Web 3.0

The term Web 3.0 (also known as Web3) was coined by Polkadot's and Ethereum's cofounder Gavin Wood in 2014, referring to the "Decentralized online ecosystem based on blockchain."


## Ethereum and Ethereum Virtual Machine (EVM)

Ethereum is a blockchain-based implementation of Web3. It's a platform that runs smart contracts.

EVM prevents DOS attacks and ensures taht programs do not have access to each other's states, ensuring the ability to establish without any potential interference.

## Smart contracts

Ethereum introduced smart contracts, which are considered the building blocks of decentralized finance(DeFi) and are associated with cryptocurrencies. 

Smart contracts dismiss the need for intermediates and arbitration costs, and exclude the possibility of fraud.

## Solididty

Solidity is a high-level, object and contract-oriented language influenced by C++, JavaScript, and Python.

It works with Ethereum Virtual Machine (EVM).

# Introduction to Solidity and Smart Contract Development

## Web3 Apps and Initialization and Execution of Contracts

## Challenge: Create a Contract

```shell
use command `node scripts/run.js` or
~/projects/github/educative/develop-web3-apps-using-solidity-react/partnerly-contract$ npm run dev

> partnerly-contract@1.0.0 dev
> node scripts/run.js

Nothing to compile
Partnership contract deployed
Partnership deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

as the result uppper, I completed my first contract

## Details of the Contract

## Challenge: Create a Contract with Attritubes and Functions

## Smart Contracts Continued

Add split ratios to contract and add test

## Requiring Valid Arguments

Test first, TDD, test drive development.

A `pure` function means that the operation inside the function doesn’t rely on any external state.

## Challenge: Split Ratios

Split ratios in smart contracts typically refer to the way funds or tokens are distributed among different parties or addresses. This concept is often used in various blockchain applications, such as revenue sharing, token distribution, or automatic payments

```

contract ChallengeRatiosSplit {
    uint256[] public splitRatios;

    constructor(uint256[] memory _splitRatios) {
        require(
            _splitRatios.length > 2,
            "More than two address should be provided to establish a partnership"
        );

        checkSplitRatios(_splitRatios);

        splitRatios = _splitRatios;
        console.log("Constract is deployed");
    }

    function checkSplitRatios(uint256[] memory _splitRatios) private pure {
        for (uint256 i = 0; i < _splitRatios.length; i++) {
            require(
                _splitRatios[i] > 5,
                "Split ratio should be greater than five"
            );
        }
    }
}
```

## Receiving Payments

code in js
```
  await owner.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther('5.0')
  });
```

code in .sol
```
receive() external payable {}
```

## Sending Payments

code in js
```
 partnership.withdraw()

```

code in .sol
```
 function withdraw() public {
    uint256 balance = getBalance();
    uint256 addressesLength = addresses.length;
    
    // console.log("before Balance: %s", balance);

    require(balance > 0, "Insufficient balance");

    require(balance >= splitRatiosTotal, "Balance should be greater than the total split ratio");

    for (uint256 i = 0; i < addressesLength; i++) {
      addresses[i].transfer(
        (balance/splitRatiosTotal) * splitRatios[i]
      );
    }

    // console.log("after Balance: %s", getBalance());
  }

```

## Chapter Summary

- Through upper, what we have known:
- Permanently store data
- Securely receive transactions
- Store funds
- Transfer those funds to specified accounts (wallet addresses)

# Introduction to Web3 App Development Using Solidity and React

## Getting Started

use nextjs create a new project

```shell
npx create-next-app@latest
```

## Checking for a Wallet

```js
const checkIfWalletIsConnected = () => {
    return Boolean((window as any).ethereum);
  };
```

## Interacting with the Blockchain

## Connecting to the Wallet

## Styling the App

## Capturing the Contract Details

## Adding a way to Deply the Contract

## Displaying the Deployed Contract Address

## Implementing the withdraw Function 

## Navigating to the Withdraw Page

## Conclusion



