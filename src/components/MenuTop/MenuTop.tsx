//https://web3js.readthedocs.io/en/v1.5.2/
import React, {
  useEffect,
  useState,
  useContext
} from 'react'
import {
  Grid,
  GridItem,
  Text,
  Button
} from '@chakra-ui/react'
import { ProviderContext } from '../App'

const displayWallet = (wallet: string) =>
  `${wallet.substr(0, 4)}....${wallet.substr(-4)}`

const MenuTop = ({ isConnected }: { isConnected: boolean }) => {
  const [accountNumber, setAccountNumber] = useState<string>('')
  const { provider } = useContext(ProviderContext)
  const [stakingBalance, setStakingBalance] = useState<string>('')
  const [stakingSymbol, setStakingSymbol] = useState<string>('')

  const [rwdBalance, setRwdBalance] = useState<string>('')
  const [rewardsBalance, setRewardsBalance] = useState<string>('')
  const [rwdSymbol, setRwdSymbol] = useState<string>('')

  useEffect(() => {
    if (isConnected) {
      provider.getStakingBalance().then((_staking: { balance: string; symbol: string } | null) => {
        if (_staking) {
          setStakingBalance(_staking.balance)
          setStakingSymbol(_staking.symbol)
        }
      })

      provider.getRWD().then((_rwd: { balance: string; symbol: string } | null) => {
        if (_rwd) {
          setRwdBalance(_rwd.balance)
          setRwdSymbol(_rwd.symbol)
        }
      })

      provider.getStakingRewards().then((_res: { balance: string } | null) => {
        if (_res) setRewardsBalance(_res.balance)
      })
    }
  }, [isConnected, provider])

  useEffect(() => {
    if (isConnected)
      provider.getAccountNumber()
        .then((account: string) => setAccountNumber(account))
  }, [isConnected, provider])

  const claimRewards = () => {
    provider.claimRewards()
      .then(res => console.log('Claim result: ', res))
  }

  return <Grid templateColumns='repeat(5, 1fr)' gap={3} padding={5}>
    <GridItem colSpan={1} h='21'>
      <Text textAlign='left' fontSize='md'>Staking: {stakingBalance} {stakingSymbol}</Text>
    </GridItem>
    <GridItem colSpan={1} h='21'>
      <Text textAlign='left' fontSize='md'>{rwdSymbol}: {rwdBalance}</Text>
    </GridItem>
    <GridItem colSpan={1} h='21'>
      <Text as='span' textAlign='left' fontSize='md'>Rewards: {rewardsBalance}</Text>
      {parseInt(rewardsBalance) && <Button
        ml='3'
        size='xs'
        colorScheme='teal'
        variant='outline'
        onClick={claimRewards}
      >
        Claim
      </Button>}
    </GridItem>
    <GridItem colStart={4} colEnd={6} h='21'>
      <Text textAlign='right' fontSize='md' color='tomato'>Wallet: {displayWallet(accountNumber)}</Text>
    </GridItem>
  </Grid>
}

export default MenuTop
