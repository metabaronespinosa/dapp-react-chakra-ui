import {
  Alert,
  AlertIcon,
  AlertTitle,
  // AlertDescription,
  CloseButton
} from '@chakra-ui/react'

export const AlertCustom = ({
    error,
    onError
}: {
  error: string,
  onError: (a: string) => any
}) => {
  if (error === '') return null

  return <Alert status='error'>
    <AlertIcon />
    <AlertTitle mr={2}>{error}</AlertTitle>
    {/* <AlertDescription>Your Chakra experience may be degraded.</AlertDescription> */}
    <CloseButton
        position='absolute'
        right='8px'
        top='8px'
        onClick={() => onError('')}
    />
  </Alert>
}

export default AlertCustom
