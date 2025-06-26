/* eslint-disable react/jsx-no-undef */
import React from 'react';
import {
  Box,
  SimpleGrid,
  Button,
  Flex,
  Heading,
  Text,
  ColorModeScript,
  useColorMode
} from '@chakra-ui/react';
import { FaBolt, FaHome, FaTachometerAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import EnergyModeToggle from '../components/widgets/EnergyModeToggle';
import BudgetDial from '../components/widgets/BudgetDial';
import DailyForecast from '../components/widgets/DailyForecast';
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

// Keep only one declaration at the top with other mock values

function DashboardContent() {
  const navigate = useNavigate();
  const { setEnabledWidgets, enabledWidgets } = useDashboard();
  const { colorMode, toggleColorMode } = useColorMode();

  // Update theme variables to be dynamic based on color mode
  const backgroundColor = colorMode === 'light' ? '#ffffff' : '#1e1e2f';  // Light: white, Dark: dark background
  const cardBg = colorMode === 'light' ? '#ffffff' : '#2b2b3d';  // Light: white, Dark: dark card
  const textColor = colorMode === 'light' ? '#000000' : '#ffffff';  // Light: black, Dark: white
  const accentColor = 'teal.300';  // Keep accent as is

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
      bg={backgroundColor}
      color={textColor}
      overflowY="auto"
      px={{ base: 4, md: 8 }}
      py={6}
    >
      <Flex direction="row" w="full" maxW="1400px" mx="auto">
        {/* Vertical Sidebar with theme-aware styles */}
        <Box
          as="nav"
          w={{ base: '60px', md: '200px' }}
          bg={backgroundColor}  // Use dynamic background color
          color={textColor}  // Use dynamic text color
          h="100vh"
          position="fixed"
          left={0}
          p={4}
          borderRightWidth="1px"
          borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}  // Dynamic border color based on mode
        >
          <Flex direction="column" align="center" gap={6}>
            <Text fontSize="lg" fontWeight="bold">Menu</Text>
            <Button variant="ghost" onClick={() => navigate('/home')} leftIcon={<FaHome />} />
            <Button variant="ghost" onClick={() => navigate('/dashboard')} leftIcon={<FaTachometerAlt />} />
            <Button variant="ghost" onClick={() => navigate('/settings')} leftIcon={<FaCog />} />
            <Button variant="ghost" onClick={() => navigate('/logout')} leftIcon={<FaSignOutAlt />} />
          </Flex>
        </Box>

        {/* Main Content with Padding for Sidebar */}
        <Box ml={{ base: 0, md: '200px' }} w="full" px={8} py={6}>
          {/* Theme toggle button at the top */}
          <Flex justify="flex-end" mb={6}>
            <Button onClick={toggleColorMode} bg="teal.500" color="white" _hover={{ bg: "teal.600" }}>
              Toggle Mode
            </Button>
          </Flex>

          <Heading as="h1" size="xl" color={accentColor} mb={8}>
            Energy Dashboard
          </Heading>

          {/* Widget Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={6}
            mb={8}
          >
            {enabledWidgets.includes('EnergyModeToggle') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <EnergyModeToggle />
                </motion.div>
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('DailyForecast') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <DailyForecast />
                </motion.div>
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('EnergyAvatar') && (  // Assuming EnergyAvatar is Energy Status
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <EnergyAvatar />
                </motion.div>
              </ErrorBoundary>
            )}

            {enabledWidgets.includes('BudgetDial') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <BudgetDial />
                </motion.div>
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('SolarOutput') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <SolarOutput />
                </motion.div>
              </ErrorBoundary>
            )}

            {enabledWidgets.includes('AITipsPanel') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <AITipsPanel />
                </motion.div>
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('ActivityReport') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <ActivityReport />
                </motion.div>
              </ErrorBoundary>
            )}
            {enabledWidgets.includes('WidgetLayout') && (
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  as={Box}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                >
                  <WidgetLayout />
                </motion.div>
              </ErrorBoundary>
            )}
          </SimpleGrid>

          {/* Full-width Energy Usage Chart */}
          <Box w="full" mt={8} bg={cardBg} p={6} borderRadius="2xl" boxShadow="md" _hover={{ boxShadow: "lg" }}>
            <ErrorBoundary>
              <DashboardCard title="Energy Usage" icon={FaBolt}>
                <Box h="400px" w="100%">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
                      <XAxis dataKey="time" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Tooltip />
                      <Line type="monotone" dataKey="usage" stroke={accentColor} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </DashboardCard>
            </ErrorBoundary>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

function DashboardPage() {
  return (
    <DashboardProvider>
      <ColorModeScript initialColorMode="dark" />
      <DashboardContent />
    </DashboardProvider>
  );
}

export default DashboardPage;
