const hre = require('hardhat')
const { expect } = require('chai')

describe("Partnership", () => {
  it("can be deployed by providing two addresses on initialization", async () => {
    const Constract = await hre.ethers.getContractFactory('Partnership');

    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];

    await Constract.deploy(addresses);
  })

  it("can NOT be deployed when NOT providing addresses on initialization", async () => {
    const Constract = await hre.ethers.getContractFactory('Partnership');

    let error;
    try {
      await Constract.deploy();
    } catch (e) {
      error = e;
    } finally {
      expect(error).to.be.ok;
    }
  })
})
