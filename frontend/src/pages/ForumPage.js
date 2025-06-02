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
  HStack, // Import HStack
  useColorModeValue,
  useToast,
  Spinner,
  Container,
  Avatar, // Import Avatar
  Stack, // Import Stack for general stacking
  FormControl, // Import FormControl
  FormLabel,
  Textarea, // Import Textarea
  Input, // Import Input for title
  Icon // <--- Added Icon here
} from '@chakra-ui/react';

// Import Icons
import { FaArrowLeft, FaPlus, FaCommentAlt, FaUserCircle } from 'react-icons/fa';


// Dummy data structure for topics and posts - UPDATED with South African names and avatars
const dummyTopics = [
  {
    id: 1,
    title: 'Troubleshooting Inverter Error E01',
    author: { name: 'Thabo Mokoena', avatar: 'https://ui-avatars.com/api/?name=Thabo+Mokoena&background=2C3E50&color=FFFFFF' },
    posts: 5,
    lastActivity: '2 hours ago',
    latestPostAuthor: { name: 'SupportBot', avatar: 'https://ui-avatars.com/api/?name=Support+Bot&background=16A085&color=FFFFFF' }, // Keep SupportBot or replace if needed
    comments: [
        { id: 1, author: { name: 'Thabo Mokoena', avatar: 'https://ui-avatars.com/api/?name=Thabo+Mokoena&background=2C3E50&color=FFFFFF' }, content: 'Getting Error E01 on my inverter, system offline. Anyone else seen this?', timestamp: '3 hours ago' },
        { id: 2, author: { name: 'SupportBot', avatar: 'https://ui-avatars.com/api/?name=Support+Bot&background=16A085&color=FFFFFF' }, content: 'Error E01 typically indicates a grid voltage issue. Please check your connection and ensure the grid is stable. If it persists, try a system restart or contact technical support.', timestamp: '2 hours ago' },
        { id: 3, author: { name: 'Zanele Khumalo', avatar: 'https://ui-avatars.com/api/?name=Zanele+Khumalo&background=E74C3C&color=FFFFFF' }, content: 'I had a similar error last week, a quick system restart fixed it for me.', timestamp: '1 hour ago' },
        { id: 4, author: { name: 'Thabo Mokoena', avatar: 'https://ui-avatars.com/api/?name=Thabo+Mokoena&background=2C3E50&color=FFFFFF' }, content: 'Thanks! Restarting now...', timestamp: '30 minutes ago' },
        { id: 5, author: { name: 'Thabo Mokoena', avatar: 'https://ui-avatars.com/api/?name=Thabo+Mokoena&background=2C3E50&color=FFFFFF' }, content: 'Restart worked! Thanks everyone.', timestamp: '15 minutes ago' },
    ]
  },
  {
    id: 2,
    title: 'Sharing Solar Savings Tips',
    author: { name: 'Sipho Dlamini', avatar: 'https://ui-avatars.com/api/?name=Sipho+Dlamini&background=3498DB&color=FFFFFF' },
    posts: 12,
    lastActivity: '1 day ago',
    latestPostAuthor: { name: 'Naledi Mahlangu', avatar: 'https://ui-avatars.com/api/?name=Naledi+Mahlangu&background=9B59B6&color=FFFFFF' },
     comments: [
         { id: 1, author: { name: 'Sipho Dlamini', avatar: 'https://ui-avatars.com/api/?name=Sipho+Dlamini&background=3498DB&color=FFFFFF' }, content: 'Hey everyone! Wanted to start a thread for sharing tips on maximizing solar savings. I found that running my heavy appliances during peak sun hours makes a huge difference. What are your tips?', timestamp: '1 day ago' },
         { id: 2, author: { name: 'Naledi Mahlangu', avatar: 'https://ui-avatars.com/api/?name=Naledi+Mahlangu&background=9B59B6&color=FFFFFF' }, content: 'Great idea! I try to schedule my geyser to heat up around midday using a timer. Also, switching to LED bulbs helped reduce my baseline consumption.', timestamp: '23 hours ago' },
         { id: 3, author: { name: 'Lerato Molefe', avatar: 'https://ui-avatars.com/api/?name=Lerato+Molefe&background=1ABC9C&color=FFFFFF' }, content: 'Smart plugs are a game changer for identifying energy hungry devices!', timestamp: '20 hours ago' },
     ]
  },
   {
    id: 3,
    title: 'Best Practices for Battery Maintenance',
    author: { name: 'Kagiso Ndlovu', avatar: 'https://ui-avatars.com/api/?name=Kagiso+Ndlovu&background=F1C40F&color=FFFFFF' },
    posts: 8,
    lastActivity: '3 days ago',
    latestPostAuthor: { name: 'Kagiso Ndlovu', avatar: 'https://ui-avatars.com/api/?name=Kagiso+Ndlovu&background=F1C40F&color=FFFFFF' },
     comments: [
         { id: 1, author: { name: 'Kagiso Ndlovu', avatar: 'https://ui-avatars.com/api/?name=Kagiso+Ndlovu&background=F1C40F&color=FFFFFF' }, content: 'Starting a thread on battery maintenance. Regular cleaning of terminals is crucial. Also, avoid fully draining the battery if possible to prolong its lifespan.', timestamp: '3 days ago' },
         { id: 2, author: { name: 'Sibusiso Tshabalala', avatar: 'https://ui-avatars.com/api/?name=Sibusiso+Tshabalala&background=E67E22&color=FFFFFF' }, content: 'Thanks for the tips! How often should the terminals be cleaned?', timestamp: '2 days ago' },
         { id: 3, author: { name: 'Kagiso Ndlovu', avatar: 'https://ui-avatars.com/api/?name=Kagiso+Ndlovu&background=F1C40F&color=FFFFFF' }, content: 'Depends on your environment, but checking them every 3-6 months is a good starting point.', timestamp: '2 days ago' },
     ]
  },
];

function ForumPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = auth.getCurrentUser();

  // State for selected topic view (mocking single topic view)
  const [selectedTopic, setSelectedTopic] = useState(null);
   const [newReply, setNewReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);
     const [isCreatingTopic, setIsCreatingTopic] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicContent, setNewTopicContent] = useState('');
    const [submittingTopic, setSubmittingTopic] = useState(false);
     const [submittingReply, setSubmittingReply] = useState(false);


  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonScheme = useColorModeValue('teal', 'blue');
   const replyInputBg = useColorModeValue('gray.100', 'gray.700');


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

    // Mock function to simulate fetching a topic
    const fetchTopicDetails = (topicId) => {
        // In a real app, this would be an API call to fetch a specific topic and its posts
        const topic = dummyTopics.find(t => t.id === topicId);
        setSelectedTopic(topic);
         setIsReplying(false); // Close reply form when viewing a new topic
         setIsCreatingTopic(false); // Close create topic form
    };

    // Mock function to handle submitting a new topic
    const handleCreateTopic = (e) => {
        e.preventDefault();
         if (!newTopicTitle.trim() || !newTopicContent.trim()) {
            toast({
                title: 'Error',
                description: 'Title and content cannot be empty.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
         }
         setSubmittingTopic(true);
        // Simulate API call to create topic
        setTimeout(() => {
            setSubmittingTopic(false);
            toast({
                title: 'Topic Created',
                description: 'Your new topic has been posted.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsCreatingTopic(false);
            setNewTopicTitle('');
            setNewTopicContent('');
            // In a real app, you'd refresh the topic list or navigate to the new topic
        }, 1500);
    };

    // Mock function to handle submitting a reply
    const handlePostReply = (e) => {
        e.preventDefault();
        if (!newReply.trim()) {
             toast({
                title: 'Error',
                description: 'Reply cannot be empty.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setSubmittingReply(true);
         // Simulate API call to post reply to selectedTopic.id
        setTimeout(() => {
            setSubmittingReply(false);
            toast({
                title: 'Reply Posted',
                description: 'Your reply has been added.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
             setNewReply('');
             setIsReplying(false);
            // In a real app, you'd update the selected topic's comments list
            // For mock data, we can add it to the selectedTopic state
             if (selectedTopic) {
                 // Use logged-in user's name and a generated avatar based on their name
                 const currentUserAvatar = user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=FFFFFF` : 'https://bit.ly/broken-link';

                 setSelectedTopic({
                     ...selectedTopic,
                     comments: [...selectedTopic.comments, {
                         id: selectedTopic.comments.length + 1, // Simple mock ID
                         author: { name: user?.name || 'Anonymous', avatar: currentUserAvatar }, // Use logged-in user or default
                         content: newReply,
                         timestamp: 'Just now' // Mock timestamp
                     }],
                     posts: selectedTopic.posts + 1 // Increment post count
                 });
             }

        }, 1500);
    };


  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
         {/* Header with Back to Home button */}
        <Flex justify="space-between" align="center" mb={8}>
           <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            onClick={() => {
                 if (selectedTopic) {
                    setSelectedTopic(null); // Go back to topic list if viewing a topic
                 } else {
                    navigate('/home'); // Go back to home if on topic list
                 }
            }}
          >
            {selectedTopic ? 'Back to Topics' : 'Back to Home'}
          </Button>
           {!selectedTopic && !isCreatingTopic && ( // Show New Topic button only on topic list view
             <Button leftIcon={<FaPlus />} colorScheme={buttonScheme} size="sm" onClick={() => setIsCreatingTopic(true)}>
                New Topic
             </Button>
           )}
             {isCreatingTopic && ( // Show Cancel button when creating topic
                <Button variant="outline" size="sm" onClick={() => setIsCreatingTopic(false)}>
                    Cancel
                </Button>
             )}
        </Flex>

        <Heading as="h1" size="xl" color={headingColor} mb={6}>
          {selectedTopic ? selectedTopic.title : 'Community Forum'}
        </Heading>

        {/* Create New Topic Form */}
        {isCreatingTopic && (
             <Box
                p={6}
                bg={cardBg}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={cardBorderColor}
                mb={8}
             >
                 <Heading as="h2" size="lg" mb={4} color={headingColor}>Create New Topic</Heading>
                 <VStack as="form" spacing={4} onSubmit={handleCreateTopic}>
                     <FormControl id="topic-title" isRequired>
                         <FormLabel color={textColor}>Topic Title</FormLabel>
                         <Input
                             type="text"
                             value={newTopicTitle}
                             onChange={(e) => setNewTopicTitle(e.target.value)}
                         />
                     </FormControl>
                      <FormControl id="topic-content" isRequired>
                         <FormLabel color={textColor}>Content</FormLabel>
                         <Textarea
                             value={newTopicContent}
                             onChange={(e) => setNewTopicContent(e.target.value)}
                             rows={6}
                         />
                     </FormControl>
                      <Button
                        type="submit"
                        colorScheme={buttonScheme}
                        isLoading={submittingTopic}
                        loadingText="Creating..."
                        w="full"
                        mt={4}
                      >
                         Post Topic
                      </Button>
                 </VStack>
             </Box>
        )}


        {/* Topic List View */}
        {!selectedTopic && !isCreatingTopic && (
            <VStack spacing={4} align="stretch">
              {dummyTopics.map((topic) => (
                <Box
                  key={topic.id}
                  p={4}
                  bg={cardBg}
                  borderRadius="md"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={cardBorderColor}
                   _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                        cursor: 'pointer'
                    }}
                    onClick={() => fetchTopicDetails(topic.id)} // Mock navigation to topic view
                >
                    <VStack align="stretch" spacing={2}>
                        <Heading as="h3" size="md" color={headingColor}>
                            {topic.title}
                        </Heading>
                         <HStack spacing={4} fontSize="sm" color={textColor}>
                             <HStack>
                                <Avatar size="xs" name={topic.author.name} src={topic.author.avatar} />
                                <Text fontWeight="semibold">{topic.author.name}</Text>
                             </HStack>
                             <HStack>
                                 <Icon as={FaCommentAlt} />
                                <Text>{topic.posts} Posts</Text>
                             </HStack>
                             <Text>Last activity: {topic.lastActivity}</Text>
                         </HStack>
                    </VStack>
                </Box>
              ))}
               {dummyTopics.length === 0 && (
                    <Text textAlign="center" mt={8} color={textColor}>No topics yet. Be the first to post!</Text>
                )}
            </VStack>
        )}

        {/* Individual Topic View (Mock) */}
        {selectedTopic && (
             <VStack spacing={6} align="stretch">
                {/* Display the initial post content here if available in dummy data */}
                {/* Map and display comments */}
                {selectedTopic.comments && selectedTopic.comments.map(post => (
                     <Box
                         key={post.id}
                         p={4}
                         bg={cardBg}
                         borderRadius="md"
                         boxShadow="sm"
                         borderWidth="1px"
                         borderColor={cardBorderColor}
                     >
                         <HStack align="flex-start" spacing={3}>
                             {/* Apply size and border radius to Avatar */}
                             <Avatar size="sm" name={post.author.name} src={post.author.avatar} borderRadius="full" />
                             <VStack align="stretch" spacing={1} flex="1">
                                 <Text fontWeight="semibold" color={headingColor}>{post.author.name}</Text>
                                 <Text fontSize="sm" color={textColor}>{post.timestamp}</Text>
                                 <Box mt={2} color={textColor}>
                                     {post.content}
                                 </Box>
                             </VStack>
                         </HStack>
                     </Box>
                ))}
                {selectedTopic.comments.length === 0 && (
                     <Text textAlign="center" mt={4} color={textColor}>No comments yet. Be the first to reply!</Text>
                )}


                {/* Reply Form */}
                 {!isReplying && (
                     <Flex justify="flex-end" mt={4}>
                          <Button colorScheme={buttonScheme} size="sm" onClick={() => setIsReplying(true)}>
                             Reply
                          </Button>
                     </Flex>
                 )}

                 {isReplying && (
                    <Box
                        p={4}
                        bg={cardBg}
                        borderRadius="md"
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor={cardBorderColor}
                        mt={4}
                    >
                        <Heading as="h3" size="md" mb={4} color={headingColor}>Post a Reply</Heading>
                        <FormControl id="reply-content" isRequired>
                            <Textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Write your reply here..."
                                rows={4}
                                bg={replyInputBg}
                                borderColor={cardBorderColor}
                                _hover={{ borderColor: buttonScheme === 'teal' ? 'teal.500' : 'blue.500' }}
                                _focus={{ borderColor: buttonScheme === 'teal' ? 'teal.500' : 'blue.500', boxShadow: `0 0 0 1px ${buttonScheme === 'teal' ? 'teal.500' : 'blue.500'}` }}
                            />
                        </FormControl>
                        <HStack mt={4} justify="flex-end">
                            <Button variant="outline" onClick={() => setIsReplying(false)} size="sm">
                                Cancel
                            </Button>
                             <Button
                                colorScheme={buttonScheme}
                                onClick={handlePostReply}
                                isLoading={submittingReply}
                                loadingText="Posting..."
                                size="sm"
                             >
                                Post Reply
                             </Button>
                        </HStack>
                    </Box>
                 )}


             </VStack>
        )}


      </Container>
    </Box>
  );
}

export default ForumPage;
