//https://web3js.readthedocs.io/en/v1.5.2/
import React, {
  useEffect,
  useState,
  createContext,
  SetStateAction,
  useRef
} from 'react'
import {
  ChakraProvider,
  Flex
} from '@chakra-ui/react'

import { Provider } from '../scripts/Provider'
import MenuTop from './MenuTop/MenuTop'
import Particles from './Particles'
import InteractionToken from './InteractionToken/InteractionToken'
import Alert from './Alert'
import { useWeb3 } from './hooks'

import './App.scss'

export const ProviderContext = createContext({
  provider: {} as Provider,
  setProvider: {} as React.Dispatch<SetStateAction<Provider>>,
})

const App = () => {
  const [isConnected, setIsConnected] = useState(false)
  const { loading, loaded, error: web3Error } = useWeb3()
  const [error, setError] = useState<string>('')
  const [provider, setProvider] = useState<Provider>(new Provider())
  const value = { provider, setProvider }
  let lastWeb3Error = useRef(web3Error)

  useEffect(() => {
    if (loaded)
      provider.loadContracts()
        .then(() => setIsConnected(true))
        .catch(err => setError(err.message))
  }, [loaded, provider])

  useEffect(() => {
    if (web3Error !== lastWeb3Error.current) {
      setProvider(new Provider())

      provider.loadContracts()
        .then(() => setIsConnected(true))
        .catch(err => setError(err.message))
    }
  }, [web3Error, provider])

  lastWeb3Error.current = web3Error

  if (loading) return null

  return <Flex
    style={{ height: '100vh' }}
    flexDirection='column'
    alignItems='center'
  >
    <Particles />
      <ProviderContext.Provider value={value}>
        <ChakraProvider>
          <Alert
            error={error || web3Error}
            onError={setError}
          />
          <MenuTop isConnected={isConnected} />
          <InteractionToken isConnected={isConnected} />
        </ChakraProvider>
      </ProviderContext.Provider>
  </Flex>
}

export default App
