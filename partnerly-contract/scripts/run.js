const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  const [owner, person1] = await hre.ethers.getSigners();
  const addresses = [owner.address, person1.address];

  const splitRatios = [1,1];

  const Contract = await hre.ethers.getContractFactory('Partnership')

  const contract = await Contract.deploy(addresses, splitRatios);

  console.log('Contract address:', await contract.getAddress());
  // this will throw error, because partnerAmount is private variable.
  // console.log('Partner amount:', await contract.partnerAmount());
  await console.log('First address:', await contract.addresses(0));
  await console.log(
    "First split ratio:",
    await contract.splitRatios(0),
  )
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
