const { run, ethers } = require('hardhat');

async function main() {
  await run('compile');
  const [owner] = await ethers.getSigners();
  const Contract = await ethers.getContractFactory('ChallengeAcceptPayments');
  const contract = await Contract.deploy();
  const contractAddress = await contract.getAddress();
  await owner.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther('5000.0')
  });
  console.log("Amount", ethers.parseEther("5000.0"));
  console.log("Contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});
