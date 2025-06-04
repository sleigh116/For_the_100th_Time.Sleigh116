import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
  useToast,
  Spinner,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack
} from '@chakra-ui/react';

// Import Icons
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

function ExpensesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = auth.getCurrentUser();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const tableColor = useColorModeValue('gray.800', 'white');
  const tableHeaderColor = useColorModeValue('gray.600', 'gray.300');

  // Dummy expense data
  const dummyExpenses = [
    { id: 1, date: '2023-10-26', amount: 150.00, purpose: 'October Energy Bill' },
    { id: 2, date: '2023-11-15', amount: 220.50, purpose: 'November Energy Bill' },
    { id: 3, date: '2023-12-05', amount: 180.75, purpose: 'December Energy Bill' },
  ];

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

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <Spinner size="xl" color="blue.500" />
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
      <Container maxW="container.xl" py={8} position="relative" zIndex={2}>
        {/* Header with Back to Home button */}
        <Flex justify="space-between" align="center" mb={8}>
           <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
           {/* Optional Add Expense Button */}
          <Button leftIcon={<FaPlus />} colorScheme="teal" size="sm">
            Add Expense
          </Button>
        </Flex>

        <Heading as="h1" size="xl" color={headingColor} mb={6}>
          Your Energy Expenses
        </Heading>

        <TableContainer>
          <Table variant="simple" colorScheme="teal">
            <Thead>
              <Tr>
                <Th color={tableHeaderColor}>Date</Th>
                <Th color={tableHeaderColor} isNumeric>Amount (ZAR)</Th>
                <Th color={tableHeaderColor}>Purpose</Th>
              </Tr>
            </Thead>
            <Tbody color={tableColor}>
              {dummyExpenses.map((expense) => (
                <Tr key={expense.id}>
                  <Td>{expense.date}</Td>
                  <Td isNumeric>{expense.amount.toFixed(2)}</Td>
                  <Td>{expense.purpose}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {dummyExpenses.length === 0 && (
            <Text textAlign="center" mt={8} color={textColor}>No expenses recorded yet.</Text>
        )}

      </Container>
    </Box>
  );
}

export default ExpensesPage;
