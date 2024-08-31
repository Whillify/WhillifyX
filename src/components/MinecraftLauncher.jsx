import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Select,
  Button,
  Progress,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Avatar,
} from '@chakra-ui/react';
import { FaPlay, FaCog, FaUser, FaDownload, FaSignOutAlt } from 'react-icons/fa';
import LoginPage from './DiscordLoginPage';
import MinecraftSettings from './MinecraftSettings';

const MinecraftLauncher = () => {
  const [user, setUser] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('1.19.4');
  const [isLaunching, setIsLaunching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const toast = useToast();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLaunching(false);
        toast({
          title: "Minecraft запущен!",
          description: "Приятной игры!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }, 500);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Box
      bgImage="url('./fon.jpg')"
      bgSize="cover"
      bgPosition="center"
      h="100vh"
      w="100vw"
      position="relative"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="rgba(0,0,0,0.7)"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        maxWidth="600px"
        width="90%"
      >
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Image src="https://via.placeholder.com/50x50?text=MC" alt="Логотип Minecraft" />
            <Heading color="white" size="lg">Лаунчер Minecraft</Heading>
            <Button leftIcon={<FaSignOutAlt />} onClick={handleLogout} colorScheme="red" size="sm">
              Выйти
            </Button>
          </HStack>
          
          <HStack>
            <Avatar src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} />
            <Text color="white">Добро пожаловать, {user.username}!</Text>
          </HStack>
          
          <Box>
            <Text color="gray.300" mb={2}>Версия</Text>
            <Select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              bg="gray.700"
              color="white"
            >
              <option value="1.19.4">1.19.4</option>
              <option value="1.18.2">1.18.2</option>
              <option value="1.17.1">1.17.1</option>
            </Select>
          </Box>
          
          <Button
            leftIcon={<FaPlay />}
            onClick={handleLaunch}
            isLoading={isLaunching}
            loadingText="Запуск..."
            colorScheme="green"
            size="lg"
            width="full"
          >
            Играть
          </Button>
          
          {isLaunching && (
            <Progress value={progress} colorScheme="green" size="sm" />
          )}
          
          <HStack justify="space-between">
            <Button leftIcon={<FaCog />} variant="outline" colorScheme="whiteAlpha" onClick={() => setIsSettingsOpen(true)}>
              Настройки
            </Button>
            <Button leftIcon={<FaUser />} variant="outline" colorScheme="whiteAlpha">
              Профиль
            </Button>
            <Button leftIcon={<FaDownload />} variant="outline" colorScheme="whiteAlpha">
              Моды
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" />
          <ModalBody>
            <MinecraftSettings onClose={() => setIsSettingsOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MinecraftLauncher;