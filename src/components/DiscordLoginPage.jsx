import React from 'react';
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
const { ipcRenderer } = window.require('electron');

const LoginPage = ({ onLogin }) => {
  const toast = useToast();

  const handleDiscordLogin = () => {
    ipcRenderer.send('open-auth-window');
  };

  // Слушаем результат авторизации
  React.useEffect(() => {
    const authResultListener = (event, result, profileData) => {
      if (result === true) {
        // Сохраняем полные данные профиля в хранилище
        ipcRenderer.send('save-user-data', profileData);
        
        onLogin({ username: profileData.username });
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${profileData.username}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (result === "no_guild") {
        toast({
          title: "Ошибка входа",
          description: "Вы не состоите на сервере Discord!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (result === "no_role") {
        toast({
          title: "Ошибка входа",
          description: "Вы не имеете доступа к лаунчеру, попросите доступ у администратора!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка входа",
          description: "Не удалось войти через Discord",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    ipcRenderer.on('auth-result', authResultListener);

    return () => {
      ipcRenderer.removeListener('auth-result', authResultListener);
    };
  }, [onLogin, toast]);

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
          >
            Войти через Discord
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;