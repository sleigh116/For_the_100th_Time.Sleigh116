import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Textarea,
  Heading
} from '@chakra-ui/react';
import { FaPaperPlane, FaTimes, FaCommentDots, FaMinus } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

// Keyframes for simple animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const keywordResponses = {
  'top-up': "To top-up your solar credits, click the 'Top-Up' button on the Home Page and follow the instructions.",
  'recharge': "To top-up your solar credits, click the 'Top-Up' button on the Home Page and follow the instructions.",
  'edit profile': "To update your personal info, click on 'Profile' at the top of your dashboard.",
  'forgot password': "You can reset your password from the Login page by clicking on 'Forgot Password'.",
  'impact': "Our Impact page shows how our service has helped communities. You can view it from the Home Page.",
  'balance': "Your balance is shown at the top of the dashboard or inside the Top-Up page.",
  'navigation': "You can navigate to different sections using the buttons on the Home Page after logging in.",
  'login': "If you need help logging in, ensure you have registered and are using the correct credentials.",
  'register': "To register, use the signup form on the landing page (/). Fill in all required details."
};

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const chatBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const userMessageBg = useColorModeValue('blue.100', 'blue.700');
  const botMessageBg = useColorModeValue('gray.100', 'gray.700');
  const userTextColor = useColorModeValue('gray.800', 'white');
  const botTextColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const scrollbarThumbBg = useColorModeValue('gray.300', 'gray.600');
  const scrollbarThumbHoverBg = useColorModeValue('gray.400', 'gray.500');

  useEffect(() => {
    const savedMessages = localStorage.getItem('supportChatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('supportChatHistory', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
      setIsMinimized(!isMinimized);
  };


  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage = { text: inputMessage, sender: 'user' };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage('');

    setTimeout(() => {
      processUserMessage(inputMessage.toLowerCase(), updatedMessages);
    }, 500);
  };

  const processUserMessage = (messageText, currentMessages) => {
    let botResponse = "I'm not sure how to help with that. Can you please rephrase your question or try a different keyword?";

    for (const keyword in keywordResponses) {
      if (messageText.includes(keyword)) {
        botResponse = keywordResponses[keyword];
        break;
      }
    }

    setMessages([...currentMessages, { text: botResponse, sender: 'bot' }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex="1000">
        {!isOpen && (
            <IconButton
                aria-label="Open support chat"
                icon={<FaCommentDots />}
                size="lg"
                colorScheme="teal"
                isRound
                boxShadow="lg"
                onClick={toggleChat}
            />
        )}

      {isOpen && (
          <Box
            w={{ base: '90vw', sm: '300px', md: '350px' }}
            h={isMinimized ? '0' : { base: '70vh', sm: '400px', md: '450px' }}
            bg={chatBg}
            borderRadius="lg"
            boxShadow="xl"
            borderWidth="1px"
            borderColor={borderColor}
            flexDirection="column"
            overflow="hidden"
            display={isMinimized ? 'none' : 'flex'}
            animation={`${fadeIn} 0.3s ease-out`}
          >
            <Flex
              bg="teal.500"
              color="white"
              p={3}
              borderTopRadius="lg"
              justify="space-between"
              align="center"
            >
              <Heading size="sm">Support Bot</Heading>
               <HStack spacing={1}>
                    <IconButton
                        aria-label="Minimize chat"
                        icon={<FaMinus />}
                        size="xs"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: 'teal.600' }}
                        onClick={toggleMinimize}
                    />
                    <IconButton
                        aria-label="Close chat"
                        icon={<FaTimes />}
                        size="xs"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: 'teal.600' }}
                        onClick={toggleChat}
                    />
               </HStack>
            </Flex>

            <VStack
              flex="1"
              p={3}
              spacing={3}
              align="stretch"
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '3px' },
                '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg }
              }}
            >
              {messages.map((message, index) => (
                <Flex
                  key={index}
                  justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  animation={`${fadeIn} 0.2s ease-out`}
                >
                  <Box
                    bg={message.sender === 'user' ? userMessageBg : botMessageBg}
                    color={message.sender === 'user' ? userTextColor : botTextColor}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    maxW="80%"
                  >
                    <Text>{message.text}</Text>
                  </Box>
                </Flex>
              ))}
               <div ref={messagesEndRef} />
            </VStack>

            <Flex p={3} borderTop="1px solid" borderColor={borderColor}>
              <Textarea
                flex="1"
                size="sm"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                resize="none"
                rows={1}
                maxRows={4}
                 bg={inputBg}
                 borderColor={borderColor}
                 _hover={{ borderColor: 'teal.500' }}
                 _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
              />
              <IconButton
                ml={2}
                aria-label="Send message"
                icon={<FaPaperPlane />}
                colorScheme="teal"
                onClick={handleSendMessage}
                size="sm"
              />
            </Flex>
          </Box>
      )}

       {!isOpen && isMinimized && (
             <IconButton
                aria-label="Maximize support chat"
                icon={<FaCommentDots />}
                size="lg"
                colorScheme="teal"
                isRound
                boxShadow="lg"
                onClick={toggleChat}
            />
        )}
         {isOpen && isMinimized && (
             <IconButton
                aria-label="Close support chat"
                icon={<FaTimes />}
                size="sm"
                colorScheme="red"
                isRound
                boxShadow="lg"
                onClick={toggleChat}
            />
         )}

    </Box>
  );
};

export default SupportBot;