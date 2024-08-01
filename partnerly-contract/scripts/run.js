const {run, ethers} = require('hardhat');

async function main() {
  await run('compile');

  const [owner, person1, person2] = await ethers.getSigners();
  const addresses = [person1.address, person2.address];

  const splitRatios = [1,1];

  const Contract = await ethers.getContractFactory('Partnership')
  const provider = ethers.provider;

  const contract = await Contract.deploy(addresses, splitRatios);
  const contractAddress = await contract.getAddress();

  let balance1 = await provider.getBalance(person1.address)
  console.log('Person1 balance:', balance1.toString());

  let balance2 = await provider.getBalance(person2.address);
  console.log('Person2 balance:', balance2.toString());

  let contractBalance = await provider.getBalance(contractAddress);
  console.log("The balance in the contract is:", contractBalance.toString());


  await owner.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther('5.0')
  });
  console.log(`The balance in the contract after receiving funds is: ${await contract.getBalance()}`);


  await contract.withdraw();
  console.log(`The balance in the contract after withdrawing funds is: ${await contract.getBalance()}`);

  balance1 = await provider.getBalance(person1.address);
  console.log('Person1 balance:', balance1.toString());

  balance2 = await provider.getBalance(person2.address);
  console.log('Person2 balance:', balance2.toString());
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
