const { assert } = require("chai");

const DecentralBank = artifacts.require("DecentralBank");
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

// [owner, customer] => accounts destructuring 
contract("DecentralBank", function ([owner, customer]) {
  let tether, rwd, decentralBank;

  function eth(number){
    return web3.utils.toWei(number, 'ether');
  }

  before(async () => {
    tether = await Tether.deployed();
    rwd = await RWD.deployed();
    decentralBank = await DecentralBank.deployed(tether.address, rwd.address);
  });

  it("Tether Balance", async function () {
    const ownerBalance = await tether.balanceOf(owner);
    const customerBalance = await tether.balanceOf(customer);

    assert.equal(ownerBalance.toString(), eth("40"));
    assert.equal(customerBalance.toString(), eth("60"));
  });

  it("DecentralBank DepositToken", async function () {
    await tether.approve(decentralBank.address, eth("40"));
    await decentralBank.depositToken(eth("40"));
    await tether.approve(decentralBank.address, eth("40"), {from:customer});
    await decentralBank.depositToken(eth("40"), {from:customer});

    const ownerBalance = await tether.balanceOf(owner);
    const customerBalance = await tether.balanceOf(customer);
    let isCustomerStacked = await decentralBank.isStacked(customer);

    assert.equal(ownerBalance.toString(), "0");
    assert.equal(customerBalance.toString(), eth("20"));
    assert.equal(isCustomerStacked, true);

    await decentralBank.issueTokens({from:owner});
    await decentralBank.issueTokens({from:customer}).should.be.rejected;
    await decentralBank.unstakeTokens({from:customer});

    isCustomerStacked = await decentralBank.isStacked(customer);
    assert.equal(isCustomerStacked, false);
  });
});
