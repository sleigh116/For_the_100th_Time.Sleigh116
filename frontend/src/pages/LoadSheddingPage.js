import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  Button,
  VStack,
  useToast,
  useColorModeValue,
  Spinner,
  HStack,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Badge
} from '@chakra-ui/react';

// Import Icons
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

function LoadSheddingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = auth.getCurrentUser();

  // State for form and schedule
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock locations data
  const locations = [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'Pretoria',
    'Port Elizabeth',
    'Bloemfontein',
    'East London',
    'Nelspruit'
  ];

  // Mock schedule data generator
  const generateMockSchedule = (location) => {
    const stages = [1, 2, 3, 4, 5, 6];
    const today = new Date();
    const schedule = [];

    // Generate 7 days of schedule
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Randomly select 2-3 time slots per day
      const slots = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < slots; j++) {
        const stage = stages[Math.floor(Math.random() * stages.length)];
        const startHour = Math.floor(Math.random() * 12) + 6; // Between 6 AM and 6 PM
        const duration = Math.floor(Math.random() * 2) + 2; // 2-3 hours

        schedule.push({
          date: date.toISOString().split('T')[0],
          startTime: `${startHour}:00`,
          endTime: `${startHour + duration}:00`,
          stage: stage
        });
      }
    }

    return schedule;
  };

  // Handler for getting schedule
  const handleGetSchedule = async () => {
    if (!location) {
      toast({
        title: 'Location Required',
        description: 'Please select your location',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockSchedule = generateMockSchedule(location);
    setSchedule(mockSchedule);
    
    // Check if any stage is 5 or higher
    const hasHighStage = mockSchedule.some(slot => slot.stage >= 5);
    setShowWarning(hasHighStage);
    
    setIsLoading(false);
  };

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        {/* Header with Back button */}
        <HStack justify="space-between" mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/home')}
            color={headingColor}
          >
            Back to Home
          </Button>
        </HStack>

        <Heading as="h1" size="xl" color={headingColor} mb={6}>
          Load Shedding Schedule
        </Heading>

        {/* Location Selection */}
        <Box
          p={6}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={cardBorderColor}
          mb={6}
        >
          <VStack spacing={4}>
            <Select
              placeholder="Choose your city or suburb"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>

            <Button
              colorScheme="blue"
              onClick={handleGetSchedule}
              isLoading={isLoading}
              loadingText="Fetching Schedule..."
              w="full"
            >
              Get Schedule
            </Button>
          </VStack>
        </Box>

        {/* Warning Banner for Stage 5+ */}
        {showWarning && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon as={FaExclamationTriangle} />
            <Box>
              <AlertTitle>High Load Shedding Stage Detected!</AlertTitle>
              <AlertDescription>
                Your area is experiencing Stage 5 or higher load shedding. Please plan accordingly.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Schedule Display */}
        {schedule && (
          <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
          >
            <Heading as="h2" size="md" mb={4} color={headingColor}>
              Schedule for {location}
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Stage</Th>
                </Tr>
              </Thead>
              <Tbody>
                {schedule.map((slot, index) => (
                  <Tr key={index}>
                    <Td>{slot.date}</Td>
                    <Td>{`${slot.startTime} - ${slot.endTime}`}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          slot.stage >= 5
                            ? 'red'
                            : slot.stage >= 3
                            ? 'orange'
                            : 'yellow'
                        }
                      >
                        Stage {slot.stage}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default LoadSheddingPage;
