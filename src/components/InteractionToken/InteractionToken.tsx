//https://web3js.readthedocs.io/en/v1.5.2/
import React, {
  useEffect,
  useState,
  useContext
} from 'react'
import {
  Box,
  Badge,
  Input,
  InputRightAddon,
  InputGroup,
  Stack,
  Button,
  Text
} from '@chakra-ui/react'
import { ProviderContext } from '../App'
import { Provider } from '../../scripts/Provider'

const InteractionToken = () => {
  const { provider, setProvider } = useContext(ProviderContext)
  const [tetherBalance, setTetherBalance] = useState<string>('')
  const [tetherSymbol, setTetherSymbol] = useState<string>('')
  const [deposit, setDeposit] = useState<string>('0')

  useEffect(() => {
    if (provider.isConnected) {
      provider.getTether().then((_tether: { balance: string; symbol: string } | null) => {
        if (_tether) {
          setTetherBalance(_tether.balance)
          setTetherSymbol(_tether.symbol)
        }
      })
    }
  }, [provider])

  const handleClickDeposit = () => {
    provider.stakeTokens(deposit).then(() => setProvider(new Provider()))
  }

  const handleClickWithdraw = () => {
    provider.unstakeTokens().then(() => setProvider(new Provider()))
  }

  return <>
    <Box
      mt='10%'
      maxW='600'
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      bgGradient='linear-gradient(to right, #00000096, #1a202c)'
    >
      <Box p='6'>
        <Box display='flex' alignItems='baseline'>
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            Stake Tokens
          </ Badge>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
            Balance: {tetherBalance}
          </Box>
        </Box>
        <Box mt='2'>
          <InputGroup size='sm'>
            <Input
              variant='filled'
              placeholder='$ 00.0'
              onChange={(_this) => setDeposit(_this.target.value)}
            />
            <InputRightAddon children={tetherSymbol} />
          </InputGroup>
        </Box>
        <Stack direction='row' spacing={4} align='center' mt='4' justify='center'>
          <Button
            colorScheme='teal'
            variant='solid'
            onClick={() => handleClickDeposit()}
          >
            Deposit
          </Button>
          <Button
            colorScheme='teal'
            variant='outline'
            onClick={() => handleClickWithdraw()}
          >
            Withdraw
          </Button>
        </Stack>
        <Box mt='8' textAlign='center'>
          <Text fontSize='md'>Airdrop 0:20</Text>
        </Box>
      </Box>
    </Box>
  </>
}

export default InteractionToken
