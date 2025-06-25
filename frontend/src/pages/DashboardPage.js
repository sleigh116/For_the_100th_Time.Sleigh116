import React from 'react';
import {
  Box,
  SimpleGrid,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Progress,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from '@chakra-ui/react';
import { FaArrowLeft, FaSolarPanel, FaCoins, FaTree, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import EnergyModeToggle from '../components/widgets/EnergyModeToggle';
import BudgetDial from '../components/widgets/BudgetDial';
import DailyForecast from '../components/widgets/DailyForecast';
import ThemeSwitcher from '../components/widgets/ThemeSwitcher';
import SolarOutput from '../components/widgets/SolarOutput';
import WidgetLayout from '../components/widgets/WidgetLayout';
import EnergyAvatar from '../components/widgets/EnergyAvatar';
import ActivityReport from '../components/widgets/ActivityReport';
import AITipsPanel from '../components/AITipsPanel';
import ErrorBoundary from '../components/ErrorBoundary';
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

// Mock Data
const dailySpend = 45.00;
const monthlyBudget = 1500;
const co2Saved = 120;
const treesEquivalent = 85;
const solarProduction = 8.2;
const batteryLevel = 75;
const gridConsumption = 1.5;

const energyData = [
  { time: '00:00', usage: 45 },
  { time: '06:00', usage: 30 },
  { time: '12:00', usage: 25 },
  { time: '18:00', usage: 40 }
];

function DashboardContent() {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.100');
  const headingColor = useColorModeValue('gray.800', 'white');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.800')}
      py={{ base: 4, md: 8 }}
    >
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
        <Flex justify="space-between" align="center" mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="link"
            color={subtleTextColor}
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
        </Flex>

        <Heading as="h1" size="xl" color={headingColor} mb={8}>
          Energy Dashboard
        </Heading>

        <ErrorBoundary>
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
            spacing={6}
          >
            {/* System Status Card */}
            <Card bg={cardBg} borderRadius="lg" boxShadow="md">
              <CardHeader>
                <Heading size="md" color={headingColor}>
                  <Icon as={FaSolarPanel} mr={2} color="blue.400" />
                  System Status
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Stat>
                    <StatLabel color={subtleTextColor}>Solar Production</StatLabel>
                    <StatNumber color={textColor}>{solarProduction} kW</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color={subtleTextColor}>Battery Level</StatLabel>
                    <StatNumber color={textColor}>{batteryLevel}%</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color={subtleTextColor}>Grid Consumption</StatLabel>
                    <StatNumber color={textColor}>{gridConsumption} kW</StatNumber>
                  </Stat>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Energy Usage Card */}
            <Card bg={cardBg} borderRadius="lg" boxShadow="md" gridColumn={{ base: 'auto', lg: 'span 3' }}>
              <CardHeader>
                <Heading size="md" color={headingColor}>
                  <Icon as={FaBolt} mr={2} color="yellow.400" />
                  Energy Usage Trend
                </Heading>
              </CardHeader>
              <CardBody>
                <Box h={{ base: "300px", md: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('gray.200', 'gray.600')} />
                      <XAxis dataKey="time" stroke={subtleTextColor} />
                      <YAxis stroke={subtleTextColor} />
                      <Tooltip contentStyle={{ backgroundColor: cardBg, borderColor: useColorModeValue('gray.200', 'gray.600') }} />
                      <Line type="monotone" dataKey="usage" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            {/* Environmental Impact Card */}
            <Card bg={cardBg} borderRadius="lg" boxShadow="md">
              <CardHeader>
                <Heading size="md" color={headingColor}>
                  <Icon as={FaTree} mr={2} color="teal.400" />
                  Environmental Impact
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Stat>
                    <StatLabel color={subtleTextColor}>CO₂ Saved</StatLabel>
                    <StatNumber color={textColor}>{co2Saved} kg</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color={subtleTextColor}>Trees Equivalent</StatLabel>
                    <StatNumber color={textColor}>{treesEquivalent}</StatNumber>
                  </Stat>
                </VStack>
              </CardBody>
            </Card>

            {/* Other Widgets */}
            <ErrorBoundary><EnergyModeToggle /></ErrorBoundary>
            <ErrorBoundary><BudgetDial /></ErrorBoundary>
            <ErrorBoundary><SolarOutput /></ErrorBoundary>
            <ErrorBoundary><DailyForecast /></ErrorBoundary>
            <ErrorBoundary><WidgetLayout /></ErrorBoundary>
            <ErrorBoundary><ThemeSwitcher /></ErrorBoundary>
            <ErrorBoundary><EnergyAvatar /></ErrorBoundary>
            <ErrorBoundary><ActivityReport /></ErrorBoundary>
            <ErrorBoundary><AITipsPanel /></ErrorBoundary>

            {/* Financial Overview Card - Moved to the end */}
            <Card bg={cardBg} borderRadius="lg" boxShadow="md">
              <CardHeader>
                <Heading size="md" color={headingColor}>
                  <Icon as={FaCoins} mr={2} color="green.400" />
                  Financial Overview
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={5}>
                    <Stat>
                        <StatLabel color={subtleTextColor}>Monthly Budget</StatLabel>
                        <StatNumber color={textColor}>R{monthlyBudget}</StatNumber>
                    </Stat>
                    <Box>
                        <Flex justify="space-between">
                            <Text fontSize="sm" color={subtleTextColor}>Daily Avg</Text>
                            <Text fontSize="sm" color={textColor}>R{dailySpend}</Text>
                        </Flex>
                        <Progress value={(dailySpend * 30 / monthlyBudget) * 100} size="sm" colorScheme="blue" borderRadius="full" mt={1} />
                    </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}

function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default DashboardPage;
