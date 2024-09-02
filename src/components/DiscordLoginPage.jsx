import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useToast,
} from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';

const LoginPage = ({ onLogin }) => {
  const toast = useToast();
  const authCompletedRef = useRef(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleDiscordLogin = useCallback(() => {
    if (!isAuthenticating) {
      setIsAuthenticating(true);
      authCompletedRef.current = false;
      window.electronAPI.discordAuth();
    }
  }, [isAuthenticating]);

  const debouncedAuthHandler = useCallback((event, result, profileData) => {
    if (authCompletedRef.current) return;

    authCompletedRef.current = true;
    setIsAuthenticating(false);

    if (result === true) {
      window.electronAPI.saveUserData(profileData);
      onLogin(profileData);
      toast({
        title: "Вход выполнен успешно",
        description: `Добро пожаловать, ${profileData.global_name || profileData.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      let errorMessage = "Не удалось войти через Discord";
      if (result === "no_guild") {
        errorMessage = "Вы не состоите на сервере Discord!";
      } else if (result === "no_role") {
        errorMessage = "Вы не имеете доступа к лаунчеру, попросите доступ у администратора!";
      }
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [onLogin, toast]);

  useEffect(() => {
    const authResultListener = (event, ...args) => {
      if (!authCompletedRef.current) {
        debouncedAuthHandler(event, ...args);
      }
    };

    window.electronAPI.onAuthResult(authResultListener);

    return () => {
      window.electronAPI.removeAuthResultListener(authResultListener);
      authCompletedRef.current = false;
      setIsAuthenticating(false);
    };
  }, [debouncedAuthHandler]);

  return (
    <Box
      bgImage="url('./fon.jpg')"
      bgSize="cover"
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
        maxWidth="400px"
        width="90%"
      >
        <VStack spacing={8} align="stretch">
          <Image src="https://via.placeholder.com/100x100?text=MC" alt="Логотип Minecraft" alignSelf="center" />
          <Heading color="white" textAlign="center">WhillifyJSX</Heading>
          <Text color="gray.300" textAlign="center">Войдите с помощью вашего аккаунта Discord, чтобы продолжить</Text>
          <Button
            leftIcon={<FaDiscord />}
            onClick={handleDiscordLogin}
            colorScheme="purple"
            size="lg"
            isLoading={isAuthenticating}
            loadingText="Авторизация..."
          >
            Войти через Discord
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;