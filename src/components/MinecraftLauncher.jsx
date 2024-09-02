import React, { useState, useEffect, useCallback } from 'react';
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
  Flex,
} from '@chakra-ui/react';
import { FaPlay, FaCog, FaUser, FaSignOutAlt, FaNewspaper, FaDownload } from 'react-icons/fa';
import LoginPage from './DiscordLoginPage';
import MinecraftSettings from './MinecraftSettings';
import UserProfilePage from './UserProfilePage';
import ProjectBlog from './ProjectBlog';

const MinecraftLauncher = () => {
  const [user, setUser] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('1.19.4');
  const [isLaunching, setIsLaunching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [modpackInstalled, setModpackInstalled] = useState(false);
  const toast = useToast();

  useEffect(() => {
    window.electronAPI.getStoredUser().then((storedUser) => {
      if (storedUser) {
        setUser(storedUser);
        loadAvatar(storedUser.id);
      }
    });

    const authSuccessHandler = (event, result, userInfo) => {
      if (result === true) {
        setUser(userInfo);
        loadAvatar(userInfo.id);
      }
    };

    const userLoggedOutHandler = () => {
      setUser(null);
    };

    window.electronAPI.onAuthResult(authSuccessHandler);
    window.electronAPI.onUserLoggedOut(userLoggedOutHandler);

    return () => {
      window.electronAPI.removeAuthResultListener(authSuccessHandler);
      window.electronAPI.removeUserLoggedOutListener(userLoggedOutHandler);
    };
  }, []);

  const loadAvatar = async (userId) => {
    const avatarUrl = await window.electronAPI.getAvatarUrl(userId);
    setAvatarSrc(avatarUrl);
  };

  const handleLogout = useCallback(() => {
    window.electronAPI.logout();
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const downloadModpack = useCallback(async () => {
    setIsDownloading(true);
    setProgress(0);
    try {
      const response = await window.electronAPI.downloadModpack(selectedVersion);
      if (response.success) {
        toast({
          title: "Сборка загружена",
          description: "Модпак успешно загружен и установлен.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить модпак: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  }, [selectedVersion, toast]);

  const handleLaunch = useCallback(async () => {
    setIsLaunching(true);
    setProgress(0);
    try {
      const settings = await window.electronAPI.getMinecraftSettings() || {};
      const launchResponse = await window.electronAPI.launchMinecraft(selectedVersion, settings);
      if (launchResponse.success) {
        toast({
          title: "Minecraft запущен!",
          description: "Приятной игры!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(launchResponse.error);
      }
    } catch (error) {
      console.error('Error launching Minecraft:', error);
      toast({
        title: "Ошибка запуска",
        description: `Не удалось запустить Minecraft: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLaunching(false);
      setProgress(0);
    }
  }, [selectedVersion, toast]);

  useEffect(() => {
    const progressHandler = (event, currentProgress) => {
      setProgress(currentProgress);
    };

    window.electronAPI.onDownloadProgress(progressHandler);
    window.electronAPI.onLaunchProgress(progressHandler);

    return () => {
      window.electronAPI.removeDownloadProgressListener(progressHandler);
      window.electronAPI.removeLaunchProgressListener(progressHandler);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const MainLauncherContent = () => (
    <Flex
      direction="column"
      bg="rgba(0,0,0,0.7)"
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      maxWidth="600px"
      width="90%"
      height="auto"
    >
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Image src="https://via.placeholder.com/50x50?text=MC" alt="Логотип Minecraft" boxSize="50px" />
          <Heading color="white" size="lg">Лаунчер Minecraft</Heading>
          <Button leftIcon={<FaSignOutAlt />} onClick={handleLogout} colorScheme="red" size="sm">
            Выйти
          </Button>
        </Flex>
        
        <Flex align="center">
          <Avatar src={avatarSrc} mr={4} />
          <Text color="white">Добро пожаловать, {user.global_name || user.username}!</Text>
        </Flex>
        
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
          leftIcon={<FaDownload />}
          onClick={downloadModpack}
          isLoading={isDownloading}
          loadingText="Загрузка..."
          colorScheme="blue"
          size="lg"
          width="full"
        >
          Загрузить сборку
        </Button>

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
        
        {(isDownloading || isLaunching) && (
          <Progress value={progress} colorScheme="green" size="sm" />
        )}
        
        <Flex justify="space-between">
          <Button leftIcon={<FaCog />} variant="outline" colorScheme="whiteAlpha" onClick={() => setIsSettingsOpen(true)}>
            Настройки
          </Button>
          <Button leftIcon={<FaUser />} variant="outline" colorScheme="whiteAlpha" onClick={() => setIsProfileOpen(true)}>
            Профиль
          </Button>
          <Button leftIcon={<FaNewspaper />} variant="outline" colorScheme="whiteAlpha" onClick={() => setShowBlog(true)}>
            Блог
          </Button>
        </Flex>
      </VStack>
    </Flex>
  );

  return (
    <Flex
      bgImage="url('./fon.jpg')"
      bgSize="cover"
      bgPosition="center"
      h="100vh"
      w="100vw"
      justify="center"
      align="center"
      overflow="hidden"
    >
      <Box
        maxHeight="90vh"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '24px',
          },
        }}
      >
        {showBlog ? (
          <ProjectBlog onBack={() => setShowBlog(false)} />
        ) : (
          <MainLauncherContent />
        )}
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

      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" />
          <ModalBody>
            <UserProfilePage user={user} onClose={() => setIsProfileOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MinecraftLauncher;