const Tether = artifacts.require("Tether");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Tether", (accounts) => {
  function eth(number){
    return web3.utils.toWei(number, 'ether');
  }

  it("Name and Transfert", async () => {
    const tether = await Tether.deployed();
    const name = await tether.name();

    //console.debug("accounts::", accounts)

    // During the deloyment, we transfered already a part to accounts[1]
    await tether.transfer(accounts[1], eth("20"));
    const accounts_0 = await tether.balanceOf(accounts[0]);
    const accounts_1 = await tether.balanceOf(accounts[1]);

    assert.equal(name, "Tether");  
    assert.equal(accounts_0.toString(), eth("20"));  
    assert.equal(accounts_1.toString(), eth("80"));  
  });
});
