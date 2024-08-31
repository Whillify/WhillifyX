import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Divider,
  useColorModeValue,
  Flex,
  Link,
  Tag,
  HStack,
} from '@chakra-ui/react';
import { FaArrowLeft, FaExternalLinkAlt, FaHistory } from 'react-icons/fa';

const BlogPost = ({ title, date, content, discordLink, tags }) => (
  <Box mb={6}>
    <Flex justify="space-between" align="center" mb={2}>
      <Heading size="md">{title}</Heading>
      <Link href={discordLink} isExternal color="blue.500">
        <Flex align="center">
          <Text fontSize="sm" mr={1}>Обсудить</Text>
          <FaExternalLinkAlt size="12px" />
        </Flex>
      </Link>
    </Flex>
    <HStack spacing={2} mb={2}>
      {tags.map((tag, index) => (
        <Tag key={index} colorScheme={getTagColor(tag)}>
          {tag}
        </Tag>
      ))}
    </HStack>
    <Text fontSize="sm" color="gray.500" mb={2}>{date}</Text>
    <Text>{content}</Text>
  </Box>
);

const getTagColor = (tag) => {
  switch (tag) {
    case 'Мемес':
      return 'yellow';
    case 'Новости':
      return 'blue';
    case 'ВНИМАНИЕ':
      return 'red';
    case 'Прочее':
      return 'gray';
    case 'Полезная информация':
      return 'green';
    default:
      return 'gray';
  }
};

const ProjectBlog = ({ onBack }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const blogPosts = [
    {
      title: "Обновление сервера до версии 1.19.4",
      date: "2023-09-01",
      content: "Мы рады сообщить, что наш сервер был обновлен до версии Minecraft 1.19.4. Теперь вы можете наслаждаться всеми новыми функциями и улучшениями!",
      discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
      tags: ['Новости', 'Полезная информация']
    },
    {
      title: "Новый конкурс строительства",
      date: "2023-08-15",
      content: "Объявляем новый конкурс строительства! Тема: 'Футуристические города'. Победитель получит эксклюзивный внутриигровой предмет.",
      discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
      tags: ['Новости', 'Прочее']
    },
    {
      title: "Технические работы",
      date: "2023-08-05",
      content: "В следующую среду с 2:00 до 5:00 по МСК будут проводиться технические работы. Сервер будет недоступен в это время.",
      discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
      tags: ['ВНИМАНИЕ', 'Новости']
    },
    {
      title: "Новые текстуры для мобов",
      date: "2023-07-20",
      content: "Мы добавили новые текстуры для некоторых мобов, чтобы сделать игровой мир еще более интересным и разнообразным.",
      discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
      tags: ['Новости', 'Полезная информация']
    },
    {
      title: "Расширение игровой карты",
      date: "2023-07-01",
      content: "Мы расширили игровую карту на 5000 блоков во всех направлениях. Теперь у вас еще больше пространства для исследований и строительства!",
      discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
      tags: ['Новости', 'Полезная информация']
    },
    {
      title: "Обновление плагинов",
      date: "2023-06-15",
      content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
      discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
      tags: ['Новости', 'Полезная информация']
    },
    {
        title: "Обновление плагинов",
        date: "2023-06-15",
        content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
        discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
        tags: ['Новости', 'Полезная информация']
    },
    {
        title: "Обновление плагинов",
        date: "2023-06-15",
        content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
        discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
        tags: ['Новости', 'Полезная информация']
    },
    {
        title: "Обновление плагинов",
        date: "2023-06-15",
        content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
        discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
        tags: ['Новости', 'Полезная информация']
    },
    {
        title: "Обновление плагинов",
        date: "2023-06-15",
        content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
        discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
        tags: ['Новости', 'Полезная информация']
      },
      {
        title: "Обновление плагинов",
        date: "2023-06-15",
        content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
        discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
        tags: ['Новости', 'Полезная информация']
      },
      {
        title: "Обновление плагинов",
        date: "2023-06-15",
        content: "Мы обновили несколько ключевых плагинов, что должно улучшить производительность сервера и игровой процесс.",
        discordLink: "https://discord.com/channels/287605345021460482/1279582498975912027",
        tags: ['Новости', 'Полезная информация']
      }
  ];

  // Сортировка постов по дате (от новых к старым) и ограничение до 10 записей
  const sortedPosts = blogPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const hasMorePosts = blogPosts.length > 10;

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      boxShadow="xl"
      maxWidth="800px"
      width="90%"
      height="80vh"
      display="flex"
      flexDirection="column"
    >
      <Flex direction="column" p={8} height="100%">
        <Button leftIcon={<FaArrowLeft />} onClick={onBack} alignSelf="flex-start" mb={4}>
          Назад к лаунчеру
        </Button>
        
        <Heading size="xl" color={textColor} mb={4}>Блог проекта</Heading>
        
        <Divider mb={4} />
        
        <Box overflowY="auto" flex={1} pr={4}>
          <VStack align="stretch" spacing={6}>
            {sortedPosts.map((post, index) => (
              <BlogPost key={index} {...post} />
            ))}
            {hasMorePosts && (
              <Button
                rightIcon={<FaHistory />}
                as={Link}
                href="https://discord.com/channels/287605345021460482/1266917291258413107"
                isExternal
                colorScheme="blue"
                variant="outline"
                alignSelf="center"
              >
                Старые записи
              </Button>
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProjectBlog;