import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Button,
  Divider,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { FaDiscord, FaGamepad, FaClock } from 'react-icons/fa';

const UserProfilePage = ({ user, onClose }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      bg={bgColor}
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      maxWidth="600px"
      width="90%"
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg" color={textColor}>Профиль пользователя</Heading>
        </HStack>

        <HStack spacing={4}>
          <Avatar 
            size="xl" 
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
            name={user.global_name || user.username}
          />
          <VStack align="start" spacing={1}>
            <Heading size="md" color={textColor}>{user.global_name || user.username}</Heading>
            <Text color="gray.500">#{user.discriminator}</Text>
            <Badge colorScheme="purple">
              <HStack>
                <FaDiscord />
                <Text>Discord User</Text>
              </HStack>
            </Badge>
          </VStack>
        </HStack>

        <Divider />

        <VStack align="start" spacing={4}>
          <HStack>
            <FaGamepad />
            <Text color={textColor}>Пользователь с: 01.09.2024</Text>
          </HStack>
          <HStack>
            <FaClock />
            <Text color={textColor}>Время в игре: 100 часов</Text>
          </HStack>
        </VStack>

        <Divider />

        <VStack align="start" spacing={2}>
          <Heading size="sm" color={textColor}>Достижения</Heading>
          <HStack>
            <Badge colorScheme="green">Строитель</Badge>
            <Badge colorScheme="red">Воин</Badge>
            <Badge colorScheme="blue">Исследователь</Badge>
          </HStack>
        </VStack>

        <Button colorScheme="purple" leftIcon={<FaDiscord />}>
          Обновить данные Discord
        </Button>
      </VStack>
    </Box>
  );
};

export default UserProfilePage;