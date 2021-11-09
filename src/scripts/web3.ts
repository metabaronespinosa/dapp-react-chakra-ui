// This function detects most providers injected at window.ethereum
import { ethers } from "ethers";
import Tether from "../truffle_abis/Tether.json";
import Web3 from "web3";
import { ExternalProvider } from "@ethersproject/providers/lib/web3-provider";

/**
 * Needed the networkVersion
 */
interface ExternalProviderExtended extends ExternalProvider {
  networkVersion?: string;
}

export const loadWeb3 = async (): Promise<boolean> => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  if (provider) {
    console.log("provider", provider);

    // Accounts
    const accounts = await provider.listAccounts();
    console.log("accounts", accounts);

    // Balance Accounts
    let balanceString = await provider.getBalance(accounts[0]);
    let balance = ethers.utils.formatEther(balanceString);
    console.log("balance", balance);

    // NetID
    let providerExtended = <ExternalProviderExtended>provider.provider;
    let netID = providerExtended.networkVersion;
    console.log("provider_networkVersion", netID);

    if (!netID) return false;

    const tetherData = Tether.networks[netID as keyof typeof Tether.networks];
    if (tetherData) {
      // Load ContractObject
      // ABI (Application Binary Interface)
      const tether = new ethers.Contract(tetherData.address, Tether.abi, signer);
      const tetherName = await tether.callStatic.name();
      console.log("tetherName", tetherName);

      // tether::BalanceAccount
      const accountTetherBalance = await tether.callStatic.balanceOf(accounts[0]);
      console.log("accountTetherBalance", accountTetherBalance.toString());

      return true;
    }
  } else {
    console.log("Please install MetaMask!");
  }

  return false;
};

export const loadWeb3Old = async () => {
  const mywindow = window as any;
  if (mywindow.ethereum) {
    mywindow.web3 = new Web3(mywindow.ethereum);
    await mywindow.ethereum.enable();

    //setConnectionType("Connected Ethereum");
    console.debug("Connected Ethereum");
  } else if (mywindow.web3) {
    mywindow.web3 = new Web3(mywindow.web3.currentProvider);
    await mywindow.ethereum.enable();

    //setConnectionType("Connected currentProvider");
    console.debug("Connected currentProvider");
  }
};
