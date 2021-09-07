import '../styles/globals.css';

import { ChakraProvider } from '@chakra-ui/react';

import { AuthProvider } from '../components/Auth';

import type { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
