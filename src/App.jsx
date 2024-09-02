import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import MinecraftLauncher from './components/MinecraftLauncher';
import TitleBar from './components/TitleBar';

function App() {
  return (
    <ChakraProvider>
      <Box height="100vh" display="flex" flexDirection="column" overflow="hidden">
        <TitleBar />
        <Box flex="1" overflow="hidden">
          <MinecraftLauncher />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;