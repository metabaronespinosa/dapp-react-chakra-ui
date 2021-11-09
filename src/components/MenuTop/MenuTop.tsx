//https://web3js.readthedocs.io/en/v1.5.2/
import React, {
  useEffect,
  useState,
  useContext
} from 'react'
import { Grid, GridItem, Text } from '@chakra-ui/react'
import { ProviderContext } from '../App'

const MenuTop = () => {
  const [accountNumber, setAccountNumber] = useState<string>('')
  const { provider } = useContext(ProviderContext)

  useEffect(() => {
    if (provider.isConnected)
      provider.getAccountNumber()
        .then((account: string) => setAccountNumber(account))
  }, [provider])

  return <Grid templateColumns='repeat(5, 1fr)' gap={4} padding={5}>
    <GridItem colSpan={2} h='21' />
    <GridItem colStart={4} colEnd={6} h='21'>
      <Text textAlign='right' fontSize='sm' color='tomato'>Wallet: {accountNumber}</Text>
    </GridItem>
  </Grid>
  
}

export default MenuTop
