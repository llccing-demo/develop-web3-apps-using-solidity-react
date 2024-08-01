const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  const splitRatios = [6, 7, 8];

  const Contract = await hre.ethers.getContractFactory('ChallengeRatiosSplit')

  const contract = await Contract.deploy(splitRatios);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});