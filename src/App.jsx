import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import MinecraftLauncher from './components/MinecraftLauncher';

function App() {
  return (
    <ChakraProvider>
      <MinecraftLauncher />
    </ChakraProvider>
  );
}

export default App;