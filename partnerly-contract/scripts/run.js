const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  const Contract = await hre.ethers.getContractFactory('Partnership')

  const contract = await Contract.deploy();

  const address = await contract.getAddress()

  console.log('Partnership deployed to:', address);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});