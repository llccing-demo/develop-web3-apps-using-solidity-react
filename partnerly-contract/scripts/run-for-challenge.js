const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  const [onwer] = await hre.ethers.getSigners();
  const Contract = await hre.ethers.getContractFactory('Challenge')

  const contract = await Contract.deploy(onwer.address);

  console.log('Contract address:', await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
