const hre = require('hardhat')
const { expect } = require('chai')

describe("Partnership", () => {
  // it("can be deployed by providing two addresses on initialization", async () => {
  //   const Constract = await hre.ethers.getContractFactory('Partnership');

  //   const [owner, person1] = await hre.ethers.getSigners();
  //   const addresses = [owner.address, person1.address];

  //   await Constract.deploy(addresses);
  // })

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

  it("can be deployed by providing at least two adresses and equal aomunts of split\
    ratios on initialization", async () => {
    const Constract = await hre.ethers.getContractFactory('Partnership');
    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 1];

    await Constract.deploy(addresses, splitRatios);
  })

  it("can NOT be deployed when the split ratios are not equivalent to the\
    address amount", async () => {
    const Constract = await hre.ethers.getContractFactory('Partnership');
    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 1, 1];

    await expect(Constract.deploy(addresses, splitRatios))
      .to.be.revertedWith("the address amount and the split ratio amount should be equal");

  });

  it('can NOT be deployed when the address amount is less than 2', async () => {
    const Constract = await hre.ethers.getContractFactory('Partnership');
    const [owner] = await hre.ethers.getSigners();
    const addresses = [owner.address];
    const splitRatios = [1];
    await expect(Constract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "More than one address should be provided to establish a partnership"
    );
  })
})
