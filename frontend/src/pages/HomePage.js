import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Container,
  Spinner,
  useToast,
  IconButton,
  VStack,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Fade,
} from '@chakra-ui/react';

// Import Icons
import {
  FaUser,
  FaMoneyBill,
  FaBell,
  FaCog,
  FaChartLine,
  FaLeaf,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaQuestionCircle,
  FaCommentAlt,
  FaBolt,
  FaGift,
  FaUsers,
} from 'react-icons/fa';

// Import useColorMode hook
import { useColorMode } from '@chakra-ui/react';

function HomePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = auth.getCurrentUser();
  const { colorMode, toggleColorMode } = useColorMode();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');
  const iconColor = useColorModeValue('gray.700', 'gray.200');

  // Add these color mode values with the other useColorModeValue calls at the top of the component
  const loadSheddingBg = useColorModeValue('gray.50', 'gray.700');
  const loadSheddingText = useColorModeValue('gray.600', 'gray.400');

  // Navigation items (Memoized for performance)
  const navItems = useMemo(() => [
    {
      icon: FaChartLine,
      title: 'Dashboard',
      description: 'View your power usage and financial summary',
      path: '/dashboard',
      colorScheme: 'blue'
    },
    {
      icon: FaUser,
      title: 'Profile',
      description: 'Manage your personal information',
      path: '/profile',
      colorScheme: 'teal'
    },
    {
      icon: FaMoneyBill,
      title: 'Top Up',
      description: 'Add credit to your power account',
      path: '/top-up',
      colorScheme: 'green'
    },
    {
      icon: FaChartLine,
      title: 'Expenses',
      description: 'Track your power expenses',
      path: '/expenses',
      colorScheme: 'purple'
    },
    {
      icon: FaBell,
      title: 'Notifications',
      description: 'View your alerts and updates',
      path: '/notifications',
      colorScheme: 'orange'
    },
    {
      icon: FaCog,
      title: 'Settings',
      description: 'Customize your preferences',
      path: '/settings',
      colorScheme: 'gray'
    },
    {
      icon: FaLeaf,
      title: 'Impact',
      description: 'See your environmental impact',
      path: '/impact',
      colorScheme: 'teal'
    },
    {
      icon: FaQuestionCircle,
      title: 'Support',
      description: 'Get help and find answers',
      path: '/support',
      colorScheme: 'blue'
    },
    {
      icon: FaCommentAlt,
      title: 'Forum',
      description: 'Join the community discussion',
      path: '/forum',
      colorScheme: 'purple'
    },
    {
      icon: FaGift,
      title: 'Refer & Earn',
      description: 'Invite friends and get rewards',
      path: '/refer',
      colorScheme: 'orange'
    },
    {
      icon: FaUsers,
      title: 'Group Buying',
      description: 'Join or create group solar purchases and save',
      path: '/group-buying',
      colorScheme: 'purple'
    }
  ], []);

  // Define Subscription Plans - Updated with features
  const subscriptionPlans = useMemo(() => [
    {
      id: 'basic',
      name: 'Basic',
      price: 49,
      features: [
        'Access to core features',
        'Basic energy usage tracking',
        'Email support'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 99,
      features: [
        'All Basic features',
        'Detailed analytics & reports',
        'Priority email & chat support',
        'Load shedding notifications'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 149,
      features: [
        'All Standard features',
        'Real-time energy monitoring',
        'Dedicated account manager',
        'Early access to new features',
        'VIP support'
      ]
    },
  ], []);

  // State for selected plan
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [loadSheddingStage] = useState(2); // Mock current stage
  const [nextLoadShedding] = useState({
    date: '2024-03-20',
    startTime: '14:00',
    endTime: '16:30',
    stage: 2
  });

  // Add this state near other state declarations
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  // Add this array of tips
  const solarTips = [
    "Clean your solar panels regularly for optimal performance",
    "Monitor your energy usage during peak sunlight hours",
    "Consider battery storage for power during load shedding",
    "Use energy-intensive appliances during daylight hours",
    "Regular maintenance extends your solar system's lifespan"
  ];

  // Add this useEffect for rotating tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => 
        prevIndex === solarTips.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to access this page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user, navigate, toast]);

  // Handle logout
  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  // Handle selecting and saving the plan
  const handleSelectAndSavePlan = async (plan) => {
    setSelectedPlan(plan);
    setIsSavingPlan(true);
    console.log(`Saving plan ${plan.name} with price R${plan.price}`);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Plan Selected & Saved.',
      description: `You have selected and saved the ${plan.name} plan.`,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    setIsSavingPlan(false);
  };

  // Show loading spinner while checking authentication
  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <Spinner size="xl" color={spinnerColor} />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        {/* Header with Welcome and Theme Toggle */}
        <Flex justify="space-between" align="center" mb={8}>
          {/* Welcome Section */}
          <Box>
            <Heading
              as="h1"
              size="xl"
              color={headingColor}
              mb={2}
            >
              Welcome, {user.name}!
            </Heading>
            <Text fontSize="lg" color={textColor}>
              What would you like to do today?
            </Text>
          </Box>

          {/* Tips and Theme Toggle Section */}
          <Flex align="center" gap={4}>
            <Fade in={true} transition={{ enter: { duration: 0.5 }, exit: { duration: 0.5 } }}>
              <Text
                fontSize="sm"
                color={textColor}
                maxW="300px"
                textAlign="right"
                fontStyle="italic"
              >
                💡 Tip: {solarTips[currentTipIndex]}
              </Text>
            </Fade>

            {/* Theme Toggle Button */}
            <IconButton
              aria-label="Toggle Theme"
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="xs"
              color={iconColor}
              fontSize="sm"
            />
          </Flex>
        </Flex>

        {/* Navigation Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          mb={12}
        >
          {navItems.map((item) => (
            <Box
              key={item.path}
              p={6}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={cardBorderColor}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                transition: 'all 0.2s'
              }}
              onClick={() => navigate(item.path)}
              cursor="pointer"
              role="group"
            >
              <Flex align="center" mb={3}>
                 <Icon
                    as={item.icon}
                    w={8}
                    h={8}
                    color={`${item.colorScheme}.500`}
                    _groupHover={{ color: `${item.colorScheme}.600` }}
                    mr={4}
                 />
                 <Heading as="h3" size="md" color={headingColor}>
                    {item.title}
                 </Heading>
              </Flex>
              <Text fontSize="sm" color={textColor}>
                {item.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Subscription Plans Section */}
        <Box
          p={6}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={cardBorderColor}
          mb={8}
        >
          <Heading as="h2" size="lg" color={headingColor} mb={4}>
            Subscription Plans
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {subscriptionPlans.map((plan) => (
              <Box
                key={plan.id}
                p={6}
                borderWidth="1px"
                borderRadius="md"
                borderColor={selectedPlan.id === plan.id ? 'blue.500' : cardBorderColor}
                textAlign="center"
                cursor="pointer"
                onClick={() => handleSelectAndSavePlan(plan)}
                _hover={{
                  borderColor: 'blue.400',
                  boxShadow: 'sm'
                }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <VStack spacing={3} align="center">
                  <Text fontWeight="bold" fontSize="xl">
                    {plan.name}
                  </Text>
                  <Text fontSize="3xl" fontWeight="extrabold" color="green.500">
                    R{plan.price}
                  </Text>

                  <VStack align="start" spacing={1} mt={3}>
                    {plan.features.map((feature, idx) => (
                      <Text key={idx} fontSize="sm" color={textColor}>
                         - {feature}
                      </Text>
                    ))}
                  </VStack>
                </VStack>

                <Button
                  mt={6}
                  size="sm"
                  colorScheme={selectedPlan.id === plan.id ? 'blue' : 'gray'}
                  onClick={() => handleSelectAndSavePlan(plan)}
                  isLoading={isSavingPlan && selectedPlan.id === plan.id}
                  loadingText="Saving"
                >
                  {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Load Shedding Section */}
        <Box
          p={6}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={cardBorderColor}
          mb={8}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="lg" color={headingColor}>
              Load Shedding Status
            </Heading>
            <Icon as={FaBolt} w={6} h={6} color={loadSheddingStage >= 5 ? 'red.500' : 'yellow.500'} />
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box
              p={4}
              bg={loadSheddingBg}
              borderRadius="md"
            >
              <Text fontSize="sm" color={loadSheddingText} mb={2}>Current Stage</Text>
              <Badge
                colorScheme={
                  loadSheddingStage >= 5
                    ? 'red'
                    : loadSheddingStage >= 3
                    ? 'orange'
                    : 'yellow'
                }
                fontSize="lg"
                p={2}
              >
                Stage {loadSheddingStage}
              </Badge>
            </Box>

            <Box
              p={4}
              bg={loadSheddingBg}
              borderRadius="md"
            >
              <Text fontSize="sm" color={loadSheddingText} mb={2}>Next Load Shedding</Text>
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">
                  {new Date(nextLoadShedding.date).toLocaleDateString()}
                </Text>
                <Text>
                  {nextLoadShedding.startTime} - {nextLoadShedding.endTime}
                </Text>
                <Badge
                  colorScheme={
                    nextLoadShedding.stage >= 5
                      ? 'red'
                      : nextLoadShedding.stage >= 3
                      ? 'orange'
                      : 'yellow'
                  }
                >
                  Stage {nextLoadShedding.stage}
                </Badge>
              </VStack>
            </Box>
          </SimpleGrid>

          {loadSheddingStage >= 5 && (
            <Alert status="error" mt={4} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>High Load Shedding Stage!</AlertTitle>
                <AlertDescription>
                  Your area is experiencing Stage {loadSheddingStage} load shedding. Please plan accordingly.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            mt={4}
            onClick={() => navigate('/loadshedding')}
          >
            View Full Schedule
          </Button>
        </Box>

        {/* Logout Button */}
        <Box textAlign="center" mt={8}>
          <Button
            colorScheme="red"
            onClick={handleLogout}
            leftIcon={<FaSignOutAlt />}
            size="lg"
          >
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
