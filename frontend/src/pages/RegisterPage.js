import React, { useState } from 'react';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';
import { auth } from '../services/api'; // Assuming auth service is still used
import gridXBackground from '../assets/images/GridX-IMG.jpg';

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
  Link as ChakraLink, // Alias Link from Chakra UI to avoid conflict with react-router-dom
  VStack,
  useToast, // For displaying messages
  useColorModeValue, // For light/dark mode styling
  FormErrorMessage, // For displaying validation errors
} from '@chakra-ui/react';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast for Chakra UI notifications

  // Function to validate form inputs
  const validateForm = () => {
      const newErrors = {};
      if (!name.trim()) newErrors.name = 'Full Name is required';
      if (!email.trim()) {
          newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
          newErrors.email = 'Email address is invalid';
      }
      if (!password) {
          newErrors.password = 'Password is required';
      } else if (password.length < 6) {
           newErrors.password = 'Password must be at least 6 characters long';
      }
      if (!confirmPassword) {
          newErrors.confirmPassword = 'Confirm Password is required';
      } else if (password !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await auth.register(name, email, password); // Call backend API
      if (response.success) {
        toast({ // Show success message using Chakra toast
            title: 'Registration Successful!',
            description: 'You can now log in.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
        navigate('/login'); // Redirect to login page
      } else {
         toast({ // Show error message from backend
            title: 'Registration Failed.',
            description: response.message || 'An unexpected error occurred.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
      }
    } catch (error) {
        console.error('Registration error:', error);
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
   const formBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
   const textColor = useColorModeValue('white', 'white');


  return (
    // Use Flex for centering the form vertically and horizontally
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      p={4}
      position="relative"
      backgroundImage={`url(${gridXBackground})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment="fixed"
    >
      {/* Add overlay for better readability */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1"
      />

      {/* Form container with updated styling */}
      <Box
        maxW="md"
        w="full"
        bg={formBg}
        boxShadow="xl"
        borderRadius="lg"
        p={8}
        textAlign="center"
        position="relative"
        zIndex="2"
        backdropFilter="blur(10px)"
      >
        <Heading as="h2" size="xl" mb={6} color={textColor}>
          Register
        </Heading>
        {/* VStack for vertical stacking of form controls */}
        <VStack as="form" spacing={4} onSubmit={handleSubmit} noValidate>
          {/* Form Control for Full Name */}
          <FormControl id="name" isInvalid={!!errors.name}>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
             {/* Display error message if validation fails */}
             <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          {/* Form Control for Email */}
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
             <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          {/* Form Control for Password */}
          <FormControl id="password" isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          {/* Form Control for Confirm Password */}
          <FormControl id="confirm-password" isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
             <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="teal" // Use teal color scheme
            size="lg" // Large button size
            fontSize="md" // Medium font size
            isLoading={loading} // Show loading spinner when submitting
            loadingText="Registering..."
            w="full" // Button takes full width
            mt={4} // Margin top
          >
            Register
          </Button>
        </VStack>

        {/* Link to Login page */}
        <Text mt={6} color={textColor}>
          Already have an account?{' '}
           {/* Use ChakraLink as ReactRouterLink for navigation */}
          <ChakraLink as={ReactRouterLink} to="/login" color="blue.400">
            Login here
          </ChakraLink>
        </Text>
      </Box>
    </Flex>
  );
}

export default RegisterPage; // Export the component 