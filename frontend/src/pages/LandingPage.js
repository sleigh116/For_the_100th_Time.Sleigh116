import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Avatar,
  VStack,
  HStack,
} from '@chakra-ui/react';
import {
  FaSun,
  FaMoneyBillWave,
  FaBolt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function RotatingGreetingsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define greetings using useMemo with the new list (only greetings)
  const southAfricanGreetings = useMemo(() => [
    'Hello',
    'Hallo',
    'Sawubona',
    'Molo',
    'Lotjhani',
    'Sawubona',
    'Dumela',
    'Dumela',
    'Dumela',
    'Avuxeni',
    'Ndaa',
  ], []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Handle the case where greetings list might be empty
    if (southAfricanGreetings.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % southAfricanGreetings.length);
    }, 3000); // Change every 3000 milliseconds (3 seconds)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [southAfricanGreetings]); // Re-run if greetings data changes (though memoized)

  // Color mode values for styling the container
  const containerBg = useColorModeValue('blue.50', 'blue.900');
  // Removed languageColor as language name is no longer displayed
  const greetingColor = useColorModeValue('gray.800', 'white');

  const currentGreeting = southAfricanGreetings[currentIndex];

  // Define animation variants for the text
  const textVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Handle case where greetings list might be empty
  if (southAfricanGreetings.length === 0) {
      return null; // Or a placeholder message
  }

  return (
    <Box
      py={10} // Vertical padding
      px={4} // Horizontal padding
      bg={containerBg} // Background color based on theme
      textAlign="center" // Center content horizontally
      borderRadius="lg" // Rounded corners
      boxShadow="md" // Subtle shadow
      maxW="container.md" // Maximum width
      mx="auto" // Center the box horizontally
      mt={12} // Margin top to space it from the section above
      mb={12} // Margin bottom to space it from the section below
    >
      <VStack spacing={4}>
        {/* Updated Heading */}
        <Heading size="lg">Discover the Spirit of South Africa!</Heading>

        {/* Use AnimatePresence and motion.Text for fading */}
        <AnimatePresence mode="wait"> {/* 'wait' mode ensures one exits before the next enters */}
          {/* Key changes with index, triggering animation */}
          {/* Use a div or span inside AnimatePresence to wrap the motion component */}
           <motion.div
                key={currentIndex}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={textVariants}
                transition={{ duration: 0.5 }} // Animation duration
            >
                {/* Only display the greeting word */}
                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color={greetingColor}>
                    {currentGreeting}
                </Text>
            </motion.div>
        </AnimatePresence>

      </VStack>
    </Box>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  
  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, blue.900, gray.900)'
  );
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const developerSectionBg = useColorModeValue('gray.50', 'gray.800');
  const developerCardBg = useColorModeValue('white', 'gray.700');

  // Define and memoize the rotating messages
  const messages = useMemo(() => [
    "Manage your solar energy and finances in one place. Track usage, optimize costs, and make smarter energy decisions.",
    "Take control of your energy future. Monitor solar production and reduce your carbon footprint.",
    "Smart financial tools for sustainable living. Save money while saving the planet.",
    "Real-time insights into your energy consumption. Make informed decisions for a greener tomorrow.",
    "Join the renewable energy revolution. Power your home with clean, sustainable energy."
  ], []);

  // State for current message
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Effect to rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [messages]);

  const features = useMemo(() => [
    {
      icon: FaSun,
      title: 'Solar Power Management',
      description: 'Monitor and optimize your solar energy usage in real-time',
    },
    {
      icon: FaMoneyBillWave,
      title: 'Smart Financial Tools',
      description: 'Track expenses, manage payments, and save on energy costs',
    },
    {
      icon: FaBolt,
      title: 'Energy Efficiency',
      description: 'Get insights and recommendations to improve your energy consumption',
    },
  ], []);

  // Developer data
  const developers = useMemo(() => [
    { name: 'Kgothatso Mokgashi', role: 'Backend' },
    { name: 'Okuhle Gadla', role: 'Backend' },
    { name: 'Thembelihle Zulu', role: 'Database' },
    { name: 'Mpho Ramokhoase', role: 'Frontend' },
    { name: 'Nkosinathi Radebe', role: 'Frontend' },
  ], []);

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        py={20}
        px={4}
      >
        <Container maxW="container.xl">
          <Stack
            spacing={8}
            align="center"
            textAlign="center"
          >
            <Heading
              as="h1"
              size="2xl"
              color={headingColor}
              fontWeight="bold"
            >
              Welcome to Solar Fintech
            </Heading>
            <Text
              fontSize="xl"
              color={textColor}
              maxW="2xl"
              minH="80px"
              transition="all 0.5s ease-in-out"
              opacity={1}
              transform="translateY(0)"
              sx={{
                '&.fade-enter': {
                  opacity: 0,
                  transform: 'translateY(10px)',
                },
                '&.fade-enter-active': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }}
              key={currentMessageIndex}
            >
              {messages[currentMessageIndex]}
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => navigate('/register')}
              px={8}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* New/Updated Rotating Greetings Section */}
      <RotatingGreetingsSection />

      {/* Features Section with Animation */}
      <Container maxW="container.xl" py={20} px={4}>
        <Box
          position="relative"
          width="100%"
          overflow="hidden"
          sx={{
            '&:hover .feature-slider': {
              animationPlayState: 'paused',
            },
          }}
        >
          <Flex
            className="feature-slider"
            width="200%"
            position="relative"
            animation="slide 30s linear infinite"
            sx={{
              '@keyframes slide': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
            }}
          >
            {/* First set of features */}
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={10}
              width="100%"
              flexShrink={0}
            >
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={8}
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={cardBorderColor}
                  textAlign="center"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: 'lg',
                  }}
                >
                  <Icon
                    as={feature.icon}
                    w={10}
                    h={10}
                    color="blue.500"
                    mb={4}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    color={headingColor}
                    mb={4}
                  >
                    {feature.title}
                  </Heading>
                  <Text color={textColor}>
                    {feature.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            {/* Duplicate set of features for seamless scrolling */}
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={10}
              width="100%"
              flexShrink={0}
            >
              {features.map((feature, index) => (
                <Box
                  key={`duplicate-${index}`}
                  p={8}
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={cardBorderColor}
                  textAlign="center"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: 'lg',
                  }}
                >
                  <Icon
                    as={feature.icon}
                    w={10}
                    h={10}
                    color="blue.500"
                    mb={4}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    color={headingColor}
                    mb={4}
                  >
                    {feature.title}
                  </Heading>
                  <Text color={textColor}>
                    {feature.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
      </Container>

      {/* Meet the Developers Section */}
      <Box bg={developerSectionBg} py={20} px={4}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" textAlign="center" mb={10} color={headingColor}>
            Meet the Developers
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={8}>
            {developers.map((dev, index) => (
              <VStack
                key={index}
                spacing={3}
                p={6}
                bg={developerCardBg}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={cardBorderColor}
                textAlign="center"
              >
                <Avatar size="xl" name={dev.name} />
                <Text fontWeight="bold" fontSize="lg" color={headingColor}>{dev.name}</Text>
                <Text fontSize="md" color={textColor}>{dev.role}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        py={8}
        px={4}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Container maxW="container.xl">
          <Flex
            justify="center"
            align="center"
            color={textColor}
          >
            <Text>
              © {new Date().getFullYear()} Solar Fintech. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
