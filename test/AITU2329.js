import { expect } from "chai";
import hre from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("AITU2329", function () {
  async function deployAITU2329Fixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    
    const initialValue = 10000;  // Set an initial value for tokens
    const aitu2329 = await hre.ethers.deployContract("AITU2329", [owner.address, initialValue]);

    return { aitu2329, owner, otherAccount, initialValue };
  }

  it("Should deploy with the correct initial supply", async function () {
    const { aitu2329, owner, initialValue } = await loadFixture(deployAITU2329Fixture);

    const ownerBalance = await aitu2329.balanceOf(owner.address);
    expect(ownerBalance).to.equal(BigInt(initialValue) * BigInt(10) ** BigInt(18)); // initialValue tokens with 18 decimals
  });

  it("Should emit TransactionDetails event", async function () {
    const { aitu2329, owner, otherAccount } = await loadFixture(deployAITU2329Fixture);

    const amount = 1000;
    const tx = await aitu2329.getTransactionDetails(owner.address, otherAccount.address, amount);

    await expect(tx)
      .to.emit(aitu2329, "TransactionDetails")
      .withArgs(owner.address, otherAccount.address, amount, await time.latest());
  });

  it("Should return the latest transaction timestamp as a string", async function () {
    const { aitu2329 } = await loadFixture(deployAITU2329Fixture);

    const timestamp = await time.latest();
    const expectedTimestampString = `Timestamp: ${timestamp}`;

    expect(await aitu2329.getLatestTransactionTimestamp()).to.equal(expectedTimestampString);
  });

  it("Should return the transaction sender", async function () {
    const { aitu2329, owner } = await loadFixture(deployAITU2329Fixture);

    expect(await aitu2329.getTransactionSender()).to.equal(owner.address);
  });

  it("Should return the transaction receiver", async function () {
    const { aitu2329, otherAccount } = await loadFixture(deployAITU2329Fixture);

    const receiver = otherAccount.address;
    expect(await aitu2329.getTransactionReceiver(receiver)).to.equal(receiver);
  });

  it("Should store the correct initialValue", async function () {
    const { aitu2329, initialValue } = await loadFixture(deployAITU2329Fixture);

    const storedInitialValue = await aitu2329.initialValue();
    expect(storedInitialValue).to.equal(initialValue);
  });
});
