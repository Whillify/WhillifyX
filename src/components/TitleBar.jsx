import React from 'react';
import { Flex, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { MinusIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { FaRegSquare } from 'react-icons/fa';

const TitleBar = () => {
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('gray.800', 'white');

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={2}
      px={4}
      bg={bg}
      color={color}
      h="32px"
      css={{
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <Text fontSize="sm" fontWeight="medium">
        Minecraft Launcher
      </Text>
      <Flex css={{ WebkitAppRegion: 'no-drag' }}>
        <IconButton
          icon={<MinusIcon />}
          size="sm"
          variant="ghost"
          aria-label="Minimize"
          onClick={() => window.electronAPI.minimizeWindow()}
          mr={1}
        />
        <IconButton
          icon={<FaRegSquare />}
          size="sm"
          variant="ghost"
          aria-label="Maximize"
          onClick={() => window.electronAPI.maximizeWindow()}
          mr={1}
        />
        <IconButton
          icon={<SmallCloseIcon />}
          size="sm"
          variant="ghost"
          aria-label="Close"
          onClick={() => window.electronAPI.closeWindow()}
          _hover={{ bg: 'red.500', color: 'white' }}
        />
      </Flex>
    </Flex>
  );
};

export default TitleBar;