import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
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
  Grid,
  GridItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaPlay,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaNewspaper,
  FaDownload,
  FaBars,
  FaChevronRight,
} from "react-icons/fa";
import LoginPage from "./DiscordLoginPage";
import MinecraftSettings from "./MinecraftSettings";
import UserProfilePage from "./UserProfilePage";
import ProjectBlog from "./ProjectBlog";

// Пример данных о серверах
const servers = [
  { id: "1.19.4", name: "Основной", icon: "https://via.placeholder.com/40" },
  { id: "1.18.2", name: "Хардкор", icon: "https://via.placeholder.com/40" },
  { id: "1.17.1", name: "Творческий", icon: "https://via.placeholder.com/40" },
];

const MinecraftLauncher = () => {
  const [user, setUser] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [showFullBlog, setShowFullBlog] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

    fetchLatestBlogPosts();

    return () => {
      window.electronAPI.removeAuthResultListener(authSuccessHandler);
      window.electronAPI.removeUserLoggedOutListener(userLoggedOutHandler);
    };
  }, []);

  const fetchLatestBlogPosts = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v2/discord/posts"
      );
      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

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

  const downloadModpack = useCallback(async (serverId) => {
    setIsDownloading(true);
    setProgress(0);
    try {
      const response = await window.electronAPI.downloadModpack(serverId);
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
  }, [toast]);

  const handleLaunch = useCallback(async (serverId) => {
    setIsLaunching(true);
    setProgress(0);
    try {
      const settings = (await window.electronAPI.getMinecraftSettings()) || {};
      const launchResponse = await window.electronAPI.launchMinecraft(
        serverId,
        settings
      );
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
      console.error("Error launching Minecraft:", error);
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
  }, [toast]);

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

  const ServerList = () => (
    <VStack spacing={4} align="stretch" width="200px" p={4}>
      <Heading color="white" size="md" mb={4}>
        Сервера
      </Heading>
      {servers.map((server) => (
        <Button
          key={server.id}
          onClick={() => {
            setSelectedServer(server);
            onClose();
          }}
          variant={selectedServer.id === server.id ? "solid" : "ghost"}
          colorScheme="blue"
          justifyContent="flex-start"
          leftIcon={<Image src={server.icon} boxSize="24px" mr={2} />}
        >
          {server.name}
        </Button>
      ))}
    </VStack>
  );

  const MainLauncherContent = () => (
    <Grid
      templateColumns="1fr 300px"
      gap={6}
      bg="rgba(0,0,0,0.7)"
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      maxWidth="1000px"
      width="90%"
    >
      <GridItem>
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading color="white" size="lg">
              Лаунчер Minecraft
            </Heading>
            <Button
              leftIcon={<FaSignOutAlt />}
              onClick={handleLogout}
              colorScheme="red"
              size="sm"
            >
              Выйти
            </Button>
          </Flex>

          <Flex align="center">
            <Avatar src={avatarSrc} mr={4} />
            <Text color="white">
              Добро пожаловать, {user.global_name || user.username}!
            </Text>
          </Flex>

          <Box>
            <Text color="gray.300" mb={2}>
              Выбранный сервер: {selectedServer.name}
            </Text>
          </Box>

          <Button
            leftIcon={<FaDownload />}
            onClick={() => downloadModpack(selectedServer.id)}
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
            onClick={() => handleLaunch(selectedServer.id)}
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
            <Button
              leftIcon={<FaCog />}
              variant="outline"
              colorScheme="whiteAlpha"
              onClick={() => setIsSettingsOpen(true)}
            >
              Настройки
            </Button>
            <Button
              leftIcon={<FaUser />}
              variant="outline"
              colorScheme="whiteAlpha"
              onClick={() => setIsProfileOpen(true)}
            >
              Профиль
            </Button>
          </Flex>
        </VStack>
      </GridItem>

      <GridItem>
        <VStack spacing={4} align="stretch">
          <Heading color="white" size="md">
            Последние новости
          </Heading>
          {blogPosts.slice(0, 2).map((post, index) => (
            <Box key={index} bg="gray.700" p={4} borderRadius="md">
              <Heading color="white" size="sm">
                {post.title}
              </Heading>
              <Text color="gray.300" noOfLines={2}>
                {post.content}
              </Text>
              <Text color="gray.400" fontSize="sm" mt={2}>
                {new Date(post.date).toLocaleDateString()}
              </Text>
            </Box>
          ))}
          <Button
            leftIcon={<FaNewspaper />}
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={() => setShowFullBlog(true)}
          >
            Все новости
          </Button>
        </VStack>
      </GridItem>
    </Grid>
  );

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Flex
      bgImage="url('./fon.jpg')"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      w="100vw"
      justify="center"
      align="center"
      p={4}
      position="relative"
    >
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        width="10px"
        bg="rgba(0,0,0,0.7)"
        _hover={{
          width: "50px",
          transition: "width 0.3s ease-in-out",
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        onClick={onOpen}
        zIndex={1000}
      >
        <FaChevronRight color="white" size={24} />
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="rgba(0,0,0,0.9)">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Выбор сервера</DrawerHeader>
          <DrawerBody>
            <ServerList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box
        maxHeight="90vh"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "24px",
          },
        }}
      >
        {showFullBlog ? (
          <ProjectBlog onBack={() => setShowFullBlog(false)} />
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
            <UserProfilePage
              user={user}
              onClose={() => setIsProfileOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MinecraftLauncher;