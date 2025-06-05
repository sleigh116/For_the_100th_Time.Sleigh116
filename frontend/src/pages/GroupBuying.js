import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Progress,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  useColorModeValue,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Image,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaUsers, FaClock, FaTag, FaSolarPanel, FaBolt, FaBatteryFull, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import batteryBankImage from '../assets/images/battery_bank_10_kwh.png';
import inverterImage from '../assets/images/inverter__5kw_hybrid.png';
import solarPanelImage from '../assets/images/solar_panel_350w.png';

function GroupBuying() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Mock data for solar gear campaigns - No placeholder images
  const [ongoingCampaigns, setOngoingCampaigns] = useState(useMemo(() => [
    {
      id: 1,
      product: 'Solar Panel (350W)',
      image: solarPanelImage,
      originalPrice: 2000,
      groupPrice: 1500,
      goal: 20,
      participants: 12,
      deadline: '2024-04-30',
      description: 'High-efficiency monocrystalline solar panels perfect for residential installations.',
      timeLeft: '15 days left',
      category: 'Solar Panels',
      icon: FaSolarPanel
    },
    {
      id: 2,
      product: 'Inverter (5kW Hybrid)',
      image: inverterImage,
      originalPrice: 22000,
      groupPrice: 18000,
      goal: 10,
      participants: 8,
      deadline: '2024-05-15',
      description: 'Smart hybrid inverter with battery backup and grid-tie capabilities.',
      timeLeft: '30 days left',
      category: 'Inverters',
      icon: FaBolt
    },
    {
      id: 3,
      product: 'Battery Bank (10kWh)',
      image: batteryBankImage, // Updated to use the imported image
      originalPrice: 55000,
      groupPrice: 45000,
      goal: 5,
      participants: 3,
      deadline: '2024-05-01',
      description: 'Lithium-ion battery bank for reliable energy storage.',
      timeLeft: '16 days left',
      category: 'Batteries',
      icon: FaBatteryFull
    },
  ], []));

  const [newCampaign, setNewCampaign] = useState({
    product: '',
    description: '',
    originalPrice: 0,
    groupPrice: 0,
    targetBuyers: 10,
    deadline: '',
    image: null,
    category: 'Solar Panels' // Default category
  });

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBgColor = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign({
      ...newCampaign,
      [name]: value,
    });
  };

  const handleNumberInputChange = (name, valueString) => {
    const value = parseFloat(valueString);
    setNewCampaign({
      ...newCampaign,
      [name]: isNaN(value) ? 0 : value,
    });
  };

  const handleJoinCampaign = (campaignId) => {
    console.log(`Joining campaign with ID: ${campaignId}`);
    setOngoingCampaigns(ongoingCampaigns.map(campaign =>
        campaign.id === campaignId ? { ...campaign, participants: campaign.participants + 1 } : campaign
    ));
    toast({
      title: 'Joined Campaign!',
      description: 'You have successfully joined the group buying campaign.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    console.log('Creating new campaign:', newCampaign);

    // Adjusted validation to check if image is null or empty string
    if (!newCampaign.product || newCampaign.targetBuyers <= 0 || newCampaign.originalPrice <= 0 || !newCampaign.deadline || !newCampaign.image) {
        toast({
            title: 'Creation failed.',
            description: 'Please fill in all campaign details correctly, including image.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
        return;
    }

    const newCampaignWithMockData = {
      ...newCampaign,
      id: ongoingCampaigns.length + 1,
      participants: 0,
      timeLeft: 'Just started!', // Mock value for new campaign
      icon: FaSolarPanel // Default icon, could be dynamic based on category
    };
    setOngoingCampaigns([...ongoingCampaigns, newCampaignWithMockData]);

    toast({
      title: 'Campaign Created!',
      description: `${newCampaign.product} campaign has been created.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewCampaign({
      product: '',
      description: '',
      originalPrice: 0,
      groupPrice: 0,
      targetBuyers: 10,
      deadline: '',
      image: null,
      category: 'Solar Panels'
    });
    setSelectedImage(null);
    onClose(); // Close the modal after creation
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setNewCampaign({
          ...newCampaign,
          image: reader.result, // Store image as base64 or URL
        });
      };
      reader.readAsDataURL(file); // Read file as data URL for preview
    }
  };

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
      <Container maxW="container.lg" py={8} position="relative" zIndex={2}>
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Flex justify="space-between" align="center" mb={8}>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              onClick={() => navigate('/home')}
              color={headingColor}
            >
              Back to Home
            </Button>
            <Heading size="xl" color={headingColor}>Group Buying Campaigns</Heading>
          </Flex>

          {/* Campaigns List */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {ongoingCampaigns.map((campaign) => {
              const progressValue = (campaign.participants / campaign.goal) * 100;
              const savings = campaign.originalPrice - campaign.groupPrice;
              const savingsPercentage = campaign.originalPrice > 0 ? ((savings / campaign.originalPrice) * 100).toFixed(0) : 0;

              return (
                <Card key={campaign.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader p={0}> {/* Remove default padding */}
                    {/* Image component - will no longer use fallbackSrc */}
                    <Image
                      src={campaign.image}
                      alt={campaign.product}
                      height="200px"
                      width="100%" // Ensure image takes full width of card header
                      objectFit="cover"
                      borderTopRadius="lg" // Apply border radius only to the top
                    />
                  </CardHeader>
                  <CardBody> {/* Keep default padding here */}
                    <Flex align="center" mb={2}>
                       {/* You could add an icon here based on campaign.category */}
                      <Heading size="md">{campaign.product}</Heading>
                    </Flex>
                    {/* <Badge colorScheme="blue" mt={2}>{campaign.category}</Badge> */} {/* Optionally display category */}

                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text color={textColor}>
                          <Icon as={FaTag} mr={2} />
                          Original: R{campaign.originalPrice}
                        </Text>
                        {savingsPercentage > 0 && (
                          <Badge colorScheme="green" fontSize="md">
                            Save {savingsPercentage}%
                          </Badge>
                        )}
                      </HStack>

                      <Text fontSize="xl" fontWeight="bold" color="green.500">
                        Group Price: R{campaign.groupPrice}
                      </Text>

                      <Text color={textColor} noOfLines={2}>{campaign.description}</Text> {/* Limit description lines */}

                      <HStack>
                        <Icon as={FaUsers} />
                        <Text color={textColor}>
                          {campaign.participants} of {campaign.goal} joined
                        </Text>
                      </HStack>

                      <Progress value={progressValue} size="sm" colorScheme="blue" hasStripe isAnimated /> {/* Added stripe and animation */}

                      <HStack>
                        <Icon as={FaClock} />
                        <Text color={textColor}>{campaign.timeLeft}</Text>
                      </HStack>

                      <Button
                        colorScheme="green"
                        onClick={() => handleJoinCampaign(campaign.id)}
                        isDisabled={campaign.participants >= campaign.goal}
                        width="100%" // Make button full width
                        mt={4} // Add margin top
                      >
                        {campaign.participants >= campaign.goal ? 'Goal Reached!' : 'Join Campaign'}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>

          {/* Create Campaign Button at bottom */}
          <Box textAlign="center" mt={8}>
            <Button 
              colorScheme="teal" 
              onClick={onOpen} 
              leftIcon={<Icon as={FaSolarPanel} />}
              size="lg"
              width={{ base: "full", md: "auto" }}
            >
              Create New Campaign
            </Button>
          </Box>
        </VStack>
      </Container>

      {/* Create Campaign Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Solar Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
               {/* Category is now internal data, not needed in form unless you want to make it selectable */}
              {/* <FormControl id="category" isRequired>
                <FormLabel>Product Category</FormLabel>
                 <Input
                  name="category"
                  value={newCampaign.category}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  borderColor={inputBorderColor}
                />
              </FormControl> */}

              <FormControl id="product" isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  name="product"
                  value={newCampaign.product}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  borderColor={inputBorderColor}
                />
              </FormControl>

              <FormControl id="description" isRequired>
                <FormLabel>Product Description</FormLabel>
                <Textarea
                  name="description"
                  value={newCampaign.description}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  borderColor={inputBorderColor}
                />
              </FormControl>

              <FormControl id="image" isRequired>
                <FormLabel>Product Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  p={1}
                />
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected product"
                    maxH="200px"
                    mt={2}
                    borderRadius="md"
                  />
                )}
              </FormControl>

              <FormControl id="originalPrice" isRequired>
                <FormLabel>Original Price (R)</FormLabel>
                <NumberInput
                  min={0}
                  onChange={(valueString) => handleNumberInputChange('originalPrice', valueString)}
                  value={newCampaign.originalPrice}
                >
                  <NumberInputField bg={inputBgColor} borderColor={inputBorderColor} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl id="groupPrice" isRequired>
                <FormLabel>Group Price (R)</FormLabel>
                <NumberInput
                  min={0}
                  onChange={(valueString) => handleNumberInputChange('groupPrice', valueString)}
                  value={newCampaign.groupPrice}
                >
                  <NumberInputField bg={inputBgColor} borderColor={inputBorderColor} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl id="targetBuyers" isRequired>
                <FormLabel>Target Number of Buyers</FormLabel>
                <NumberInput
                  min={1}
                  onChange={(valueString) => handleNumberInputChange('targetBuyers', valueString)}
                  value={newCampaign.targetBuyers}
                >
                  <NumberInputField bg={inputBgColor} borderColor={inputBorderColor} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl id="deadline" isRequired>
                <FormLabel>Campaign Deadline</FormLabel>
                <Input
                  name="deadline"
                  type="date"
                  value={newCampaign.deadline}
                  onChange={handleInputChange}
                  bg={inputBgColor}
                  borderColor={inputBorderColor}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default GroupBuying;
