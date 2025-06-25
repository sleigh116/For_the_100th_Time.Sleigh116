import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api'; // Assuming auth service is still used

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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Link as ChakraLink,
  Icon,
  HStack
} from '@chakra-ui/react';

// Import Icons (for navigation and contact info)
import { FaArrowLeft, FaPhone, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';


function SupportPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = auth.getCurrentUser();

  // State for contact form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const linkColor = useColorModeValue('blue.500', 'blue.300');
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');


  // Dummy FAQ data
  const faqItems = [
    {
      question: 'How do I top up my solar energy credit?',
      answer: 'You can top up your energy credit on the Top-Up page. Select your preferred amount or enter a voucher code and follow the payment instructions.'
    },
    {
      question: 'How can I track my energy usage?',
      answer: 'Your energy usage and analytics can be viewed on the Dashboard page, which provides daily, weekly, and monthly summaries.'
    },
    {
      question: 'What should I do if my solar system is not generating power?',
      answer: 'First, check the System Status page for any alerts. If the issue persists, please contact our support team using the form below or the contact details provided.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'You can update your personal details, such as phone number and address, on the Profile page.'
    }
  ];

  // Update the useEffect for authentication
  useEffect(() => {
    if (!user) {
      navigate('/');  // Changed from '/login' to '/' to go back to landing page
      toast({
        title: 'Authentication required',
        description: 'Please log in to access this page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user, navigate, toast]);

  // Update the back button handler
  const handleBackClick = () => {
    if (!user) {
      navigate('/');  // Go to landing page if not logged in
    } else {
      navigate('/home');  // Go to home page if logged in
    }
  };

  // Handle Contact Form Submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      toast({
        title: 'Message Sent',
        description: 'Your support request has been received. We will contact you shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2000); // Simulate a 2-second delay for submission
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
      <Container maxW="container.xl" py={8} position="relative" zIndex={2}>
         {/* Header with Back to Home button */}
        <HStack justify="space-between" align="center" mb={8}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={handleBackClick}
            color={headingColor}
          >
            Back to Home
          </Button>
        </HStack>

        <Heading as="h1" size="xl" color={headingColor} mb={6}>
          Support and Help Center
        </Heading>

        {/* FAQ Section */}
        <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
            mb={8}
        >
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
                Frequently Asked Questions
            </Heading>
             <Accordion allowMultiple>
                {faqItems.map((item, index) => (
                <AccordionItem key={index}>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left" fontWeight="semibold" color={textColor}>
                                {item.question}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} color={textColor}>
                        {item.answer}
                    </AccordionPanel>
                </AccordionItem>
                ))}
            </Accordion>
        </Box>

        {/* Contact Form Section */}
        <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
            mb={8}
        >
             <Heading as="h2" size="lg" mb={4} color={headingColor}>
                Contact Support
            </Heading>
            <Text color={textColor} mb={4}>
                Couldn't find your answer? Send us a message.
            </Text>
            <VStack as="form" spacing={4} onSubmit={handleContactSubmit}>
                <FormControl id="contact-name" isRequired>
                    <FormLabel color={textColor}>Your Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        borderColor={inputBorderColor}
                        _hover={{ borderColor: 'teal.500' }}
                        _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
                    />
                </FormControl>
                 <FormControl id="contact-email" isRequired>
                    <FormLabel color={textColor}>Email Address</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        borderColor={inputBorderColor}
                        _hover={{ borderColor: 'teal.500' }}
                        _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
                    />
                </FormControl>
                <FormControl id="contact-subject">
                    <FormLabel color={textColor}>Subject</FormLabel>
                    <Input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                         borderColor={inputBorderColor}
                        _hover={{ borderColor: 'teal.500' }}
                        _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
                    />
                </FormControl>
                <FormControl id="contact-message" isRequired>
                    <FormLabel color={textColor}>Message</FormLabel>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                         borderColor={inputBorderColor}
                        _hover={{ borderColor: 'teal.500' }}
                        _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
                    />
                </FormControl>
                <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    fontSize="md"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    w="full"
                    mt={4}
                >
                    Send Message
                </Button>
            </VStack>
        </Box>

        {/* Additional Resources Section */}
         <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
            mb={8}
        >
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
                Additional Resources
            </Heading>
            <VStack spacing={3} align="flex-start">
                <ChakraLink href="#" isExternal color={linkColor} fontWeight="semibold">
                     <HStack> {/* Use HStack to align icon and text */}
                        <Icon as={FaExternalLinkAlt} />
                        <Text>Link to Documentation</Text>
                     </HStack>
                </ChakraLink>
                <ChakraLink href="#" isExternal color={linkColor} fontWeight="semibold">
                     <HStack> {/* Use HStack to align icon and text */}
                        <Icon as={FaExternalLinkAlt} />
                        <Text>Visit our Blog</Text>
                     </HStack>
                </ChakraLink>
            </VStack>
         </Box>


         {/* Contact Information Section */}
        <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
        >
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
                Contact Information
            </Heading>
            <VStack spacing={3} align="flex-start" color={textColor}>
                <HStack>
                    <Icon as={FaPhone} color="teal.500" />
                    <Text fontWeight="semibold">Phone:</Text>
                    <Text>+27 12 345 6789</Text>
                </HStack>
                 <HStack>
                    <Icon as={FaEnvelope} color="teal.500" />
                    <Text fontWeight="semibold">Email:</Text>
                     {/* Use ChakraLink for email link */}
                    <ChakraLink href="mailto:support@solarfinech.com" color={linkColor}>support@solarfinech.com</ChakraLink>
                </HStack>
                 {/* Add Address if needed */}
                 {/*
                 <HStack>
                    <Icon as={FaMapMarkerAlt} color="teal.500" />
                    <Text fontWeight="semibold">Address:</Text>
                    <Text>123 Solar Lane, Sun City, 1234</Text>
                 </HStack>
                 */}
            </VStack>
        </Box>


      </Container>
    </Box>
  );
}

export default SupportPage;
