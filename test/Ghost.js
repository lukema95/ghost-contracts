const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Ghost", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Ghost = await hre.ethers.getContractFactory("Ghost");
    const ghost = await Ghost.deploy();
  
    await ghost.deployed();

    return { ghost, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should success", async function () {
      await expect(loadFixture(deployOneYearLockFixture)).not.be.reverted;
    });
  });

  describe("Registers", function () {
    describe("Validations", function () {
      it("Should success if user has not registered before ", async function () {
        const { ghost, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await expect(ghost.connect(otherAccount).register([owner.address])).not.be.reverted;
        expect(await ghost.queryRegistryIndex(otherAccount.address, 0)).to.equal(owner.address);

      });

    });

    describe("Events", function () {
      it("Should emit an event on register", async function () {
        const { ghost, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await expect(ghost.connect(otherAccount).register([owner.address]))
          .to.emit(ghost, "Register")
          .withArgs(otherAccount.address, [owner.address]); 
      });
    });
  });

  describe("Routes", function () {
    describe("Validations", function () {
      it("Should success if user has not routed before", async function () {
        const { ghost, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await ghost.connect(otherAccount).register([owner.address]);
       
        await expect(ghost.connect(otherAccount).route(owner.address)).not.be.reverted;
        expect(await ghost.queryRoute(otherAccount.address)).to.equal(owner.address);

      });
    });

    describe("Events", function () {
      it("Should emit an event on route", async function () {
        const { ghost, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await ghost.connect(otherAccount).register([owner.address]);

        await expect(ghost.connect(otherAccount).route(owner.address))
          .to.emit(ghost, "Route")
          .withArgs(otherAccount.address, owner.address); 
      });
    });
  });
});
