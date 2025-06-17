import React from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const LoadSheddingPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          mb={8}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
        
        <VStack spacing={8} align="stretch">
          <Heading size="xl">Load Shedding Schedule</Heading>
          {/* Add your load shedding schedule content here */}
          <Box p={6} bg="white" shadow="md" borderRadius="lg">
            <Heading size="md" mb={4}>Coming Soon</Heading>
            <Box>Load shedding schedule and features will be available soon.</Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoadSheddingPage;
