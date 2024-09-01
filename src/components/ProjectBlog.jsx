import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Result } from 'antd';
import ReactMarkdown from 'react-markdown';
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
  Icon,
} from '@chakra-ui/react';
import { FaArrowLeft, FaExternalLinkAlt, FaHistory, FaPencilAlt, FaUser, FaClock } from 'react-icons/fa';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours());

  const day = date.getDate();
  const month = date.toLocaleString('ru-RU', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const BlogPost = ({ title, date, content, discord_link, tags, author }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = content.length > 250;
  const displayContent = isExpanded ? content : content.slice(0, 250) + '...';

  const formattedDate = formatDate(date);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box 
      mb={6} 
      width="100%" 
      bg={bgColor} 
      borderRadius="md" 
      borderWidth="1px" 
      borderColor={borderColor}
      p={4}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="md">{title}</Heading>
        <Link href={discord_link} isExternal color="blue.500">
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
      <Flex align="center" mb={2}>
        <Icon as={FaUser} color="gray.500" mr={2} />
        <Text fontSize="sm" color="gray.500">Автор: {author}</Text>
      </Flex>
      <Flex align="center" mb={2}>
        <Icon as={FaClock} color="gray.500" mr={2} />
        <Text fontSize="sm" color="gray.500">{formattedDate}</Text>
      </Flex>
      <Box className="markdown-content">
        <ReactMarkdown>{displayContent}</ReactMarkdown>
      </Box>
      {shouldTruncate && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          mt={2}
          colorScheme="blue"
          variant="link"
        >
          {isExpanded ? 'Свернуть' : 'Читать далее'}
        </Button>
      )}
    </Box>
  );
};


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
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v2/discord/posts');
        setBlogPosts(response.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const sortedPosts = blogPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const hasMorePosts = blogPosts.length > 10;

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      boxShadow="xl"
      width="800px"
      height="80vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <style jsx global>{`
        .markdown-content {
          word-wrap: break-word;
        }
        .markdown-content p {
          margin-bottom: 1em;
        }
        .markdown-content strong {
          font-weight: bold;
        }
        .markdown-content em {
          font-style: italic;
        }
        .markdown-content code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }
        .markdown-content a {
          color: #3182ce;
          text-decoration: none;
        }
        .markdown-content a:hover {
          text-decoration: underline;
        }
      `}</style>
      <Flex direction="column" height="100%">
        <Box p={8}>
          <Button leftIcon={<FaArrowLeft />} onClick={onBack} mb={4}>
            Назад к лаунчеру
          </Button>
          
          <Heading size="xl" color={textColor} mb={4}>Блог проекта</Heading>
          
          <Divider mb={4} />
        </Box>
        
        <Box overflowY="auto" flex={1} px={8} pb={8}>
          {isLoading ? (
            <Text>Загрузка постов...</Text>
          ) : sortedPosts.length > 0 ? (
            <VStack align="stretch" spacing={6} width="100%">
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
          ) : (
            <Result
              status="404"
              title="Постов в блоге нет 😿"
              subTitle="Извините, постов пока нет."
              extra={
                <Button
                  as={Link}
                  href="https://discord.com/channels/287605345021460482/1279580573727195310"
                  isExternal
                  colorScheme="blue"
                  leftIcon={<FaPencilAlt />}
                >
                  Но вы можете написать пост ПЕРВЫМ!
                </Button>
              }
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ProjectBlog;