import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Button,
  useToast,
} from '@chakra-ui/react';

const MinecraftSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    language: 'ru_RU',
    graphicsQuality: 'normal',
    renderDistance: 8,
    maxMemory: 2,
    fullscreen: false,
  });

  const toast = useToast();

  useEffect(() => {
    // Загрузка настроек при монтировании компонента
    window.electronAPI.getMinecraftSettings().then(savedSettings => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    });
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    window.electronAPI.saveMinecraftSettings(settings);
    toast({
      title: "Настройки сохранены",
      description: "Ваши настройки были успешно сохранены.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Box
      bg="rgba(0,0,0,0.8)"
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      maxWidth="600px"
      width="90%"
    >
      <VStack spacing={6} align="stretch">
        <Heading color="white" size="lg">Настройки Minecraft</Heading>
        
        <Box>
          <Text color="gray.300" mb={2}>Язык</Text>
          <Select
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            bg="gray.700"
            color="white"
          >
            <option value="ru_RU">Русский</option>
            <option value="en_US">English</option>
            <option value="de_DE">Deutsch</option>
          </Select>
        </Box>

        <Box>
          <Text color="gray.300" mb={2}>Качество графики</Text>
          <Select
            value={settings.graphicsQuality}
            onChange={(e) => handleChange('graphicsQuality', e.target.value)}
            bg="gray.700"
            color="white"
          >
            <option value="low">Низкое</option>
            <option value="normal">Среднее</option>
            <option value="high">Высокое</option>
          </Select>
        </Box>

        <Box>
          <Text color="gray.300" mb={2}>Дальность прорисовки: {settings.renderDistance} чанков</Text>
          <Slider
            min={2}
            max={32}
            step={1}
            value={settings.renderDistance}
            onChange={(value) => handleChange('renderDistance', value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>

        <Box>
          <Text color="gray.300" mb={2}>Максимальный объем памяти: {settings.maxMemory} ГБ</Text>
          <Slider
            min={1}
            max={16}
            step={1}
            value={settings.maxMemory}
            onChange={(value) => handleChange('maxMemory', value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>

        <HStack justify="space-between">
          <Text color="gray.300">Полноэкранный режим</Text>
          <Switch
            isChecked={settings.fullscreen}
            onChange={(e) => handleChange('fullscreen', e.target.checked)}
            colorScheme="green"
          />
        </HStack>

        <HStack justify="flex-end" mt={4}>
          <Button onClick={onClose} variant="outline" colorScheme="red">
            Отмена
          </Button>
          <Button onClick={handleSave} colorScheme="green">
            Сохранить
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MinecraftSettings;