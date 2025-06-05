import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api'; // Assuming auth service is still used
import { useToast } from '@chakra-ui/react';

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Icon, // Keep Icon for the ChakraIcon helper
  useColorModeValue,
  Progress,
  Spinner, // Added Spinner for loading state
  Modal, // Added Modal components
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure, // Hook for modal
  FormControl, // Added Form components
  FormLabel,
  Input, // Added Input
  Slider, // Added Slider
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Switch, // Added Switch
  RadioGroup, // Added Radio components
  Radio,
  Stack, // Ensure Stack is imported for RadioGroup
} from '@chakra-ui/react';

// Import Icons from react-icons/fa
import {
  FaArrowLeft,
  FaLightbulb, // Example icon for energy tips
  FaDollarSign, // Use for Top-Up
  FaChartBar, // Use for Usage Graph
  FaCalendarDay, // Use for Days Remaining
  FaSun, // Use for Solar Tracker
  FaToggleOn, // Use for Power Alerts
  FaBolt, // Use for Energy Mode
} from 'react-icons/fa';

// Import Lucide Icons - only include what's used
/*
const ChakraIcon = ({ icon, ...props }) => {
  // Check if icon is a valid React component
  if (!React.isValidElement(icon) && typeof icon !== 'function') {
      console.error("Invalid icon provided to ChakraIcon:", icon);
      return null; // Or return a default icon
  }
  const ChakraComp = icon;
  return <Icon as={ChakraComp} {...props} />;
};
*/

