import React, { useState } from 'react';
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
  const [language, setLanguage] = useState('ru_RU');
  const [graphicsQuality, setGraphicsQuality] = useState('normal');
  const [renderDistance, setRenderDistance] = useState(8);
  const [maxMemory, setMaxMemory] = useState(2);
  const [fullscreen, setFullscreen] = useState(false);

  const toast = useToast();

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
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
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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
            value={graphicsQuality}
            onChange={(e) => setGraphicsQuality(e.target.value)}
            bg="gray.700"
            color="white"
          >
            <option value="low">Низкое</option>
            <option value="normal">Среднее</option>
            <option value="high">Высокое</option>
          </Select>
        </Box>

        <Box>
          <Text color="gray.300" mb={2}>Дальность прорисовки: {renderDistance} чанков</Text>
          <Slider
            min={2}
            max={32}
            step={1}
            value={renderDistance}
            onChange={(value) => setRenderDistance(value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>

        <Box>
          <Text color="gray.300" mb={2}>Максимальный объем памяти: {maxMemory} ГБ</Text>
          <Slider
            min={1}
            max={16}
            step={1}
            value={maxMemory}
            onChange={(value) => setMaxMemory(value)}
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
            isChecked={fullscreen}
            onChange={(e) => setFullscreen(e.target.checked)}
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