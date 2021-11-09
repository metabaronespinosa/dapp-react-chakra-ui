//https://web3js.readthedocs.io/en/v1.5.2/
import React, { useEffect, useState, useContext } from "react";
import "./TableToken.scss";
import Table from "react-bootstrap/Table";
import { ProviderContext } from "../App";

const TableToken = () => {
  const [stakingBalance, setStakingBalance] = useState<string>("");
  const [stakingSymbol, setStakingSymbol] = useState<string>("");

  const [rwdBalance, setRwdBalance] = useState<string>("");
  const [rwdSymbol, setRwdSymbol] = useState<string>("");

  const { provider, setProvider } = useContext(ProviderContext);

  useEffect(() => {
    if (provider.isConnected) {
      provider.getStakingBalance().then((_staking: { balance: string; symbol: string } | null) => {
        if (_staking) {
          setStakingBalance(_staking.balance);
          setStakingSymbol(_staking.symbol);
        }
      });
      provider.getRWD().then((_rwd: { balance: string; symbol: string } | null) => {
        if (_rwd) {
          setRwdBalance(_rwd.balance);
          setRwdSymbol(_rwd.symbol);
        }
      });
    }
  }, [provider]);

  return (
    <div className="TableToken_123fsf">
      <Table hover>
        <thead>
          <tr>
            <th>Staking Balance</th>
            <th>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {stakingBalance} {stakingSymbol}
            </td>
            <td>
              {rwdBalance} {rwdSymbol}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default TableToken;
