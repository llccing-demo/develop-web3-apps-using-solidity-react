const { ethers } = require('hardhat')
const { expect } = require('chai')

describe("Partnership", () => {
  // it("can be deployed by providing two addresses on initialization", async () => {
  //   const Contract = await ethers.getContractFactory('Partnership');

  //   const [owner, person1] = await ethers.getSigners();
  //   const addresses = [owner.address, person1.address];

  //   await Contract.deploy(addresses);
  // })

  it("can NOT be deployed when NOT providing addresses on initialization", async () => {
    const Contract = await ethers.getContractFactory('Partnership');

    let error;
    try {
      await Contract.deploy();
    } catch (e) {
      error = e;
    } finally {
      expect(error).to.be.ok;
    }
  })

  it("can be deployed by providing at least two adresses and equal aomunts of split\
    ratios on initialization", async () => {
    const Contract = await ethers.getContractFactory('Partnership');
    const [owner, person1] = await ethers.getSigners();
    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 1];

    await Contract.deploy(addresses, splitRatios);
  })

  it("can NOT be deployed when the split ratios are not equivalent to the\
    address amount", async () => {
    const Contract = await ethers.getContractFactory('Partnership');
    const [owner, person1] = await ethers.getSigners();
    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 1, 1];

    await expect(Contract.deploy(addresses, splitRatios))
      .to.be.revertedWith("the address amount and the split ratio amount should be equal");

  });

  it('can NOT be deployed when the address amount is less than 2', async () => {
    const Contract = await ethers.getContractFactory('Partnership');
    const [owner] = await ethers.getSigners();
    const addresses = [owner.address];
    const splitRatios = [1];
    await expect(Contract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "More than one address should be provided to establish a partnership"
    );
  })

  it('can NOT be deployed when any of the split ratios is less than one', async () => {
    const Constract = await ethers.getContractFactory('Partnership');
    const [owner, person1] = await ethers.getSigners();
    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 0];
    await expect(Constract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "Split ratio should be greater than zero"
    );
  })

  it('can receive transactions in Ether', async () => {


    const Contract = await ethers.getContractFactory('Partnership');
    const [owner, person1] = await ethers.getSigners();

    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 1];

    const partnership = await Contract.deploy(addresses, splitRatios);
    await partnership.waitForDeployment();

    const partnershipAddress = await partnership.getAddress();

    // ensure the contract was deployed successfully
    expect(partnershipAddress).to.be.properAddress;

    const initialBalance = await ethers.provider.getBalance(partnershipAddress);
    console.log('initial balance', initialBalance.toString());

    expect(initialBalance).to.equal(0);

    const value = ethers.parseEther('1.0');

    // send ether to contract
    await owner.sendTransaction({
      to: partnershipAddress,
      value
    });

    const finalBalance = await ethers.provider.getBalance(partnershipAddress);
    console.log('final balance', finalBalance.toString());

    expect(finalBalance).to.equal(value);
  })

  describe('withdraw', () => {
    it('can be called if the contract balance is more than 0', async () => {
      const Contract = await ethers.getContractFactory('Partnership');
      const [owner, person1] = await ethers.getSigners();

      const addresses = [owner.address, person1.address];
      const splitRatios = [1, 1];

      expect(splitRatios.length).to.equal(addresses.length);

      const partnership = await Contract.deploy(addresses, splitRatios);
      const partnershipAddress = await partnership.getAddress();

      await owner.sendTransaction({
        to: partnershipAddress,
        value: ethers.parseEther('5.0')
      });

      const finalBalance = await partnership.getBalance();
      expect(finalBalance).to.not.equal(0);
      await partnership.withdraw()
    })

    it('can NOT be called if the contract balance is more than 0', async () => {
      const Contract = await ethers.getContractFactory('Partnership');
      const [owner, person1] = await ethers.getSigners();

      const addresses = [owner.address, person1.address];
      const splitRatios = [1, 1];

      expect(splitRatios.length).to.equal(addresses.length);

      const partnership = await Contract.deploy(addresses, splitRatios);

      const finalBalance = await partnership.getBalance();
      console.log("finalBalance ", finalBalance.toString());
      expect(finalBalance).to.equal(0);

      await expect(
        partnership.withdraw()
      ).to.be.revertedWith('Insufficient balance');
    })

    it('can NOT be called when the total split ratio is greater than the contract balance', async () => {
      const Contract = await ethers.getContractFactory('Partnership');
      const [owner, person1] = await ethers.getSigners();
      const addresses = [owner.address, person1.address];
      const splitRatios = [10, 10];

      expect(addresses.length).to.equal(splitRatios.length);

      const partnership = await Contract.deploy(addresses, splitRatios);
      await partnership.waitForDeployment();

      const partnershipAddress = await partnership.getAddress();
      expect(await partnership.getBalance()).to.equal(0);

      await owner.sendTransaction({
        to: partnershipAddress,
        value: ethers.parseEther('0.00000000000000001')
      });

      expect(await partnership.getBalance()).to.equal(10);

      await expect(
        partnership.withdraw()
      ).to.be.revertedWith('Balance should be greater than the total split ratio');

    })
  })
})
