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
  Image,
} from '@chakra-ui/react';
import {
  FaSolarPanel,
  FaChartLine,
  FaLeaf,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import nathiProfile from '../assets/images/IMG Nathii.jpg';
import okuhleProfile from '../assets/images/sleigh.png';
import mphoProfile from '../assets/images/Mpho.png';
import lihleProfile from '../assets/images/LIHLE.png';
import gridXBackground from '../assets/images/GridX-IMG.jpg';

// Create motion components
const MotionBox = motion(Box);

// Add these animation variants at the top of the file, after the imports
const textVariants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

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
  const containerBg = useColorModeValue('rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.8)');
  // Removed languageColor as language name is no longer displayed
  const greetingColor = useColorModeValue('white', 'white');

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
      py={10}
      px={4}
      bg={containerBg}
      textAlign="center"
      borderRadius="full"
      boxShadow="lg"
      maxW="container.md"
      mx="auto"
      mt={12}
      mb={12}
      backdropFilter="blur(10px)"
    >
      <VStack spacing={4}>
        {/* Updated Heading */}
        <Heading 
          size="lg"
          color={greetingColor}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
        >
          Discover the Spirit of South Africa!
        </Heading>

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
            >
                {/* Only display the greeting word */}
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color={greetingColor}
                  textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
                >
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
  
  // Update color mode values for better contrast against the background
  const bgGradient = useColorModeValue(
    'linear(to-b, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    'linear(to-b, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))'
  );
  const textColor = useColorModeValue('white', 'white');
  const headingColor = useColorModeValue('white', 'white');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const cardBorderColor = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)');
  const developerSectionBg = useColorModeValue('rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.8)');
  const developerCardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const descriptionColor = useColorModeValue('gray.700', 'gray.300');

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

  // Enhanced features with animations and icons
  const features = useMemo(() => [
    {
      icon: FaSolarPanel,
      title: 'Solar Power Management',
      description: 'Monitor and optimize your solar energy usage in real-time',
      animation: {
        hover: {
          scale: 1.05,
          rotate: 2,
          transition: {
            duration: 0.3,
            ease: "easeInOut"
          }
        }
      }
    },
    {
      icon: FaChartLine,
      title: 'Smart Financial Tools',
      description: 'Track expenses, manage payments, and save on energy costs',
      animation: {
        hover: {
          scale: 1.05,
          rotate: -2,
          transition: {
            duration: 0.3,
            ease: "easeInOut"
          }
        }
      }
    },
    {
      icon: FaLeaf,
      title: 'Energy Efficiency',
      description: 'Get insights and recommendations to improve your energy consumption',
      animation: {
        hover: {
          scale: 1.05,
          rotate: 2,
          transition: {
            duration: 0.3,
            ease: "easeInOut"
          }
        }
      }
    },
  ], []);

  // Developer data
  const developers = useMemo(() => [
    { 
      name: 'Kgothatso Mokgashi', 
      role: 'Backend',
      description: "Builds secure, scalable APIs that connect frontend brilliance to solid server logic."
    },
    { 
      name: 'Okuhle Gadla', 
      role: 'Backend',
      description: "Builds secure, scalable APIs that connect frontend brilliance to solid server logic."
    },
    { 
      name: 'Thembelihle Zulu', 
      role: 'Database',
      description: "Ensures reliable data structures and optimized queries that keep the app's engine running strong."
    },
    { 
      name: 'Mpho Ramokhoase', 
      role: 'Frontend',
      description: "Crafts seamless, user-friendly interfaces with an eye for responsive design and smooth interactions."
    },
    { 
      name: 'Nkosinathi Radebe', 
      role: 'Frontend',
      description: "Brings UI designs to life with pixel-perfect precision and a deep focus on performance."
    },
  ], []);

  return (
    <Box 
      minH="100vh"
      position="relative"
      backgroundImage={`url(${gridXBackground})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment="fixed"
    >
      {/* Add an overlay to ensure content readability */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1"
      />

      {/* Hero Section */}
      <Box
        position="relative"
        zIndex="2"
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
              textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
            >
              Welcome to GridX
            </Heading>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={textVariants}
              >
                <Text
                  fontSize="xl"
                  color={textColor}
                  maxW="2xl"
                  minH="80px"
                  textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
                >
                  {messages[currentMessageIndex]}
                </Text>
              </motion.div>
            </AnimatePresence>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => navigate('/register')}
              px={8}
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Rotating Greetings Section */}
      <Box position="relative" zIndex="2">
        <RotatingGreetingsSection />
      </Box>

      {/* Features Section with Enhanced Animation */}
      <Container maxW="container.xl" py={20} px={4} position="relative" zIndex="2">
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
                <MotionBox
                  key={index}
                  p={8}
                  bg={cardBg}
                  borderRadius="full"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={cardBorderColor}
                  textAlign="center"
                  whileHover="hover"
                  variants={feature.animation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  _hover={{
                    boxShadow: 'lg',
                  }}
                >
                  <Icon
                    as={feature.icon}
                    w={12}
                    h={12}
                    color="blue.500"
                    mb={4}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'scale(1.1)',
                      color: 'blue.600',
                    }}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    color={headingColor}
                    mb={4}
                    transition="all 0.3s ease"
                  >
                    {feature.title}
                  </Heading>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={textVariants}
                  >
                    <Text 
                      color={textColor}
                      transition="all 0.3s ease"
                    >
                      {feature.description}
                    </Text>
                  </motion.div>
                </MotionBox>
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
                <MotionBox
                  key={`duplicate-${index}`}
                  p={8}
                  bg={cardBg}
                  borderRadius="full"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={cardBorderColor}
                  textAlign="center"
                  whileHover="hover"
                  variants={feature.animation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  _hover={{
                    boxShadow: 'lg',
                  }}
                >
                  <Icon
                    as={feature.icon}
                    w={12}
                    h={12}
                    color="blue.500"
                    mb={4}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'scale(1.1)',
                      color: 'blue.600',
                    }}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    color={headingColor}
                    mb={4}
                    transition="all 0.3s ease"
                  >
                    {feature.title}
                  </Heading>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={textVariants}
                  >
                    <Text 
                      color={textColor}
                      transition="all 0.3s ease"
                    >
                      {feature.description}
                    </Text>
                  </motion.div>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
      </Container>

      {/* Meet the Developers Section */}
      <Box 
        bg={developerSectionBg} 
        py={20} 
        px={4}
        position="relative"
        zIndex="2"
      >
        <Container maxW="container.xl">
          <Heading 
            as="h2" 
            size="xl" 
            textAlign="center" 
            mb={10} 
            color={headingColor}
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
          >
            Meet the Developers
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={8}>
            {developers.map((dev, index) => (
              <VStack
                key={index}
                spacing={3}
                p={4}
                bg={developerCardBg}
                borderRadius="lg"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={cardBorderColor}
                textAlign="center"
                width="100%"
                backdropFilter="blur(10px)"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.3s ease"
              >
                {dev.name === 'Nkosinathi Radebe' ? (
                  <Image
                    src={nathiProfile}
                    alt={dev.name}
                    width="300px"
                    height="300px"
                    borderRadius="lg"
                    objectFit="cover"
                  />
                ) : dev.name === 'Okuhle Gadla' ? (
                  <Image
                    src={okuhleProfile}
                    alt={dev.name}
                    width="300px"
                    height="300px"
                    borderRadius="lg"
                    objectFit="cover"
                  />
                ) : dev.name === 'Mpho Ramokhoase' ? (
                  <Image
                    src={mphoProfile}
                    alt={dev.name}
                    width="300px"
                    height="300px"
                    borderRadius="lg"
                    objectFit="cover"
                  />
                ) : dev.name === 'Thembelihle Zulu' ? (
                  <Image
                    src={lihleProfile}
                    alt={dev.name}
                    width="300px"
                    height="300px"
                    borderRadius="lg"
                    objectFit="cover"
                  />
                ) : (
                  <Avatar size="xl" name={dev.name} />
                )}
                <Text 
                  fontWeight="bold" 
                  fontSize="lg" 
                  color={headingColor}
                >
                  {dev.name}
                </Text>
                <Text 
                  fontSize="md" 
                  color={textColor}
                >
                  {dev.role}
                </Text>
                <Text 
                  fontSize="sm" 
                  color={descriptionColor}
                  textAlign="center"
                  px={2}
                >
                  {dev.description}
                </Text>
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
        bg="rgba(0, 0, 0, 0.8)"
        position="relative"
        zIndex="2"
        borderRadius="full"
        mx={4}
        mb={4}
      >
        <Container maxW="container.xl">
          <Flex
            justify="center"
            align="center"
            color={textColor}
          >
            <Text>
              © {new Date().getFullYear()} GridX. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
