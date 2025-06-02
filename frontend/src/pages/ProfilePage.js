import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api'; // Assuming auth service handles user data
import axios from 'axios'; // Assuming axios is used for API calls. Adjust if using your api.js service.

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  useColorModeValue,
  Spinner,
  Text,
  Textarea,
  HStack,
  Divider,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Link,
  Icon,
  Avatar,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';

// Import Icons (example using react-icons, make sure they are installed)
import { FaGoogle, FaFacebook, FaApple, FaEdit, FaTrash, FaArrowUp, FaArrowLeft } from 'react-icons/fa';
import { CheckCircleIcon } from '@chakra-ui/icons'; // Assuming CheckCircleIcon is still needed or can be removed if replaced by toast

// Define your backend API base URL
const API_BASE_URL = 'http://localhost:5000'; // Replace with your actual backend URL

function ProfilePage() {
  const navigate = useNavigate();
  const toast = useToast();

  // State for form fields
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    socialAccounts: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
    profilePictureUrl: null,
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching user data
  const [isSaving, setIsSaving] = useState(false); // Loading state for saving account changes

  const user = auth.getCurrentUser(); // Get current user data from localStorage

  // Color mode values - MOVED TO TOP LEVEL
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBgColor = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const avatarBg = useColorModeValue('gray.300', 'gray.600'); // For Avatar fallback background
  const avatarColor = useColorModeValue('gray.800', 'white'); // For Avatar fallback text color
  const fileButtonBg = useColorModeValue('gray.100', 'gray.600'); // For file input button background
  const fileButtonBorderColor = useColorModeValue('gray.300', 'gray.600'); // For file input button border
  const fileButtonColor = useColorModeValue('gray.700', 'whiteAlpha.800'); // For file input button text color
  const fileButtonHoverBg = useColorModeValue('gray.200', 'gray.500'); // For file input button hover background

  useEffect(() => {
    // Redirect if user is not logged in (should be handled by ProtectedRoute too, but good check)
    if (!user) {
      navigate('/login');
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to access this page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Populate form fields with current user data
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
      socialAccounts: {
        facebook: user.socialAccounts?.facebook || '',
        twitter: user.socialAccounts?.twitter || '',
        instagram: user.socialAccounts?.instagram || '',
      },
      profilePictureUrl: user.profilePictureUrl || null,
    });

    setLoading(false); // Stop loading after populating

  }, [user, navigate, toast]); // Re-run effect if user or navigate changes

  // Dummy Data for new sections
  const savedPaymentMethods = [
      { id: 1, type: 'Visa', last4: '1234', expiry: '12/25' },
      { id: 2, type: 'Mastercard', last4: '5678', expiry: '08/24' },
  ];

  const billingHistory = [
      { id: 101, date: '2023-10-01', amount: 'R250.00', status: 'Paid' },
      { id: 102, date: '2023-11-05', amount: 'R300.00', status: 'Paid' },
      { id: 103, date: '2023-12-10', amount: 'R280.00', status: 'Paid' },
  ];

  // Removed dummy data for subscriptionPlan

  // Handler for saving account changes (currently just logs and shows toast)
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const formData = new FormData();

    // Append text fields
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);
    formData.append('bio', profileData.bio);
    formData.append('facebook', profileData.socialAccounts.facebook);
    formData.append('twitter', profileData.socialAccounts.twitter);
    formData.append('instagram', profileData.socialAccounts.instagram);

    // Append profile picture file if selected
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    try {
      // Replace with your actual backend endpoint to update profile data
      const response = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          Authorization: `Bearer ${auth.getToken()}`, // Include auth token
        },
      });

      if (response.data.success) {
        // Update the local user object (in auth service or localStorage) if needed
        // For now, we'll just show success and refetch
        toast({
          title: 'Profile updated.',
          description: 'Your profile information has been saved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
         // Refetch data to display the new profile picture URL if uploaded
        fetchProfileData();

      } else {
        toast({
          title: 'Update failed.',
          description: response.data.message || 'An error occurred while saving.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Update failed.',
        description: error.response?.data?.message || 'An error occurred while saving.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Dummy handlers for new features
  const handleLinkSocial = (provider) => {
      toast({
          title: `${provider} linking simulated.`,
          description: `You would typically link your ${provider} account here.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
      });
  };

  const handleEditPayment = (id) => {
      toast({
          title: `Edit Payment ${id} simulated.`,
          description: `Editing details for payment method ID: ${id}.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
      });
  };

  const handleRemovePayment = (id) => {
      toast({
          title: `Remove Payment ${id} simulated.`,
          description: `Removing payment method ID: ${id}.`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
      });
  };

  // Removed handleUpgradePlan function

  // Function to fetch profile data from backend
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Replace with your actual backend endpoint to get profile data
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${auth.getToken()}`, // Include auth token
        },
      });
      // Assuming the backend returns profile data including bio, social, and profilePictureUrl
      setProfileData(prev => ({
        ...prev,
        ...response.data, // Merge fetched data with existing state (keeps name/email from auth)
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Optionally show an error toast
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSocialInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      socialAccounts: {
        ...profileData.socialAccounts,
        [name]: value,
      },
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      // Optional: Display a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePictureUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
       setProfilePictureFile(null);
       // Optional: Revert to previous image if file selection is cancelled
      //  setProfileData(prev => ({ ...prev, profilePictureUrl: user?.profilePictureUrl || null }));
    }
  };

  if (loading) {
      return (
           <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
               <Spinner size="xl" color="blue.500" />
           </Flex>
      );
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} p={4}>
      <Box
        maxW="3xl" // Increased max width to accommodate more content
        w="full"
        bg={bgColor} // Use bgColor for the main container background
        p={6}
      >
         <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading as="h1" size="xl" color={headingColor}>
              User Profile & Settings
            </Heading>
            {/* Back to Dashboard button */}
             <Button onClick={() => navigate('/dashboard')} size="sm" colorScheme="teal">
                 Back to Dashboard
             </Button>
        </Flex>

        <VStack spacing={8} align="stretch"> {/* Increased spacing between sections */}

           {/* Profile Picture Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Profile Picture</Heading>
             </CardHeader>
             <CardBody>
               <VStack spacing={4} align="center">
                 <Avatar
                   size="xl"
                   name={profileData.name}
                   src={profileData.profilePictureUrl || ''}
                   bg={avatarBg}
                   color={avatarColor}
                 />
                 <FormControl id="profilePicture">
                   <FormLabel>Change Profile Picture</FormLabel>
                   <Input
                     type="file"
                     accept="image/*"
                     onChange={handleProfilePictureChange}
                     pt={1}
                     sx={{
                       '::file-selector-button': {
                         mr: 4,
                         py: 2,
                         px: 4,
                         borderRadius: 'md',
                         border: '1px solid',
                         borderColor: fileButtonBorderColor,
                         bg: fileButtonBg,
                         color: fileButtonColor,
                         cursor: 'pointer',
                         outline: 'none',
                         _hover: {
                           bg: fileButtonHoverBg,
                         },
                       }
                     }}
                   />
                 </FormControl>
               </VStack>
             </CardBody>
           </Card>

           {/* Account Settings Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Account Information</Heading>
             </CardHeader>
             <CardBody>
               <VStack spacing={4} as="form">
                 <FormControl id="name">
                   <FormLabel>Full Name</FormLabel>
                   <Input
                     name="name"
                     value={profileData.name}
                     onChange={handleInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>

                 <FormControl id="email">
                   <FormLabel>Email Address</FormLabel>
                   <Input
                     name="email"
                     type="email"
                     value={profileData.email}
                     onChange={handleInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>

                 <FormControl id="phone">
                   <FormLabel>Phone Number</FormLabel>
                   <Input
                     type="tel"
                     value={profileData.phone}
                     onChange={handleInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>

                 <FormControl id="address">
                   <FormLabel>Address</FormLabel>
                   <Input
                     type="text"
                     value={profileData.address}
                     onChange={handleInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>
               </VStack>
             </CardBody>
           </Card>

           {/* Profile Bio Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Profile Bio</Heading>
             </CardHeader>
             <CardBody>
               <FormControl id="bio">
                 <FormLabel>Your Energy Motto or Goal</FormLabel>
                 <Textarea
                   value={profileData.bio}
                   onChange={handleInputChange}
                   bg={inputBgColor}
                   borderColor={inputBorderColor}
                 />
               </FormControl>
             </CardBody>
           </Card>

           {/* Link Social Accounts Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Linked Accounts</Heading>
             </CardHeader>
             <CardBody>
               <VStack spacing={4} as="form">
                 <FormControl id="facebook">
                   <FormLabel>Facebook Profile URL</FormLabel>
                   <Input
                     name="facebook"
                     value={profileData.socialAccounts.facebook}
                     onChange={handleSocialInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>
                 <FormControl id="twitter">
                   <FormLabel>Twitter Profile URL</FormLabel>
                   <Input
                     name="twitter"
                     value={profileData.socialAccounts.twitter}
                     onChange={handleSocialInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>
                 <FormControl id="instagram">
                   <FormLabel>Instagram Profile URL</FormLabel>
                   <Input
                     name="instagram"
                     value={profileData.socialAccounts.instagram}
                     onChange={handleSocialInputChange}
                     bg={inputBgColor}
                     borderColor={inputBorderColor}
                   />
                 </FormControl>
               </VStack>
             </CardBody>
           </Card>

           {/* Saved Payment Methods Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Saved Payment Methods</Heading>
             </CardHeader>
             <CardBody>
               <Text color={textColor}>Manage your saved payment methods here (Requires backend implementation).</Text>
             </CardBody>
           </Card>

           {/* Billing History Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Billing History</Heading>
             </CardHeader>
             <CardBody>
               <Text color={textColor}>View your billing history and invoices here (Requires backend implementation).</Text>
             </CardBody>
           </Card>

           {/* Subscription Plan Info Section */}
           <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
             <CardHeader>
               <Heading size="md">Your Subscription Plan</Heading>
             </CardHeader>
             <CardBody>
               <Text color={textColor} mb={2}>Your current plan details would be shown here.</Text>
               <Button
                 variant="link"
                 colorScheme="blue"
                 onClick={() => navigate('/home')}
               >
                 Manage Subscription on Home Page
               </Button>
             </CardBody>
           </Card>

           {/* Save Changes Button */}
           <Button
             colorScheme="blue"
             size="lg"
             onClick={handleSaveChanges}
             isLoading={isSaving}
             loadingText="Saving..."
             alignSelf="center"
           >
             Save Changes
           </Button>

        </VStack>
      </Box>
    </Flex>
  );
}

export default ProfilePage;