import React, { useEffect } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';

const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';
const REDIRECT_URI = 'http://localhost:3000/auth/discord/callback';

const DiscordAuth = ({ onLogin }) => {
  const toast = useToast();

  useEffect(() => {
    // Проверяем, есть ли код авторизации в URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Если код есть, отправляем его на сервер для обмена на токен
      exchangeCodeForToken(code);
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`;
    window.location.href = authUrl;
  };

  const exchangeCodeForToken = async (code) => {
    try {
      // В реальном приложении этот запрос должен быть отправлен на ваш сервер
      // для безопасного обмена кода на токен
      const response = await fetch('/api/discord/exchange-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      // Здесь мы получаем токен и информацию о пользователе
      onLogin(data.user);
    } catch (error) {
      console.error('Error during Discord authentication:', error);
      toast({
        title: "Ошибка аутентификации",
        description: "Не удалось войти через Discord. Пожалуйста, попробуйте снова.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      leftIcon={<FaDiscord />}
      onClick={handleLogin}
      colorScheme="purple"
      size="lg"
    >
      Войти через Discord
    </Button>
  );
};

export default DiscordAuth;