function DashboardPage() {
  const navigate = useNavigate();
  const user = auth.getCurrentUser();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook for Top-Up Modal

  // State for Top-Up Modal
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isToppingUp, setIsToppingUp] = useState(false);

  // State for Energy Budget
  const [energyBudget, setEnergyBudget] = useState(500);
  // The state setter setCurrentUsage is unused, but keep currentUsage if it's used
  const [currentUsage, /* Removed setCurrentUsage */] = useState(400);

  // State for Energy Saving Tips (Memoized)
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const energyTips = useMemo(() => [ // Wrapped in useMemo
      "Unplug electronics when not in use to save standby power.",
      "Switch to LED bulbs for significant energy savings.",
      "Use natural light whenever possible.",
      "Ensure your geyser is insulated and set to a lower temperature.",
      "Close curtains or blinds to retain heat in winter and block sun in summer."
  ], []); // Empty dependency array

  // State for Solar Efficiency
  const [currentSolarOutput, /* Removed setCurrentSolarOutput */] = useState(65); // Dummy percentage
  const maxSolarOutput = 100;

  // State for Power Alerts
  const [powerAlertsEnabled, setPowerAlertsEnabled] = useState(true); // Dummy toggle state

  // State for Energy Mode
  const [energyMode, setEnergyMode] = useState('saver'); // Dummy mode state

  // Dummy data for Estimated Days Remaining (based on dummy usage and a starting credit)
  const startingCredit = 1000; // Dummy starting credit
  const estimatedDaysRemaining = Math.floor((startingCredit - currentUsage) / (currentUsage / 30)) || 0; // Dummy calculation

  // Dummy data for Usage Graph (simple array for demonstration)
   const dailyUsage = [20, 25, 18, 30, 22, 28, 21]; // Dummy kWh usage for 7 days


  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');

  // Define modal colors using useColorModeValue at the top level:
  const modalBg = useColorModeValue('rgba(255, 255, 255, 0.15)', 'rgba(26, 32, 44, 0.15)');
  const modalBorderColor = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: 'Authentication required',
        description: 'Please log in to access this page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user, navigate, toast]);

   // Effect to rotate energy tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) =>
        prevIndex === energyTips.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000); // Rotate every 7 seconds

    return () => clearInterval(interval);
  }, [energyTips]); // energyTips is now stable

  // Handle Top-Up submission
  const handleTopUp = async () => {
      setIsToppingUp(true);
      // Simulate API call for topping up
      console.log(`Simulating top-up of R${topUpAmount}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

      toast({
          title: 'Top-up successful.',
          description: `You have successfully topped up R${topUpAmount}.`,
          status: 'success',
          duration: 4000,
          isClosable: true,
      });

      setIsToppingUp(false);
      setTopUpAmount(''); // Clear input
      onClose(); // Close modal
      // In a real app, you'd update the user's credit balance here
  };


  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <Spinner size="xl" color={spinnerColor} />
      </Flex>
    );
  }

  return (
    <Box
      minH="100vh"
      backgroundImage="linear-gradient(to bottom right, #FF8C42, #4A00E0)"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment="fixed"
      position="relative"
      _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
      }}
    >
      <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6, lg: 8 }} position="relative" zIndex={2}>
        {/* Header with Back to Home button */}
        <Flex justify="space-between" align="center" mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/home')}
            color={headingColor}
          >
            Back to Home
          </Button>
        </Flex>

        {/* Dashboard Content */}
        <Heading as="h1" size="xl" color={headingColor} mb={6}>
          Dashboard
        </Heading>

        {/* Existing Dashboard Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={10}> {/* Added margin bottom */}
          {/* Example: Energy Usage Card */}
          <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
          >
            <Heading as="h3" size="md" mb={4}>
              Energy Usage
            </Heading>
            {/* Add your energy usage content here */}
            <Text color={textColor}>[Graph or key stats here]</Text>
          </Box>

          {/* Example: Financial Overview Card */}
          <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
          >
            <Heading as="h3" size="md" mb={4}>
              Financial Overview
            </Heading>
            {/* Add your financial overview content here */}
             <Text color={textColor}>[Summary of balance, recent transactions]</Text>
          </Box>

          {/* Example: Recent Activity Card */}
          <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
          >
            <Heading as="h3" size="md" mb={4}>
              Recent Activity
            </Heading>
            {/* Add your recent activity content here */}
            <Text color={textColor}>[List of recent top-ups, payments, etc.]</Text>
          </Box>
          {/* Add more dashboard cards/sections as needed */}
        </SimpleGrid>

        {/* New Energy-Related Features Section */}
        <VStack spacing={8} align="stretch"> {/* VStack to stack new features */}

            {/* Top-Up Electricity */}
            <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                     <Heading as="h3" size="md">
                        Top Up Electricity
                     </Heading>
                     <Icon as={FaDollarSign} w={6} h={6} color="green.500" />
                </HStack>
                <Text color={textColor} mb={4}>Quickly add credit to your prepaid meter.</Text>
                <Button colorScheme="green" size="md" onClick={onOpen}>
                    Top Up Now
                </Button>

                {/* Top-Up Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent
                       bg={modalBg}
                       boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                       borderRadius="xl"
                       p={6} // Adjust padding as needed
                       textAlign="center" // Adjust text alignment as needed
                       backdropFilter="blur(10px)" // Apply blur effect
                       border="1px solid"
                       borderColor={modalBorderColor}
                    >
                        <ModalHeader>Top Up Electricity</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl id="top-up-amount">
                                <FormLabel>Enter Amount (R)</FormLabel>
                                <Input
                                    type="number"
                                    placeholder="e.g. 100"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="green" onClick={handleTopUp} isLoading={isToppingUp}>
                                Confirm Top Up
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>

            {/* Set Energy Budget */}
             <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                    <Heading as="h3" size="md">
                       Set Energy Budget (Monthly)
                    </Heading>
                    <Icon as={FaChartBar} w={6} h={6} color="blue.500" />
                </HStack>
                <Text color={textColor} mb={4}>Set a monthly target for your energy consumption.</Text>
                 <FormControl id="energy-budget">
                    <FormLabel>Monthly Budget (kWh)</FormLabel>
                    <Slider
                        aria-label="energy-budget-slider"
                        defaultValue={energyBudget}
                        min={100}
                        max={2000}
                        step={50}
                        onChange={(val) => setEnergyBudget(val)}
                    >
                        <SliderMark value={500} mt="1" ml="-2.5" fontSize="sm">500</SliderMark>
                        <SliderMark value={1000} mt="1" ml="-2.5" fontSize="sm">1000</SliderMark>
                         <SliderMark value={1500} mt="1" ml="-2.5" fontSize="sm">1500</SliderMark>
                        <SliderTrack>
                            <SliderFilledTrack bg={currentUsage > energyBudget ? 'red.500' : 'teal.500'} /> {/* Indicate over budget */}
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text mt={4} fontSize="lg" fontWeight="semibold">
                         Budget: <Text as="span" color="teal.500">{energyBudget}</Text> kWh
                    </Text>
                     <Text fontSize="sm" color={currentUsage > energyBudget ? 'red.500' : textColor} mt={2}>
                         Current Usage (Mock): {currentUsage} kWh {currentUsage > energyBudget && '(Over Budget!)'}
                     </Text>
                </FormControl>
            </Box>

            {/* Daily/Weekly Usage Graph Placeholder */}
             <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                    <Heading as="h3" size="md">
                       Daily/Weekly Usage Graph
                    </Heading>
                    <Icon as={FaChartBar} w={6} h={6} color="orange.500" />
                </HStack>
                <Text color={textColor} mb={4}>Visualize your energy consumption over time.</Text>
                {/* Simple mock graph representation */}
                <VStack align="stretch" spacing={1}>
                    {dailyUsage.map((usage, index) => (
                         <HStack key={index} justifyContent="space-between" fontSize="sm" color={textColor}>
                            <Text>Day {index + 1}</Text>
                            <Text fontWeight="semibold">{usage} kWh</Text>
                             <Box h="10px" bg="teal.300" w={`${usage * 2}%`} maxW="70%" borderRadius="sm"></Box> {/* Mock bar */}
                         </HStack>
                    ))}
                </VStack>
                 <Text fontSize="sm" color={textColor} mt={4}>[Placeholder for a more detailed chart]</Text>
            </Box>

            {/* Estimated Days Remaining */}
            <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                    <Heading as="h3" size="md">
                       Estimated Days Remaining
                    </Heading>
                    <Icon as={FaCalendarDay} w={6} h={6} color="purple.500" />
                </HStack>
                <Text color={textColor} mb={4}>Estimate how long your current credit will last.</Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    ~{estimatedDaysRemaining} Days Left
                </Text>
                 <Text fontSize="sm" color={textColor} mt={2}>
                     (Based on recent average usage and mock credit balance)
                 </Text>
            </Box>

            {/* Energy-Saving Tips */}
            <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                     <Heading as="h3" size="md">
                        Energy-Saving Tips
                     </Heading>
                    <Icon as={FaLightbulb} w={6} h={6} color="yellow.500" />
                </HStack>
                <Text color={textColor} minH="4.5em" display="flex" alignItems="center"> {/* Added minH to prevent layout shift */}
                    {energyTips[currentTipIndex]}
                </Text>
                 {/* Optional: Add dots or arrows for manual navigation if desired */}
            </Box>

            {/* Solar Efficiency Tracker */}
             <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                    <Heading as="h3" size="md">
                       Solar Efficiency Tracker
                    </Heading>
                    <Icon as={FaSun} w={6} h={6} color="orange.400" />
                </HStack>
                 <Text color={textColor} mb={4}>Monitor your solar panel's performance.</Text>
                 <Text fontSize="sm" fontWeight="semibold" mb={1} color={textColor}>
                    Current Output: {currentSolarOutput}%
                 </Text>
                <Progress value={currentSolarOutput} colorScheme="orange" size="lg" hasStripe isAnimated />
                 <Text fontSize="sm" color={textColor} mt={2}>
                     Goal: {maxSolarOutput}% (Potential Max Output)
                 </Text>
            </Box>

            {/* Enable Power Alerts */}
             <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                    <Heading as="h3" size="md">
                       Enable Power Alerts
                    </Heading>
                     <Icon as={FaToggleOn} w={6} h={6} color={powerAlertsEnabled ? 'green.500' : 'gray.500'} />
                </HStack>
                 <Text color={textColor} mb={4}>Get notified about low credit or unusual usage.</Text>
                 <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="power-alerts" mb="0">
                       {powerAlertsEnabled ? 'Alerts Enabled' : 'Alerts Disabled'}
                    </FormLabel>
                    <Switch
                        id="power-alerts"
                        isChecked={powerAlertsEnabled}
                        onChange={(e) => setPowerAlertsEnabled(e.target.checked)}
                        colorScheme="teal"
                    />
                </FormControl>
            </Box>

             {/* Energy Mode Switcher */}
             <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                <HStack justifyContent="space-between" mb={4}>
                    <Heading as="h3" size="md">
                       Energy Mode
                    </Heading>
                    <Icon as={FaBolt} w={6} h={6} color="yellow.400" />
                </HStack>
                 <Text color={textColor} mb={4}>Choose an energy consumption profile.</Text>
                 <RadioGroup onChange={setEnergyMode} value={energyMode}>
                    <Stack direction={{ base: 'column', md: 'row'}} spacing={5}>
                        <Radio value="saver" colorScheme="teal">
                             <Box>
                                 <Text fontWeight="semibold">Saver Mode</Text>
                                 <Text fontSize="sm" color={textColor}>Optimizes for low consumption.</Text>
                             </Box>
                        </Radio>
                        <Radio value="boost" colorScheme="orange">
                            <Box>
                                 <Text fontWeight="semibold">Boost Mode</Text>
                                 <Text fontSize="sm" color={textColor}>Prioritizes performance (uses more energy).</Text>
                             </Box>
                        </Radio>
                    </Stack>
                 </RadioGroup>
            </Box>

        </VStack>


      </Box>
    </Box>
  );
}

export default DashboardPage;
