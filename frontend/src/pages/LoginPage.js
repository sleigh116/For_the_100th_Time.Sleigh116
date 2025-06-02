import React, { useState } from 'react';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';
import { auth } from '../services/api'; // Assuming auth service is still used

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink, // Alias Link from Chakra UI
  VStack,
  useToast, // For displaying messages
  useColorModeValue, // For light/dark mode styling
   FormErrorMessage, // For displaying validation errors
} from '@chakra-ui/react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast

  // Function to validate form inputs
  const validateForm = () => {
      const newErrors = {};
      if (!email.trim()) {
          newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
          newErrors.email = 'Email address is invalid';
      }
      if (!password) {
          newErrors.password = 'Password is required';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission

     if (!validateForm()) {
        return; // Stop submission if validation fails
    }

    setLoading(true); // Set loading state
    setErrors({}); // Clear previous errors

    try {
      const response = await auth.login(email, password); // Call backend API
      if (response.success) {
        // auth.login should handle storing token and user in localStorage
        toast({ // Show success message
            title: 'Login Successful!',
            description: 'Redirecting to home...',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate('/home'); // Changed back to '/home'
      } else {
        toast({ // Show error message from backend
            title: 'Login Failed.',
            description: response.message || 'Invalid email or password.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
      }
    } catch (error) {
        console.error('Login error:', error);
         toast({ // Handle network errors or other exceptions
            title: 'An error occurred.',
            description: error.message || 'Could not connect to the server.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

   // Chakra UI hook for dynamic colors based on color mode
   const bgColor = useColorModeValue('gray.50', 'gray.800');
   const formBg = useColorModeValue('white', 'gray.700');
   const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
     // Use Flex for centering the form vertically and horizontally
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} p={4}>
      {/* Box to contain the form with styling */}
      <Box
        maxW="md" // Max width for the form container
        w="full" // Take full width up to maxW
        bg={formBg} // Background color
        boxShadow="md" // Shadow effect
        borderRadius="lg" // Rounded corners
        p={6} // Padding
        textAlign="center" // Center text inside the box
      >
        <Heading as="h2" size="xl" mb={6} color={textColor}>
          Login
        </Heading>
         {/* VStack for vertical stacking of form controls */}
        <VStack as="form" spacing={4} onSubmit={handleSubmit} noValidate>
          {/* Form Control for Email */}
          <FormControl id="login-email" isInvalid={!!errors.email}> {/* Use a unique ID */}
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
             {/* Display error message if validation fails */}
             <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          {/* Form Control for Password */}
          <FormControl id="login-password" isInvalid={!!errors.password}> {/* Use a unique ID */}
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue" // Use blue color scheme
            size="lg" // Large button size
            fontSize="md" // Medium font size
            isLoading={loading} // Show loading spinner when submitting
            loadingText="Logging in..."
            w="full" // Button takes full width
            mt={4} // Margin top
          >
            Login
          </Button>
        </VStack>

        {/* Link to Register page */}
        <Text mt={6} color={textColor}>
          Don't have an account?{' '}
           {/* Use ChakraLink as ReactRouterLink for navigation */}
          <ChakraLink as={ReactRouterLink} to="/register" color="blue.500">
            Register here
          </ChakraLink>
        </Text>
      </Box>
    </Flex>
  );
}

export default LoginPage; // Export the component
