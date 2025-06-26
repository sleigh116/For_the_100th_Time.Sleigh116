import React from 'react';
import {
  Box,
  SimpleGrid,
  Button,
  Flex,
  Heading,
  Text,
  Progress,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { FaArrowLeft, FaSolarPanel, FaCoins, FaTree, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
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
import DashboardCard from '../components/DashboardCard';
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

// Comment out or remove these lines:
// import StatusIndicator from '../components/widgets/StatusIndicator';
// import FinancialMetric from '../components/widgets/FinancialMetric';
// import ImpactMetrics from '../components/widgets/ImpactMetrics';

// Add missing variable declarations at the top
const dailySpend = 45.00;
const monthlyBudget = 1500;
const co2Saved = 120;
const treesEquivalent = 85;

// Keep only one declaration at the top with other mock values
const solarProduction = 8.2;  // kW
const batteryLevel = 75;      // %
const gridConsumption = 1.5;  // kW

function DashboardContent() {
  const navigate = useNavigate();
  const { headingColor, currentThemeConfig, setEnabledWidgets, enabledWidgets } = useDashboard();

  // Color mode values correctly inside component
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  // Updated energyData to end at 17:00
  const energyData = [
    { time: '00:00', usage: 45 },
    { time: '01:00', usage: 42 },
    { time: '02:00', usage: 40 },
    { time: '03:00', usage: 38 },
    { time: '04:00', usage: 35 },
    { time: '05:00', usage: 32 },
    { time: '06:00', usage: 30 },
    { time: '07:00', usage: 28 },
    { time: '08:00', usage: 25 },
    { time: '09:00', usage: 22 },
    { time: '10:00', usage: 20 },
    { time: '11:00', usage: 18 },
    { time: '12:00', usage: 15 },
    { time: '13:00', usage: 14 },
    { time: '14:00', usage: 16 },
    { time: '15:00', usage: 18 },
    { time: '16:00', usage: 20 },
    { time: '17:00', usage: 22 },
  ];

  // Default enabled widgets (can be toggled via user interaction)
  if (!enabledWidgets || enabledWidgets.length === 0) {
    setEnabledWidgets(['EnergyModeToggle', 'BudgetDial', 'ThemeSwitcher', 'SolarOutput', 'DailyForecast', 'WidgetLayout', 'EnergyAvatar', 'ActivityReport', 'AITipsPanel']);  // Initialize if needed
  }

  return (
    <Box
      minH="100vh"
      backgroundImage={currentThemeConfig.gradients.main}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment="fixed"
      position="relative"
    >
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
        <Flex justify="flex-end" align="center" mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            color={textColor}
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
        </Flex>

        <Heading as="h1" size="xl" color={headingColor} mb={8}>
          Energy Dashboard
        </Heading>

        {/* Moved cards to the top */}
        <Box mb={8}>
          <ErrorBoundary>
            <DashboardCard
              title="Financial Overview"
              icon={FaCoins}
              colSpan={1}
            >
              <Box p={4} bg={cardBg} borderRadius="md">
                <Text fontWeight="bold" color={textColor}>Monthly Budget</Text>
                <Text fontSize="2xl" color={textColor}>R{monthlyBudget}</Text>
                <Progress value={(dailySpend * 30 / monthlyBudget) * 100} size="sm" colorScheme="teal" />
                <Text fontSize="sm" color={textColor} opacity={0.7}>Daily Average: R{dailySpend}</Text>
                <Badge colorScheme="teal" mt={2}>Budget Status</Badge>
              </Box>
            </DashboardCard>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <DashboardCard
              title="Environmental Impact"
              icon={FaTree}
              colSpan={1}
            >
              <Box p={4} bg={cardBg} borderRadius="md">
                <Text fontWeight="bold" color={textColor}>Environmental Impact</Text>
                <Text fontSize="2xl" color={textColor}>CO₂ Saved: {co2Saved}kg</Text>
                <Text fontSize="sm" color={textColor} opacity={0.7}>Trees Equivalent: {treesEquivalent}</Text>
                <Badge colorScheme="teal" mt={2}>Impact Status</Badge>
              </Box>
            </DashboardCard>
          </ErrorBoundary>
        </Box>

        {/* Dashboard Grid with conditional widget rendering */}
        <ErrorBoundary>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4} autoRows="minmax(200px, auto)">
            {/* System Status Card - Always render or add to enabled list if needed */}
            <ErrorBoundary>
              <DashboardCard
                title="System Status"
                icon={FaSolarPanel}
                colSpan={1}
              >
                <Box p={4} bg={cardBg} borderRadius="md">
                  <Text fontWeight="bold" color={textColor}>System Status</Text>
                  <Text color={textColor}>Solar: {solarProduction}kW</Text>
                  <Text color={textColor}>Battery: {batteryLevel}%</Text>
                  <Text color={textColor}>Grid: {gridConsumption}kW</Text>
                  <Badge colorScheme="teal" mt={2}>System Health</Badge>
                </Box>
              </DashboardCard>
            </ErrorBoundary>
            
            {enabledWidgets.includes('EnergyModeToggle') && (
              <ErrorBoundary>
                <EnergyModeToggle />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('BudgetDial') && (
              <ErrorBoundary>
                <BudgetDial />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('ThemeSwitcher') && (
              <ErrorBoundary>
                <ThemeSwitcher />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('SolarOutput') && (
              <ErrorBoundary>
                <SolarOutput />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('DailyForecast') && (
              <ErrorBoundary>
                <DailyForecast />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('WidgetLayout') && (
              <ErrorBoundary>
                <WidgetLayout />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('EnergyAvatar') && (
              <ErrorBoundary>
                <EnergyAvatar />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('ActivityReport') && (
              <ErrorBoundary>
                <ActivityReport />
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('AITipsPanel') && (
              <ErrorBoundary>
                <AITipsPanel />
              </ErrorBoundary>
            )}
          </SimpleGrid>
        </ErrorBoundary>

        {/* Energy Usage Card at the bottom */}
        <Box mt={8}>
          <ErrorBoundary>
            <DashboardCard
              title="Energy Usage"
              icon={FaBolt}
              colSpan={1}
            >
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </DashboardCard>
          </ErrorBoundary>
        </Box>
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
