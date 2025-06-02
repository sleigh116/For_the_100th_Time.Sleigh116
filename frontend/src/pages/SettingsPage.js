import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api'; // Assuming auth service is still used

// Import Chakra UI Components
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  useColorModeValue,
  Spinner,
  Divider, // Added Divider
  Select, // Added Select for dropdown
  Switch, // Added Switch for toggles
  Spacer, // Added Spacer for layout if needed
  AlertDialog, // Added AlertDialog for confirmation modal
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure, // Hook for modal
  FormErrorMessage, // ADDED: Import FormErrorMessage
  Collapse,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { FaArrowLeft } from 'react-icons/fa'; // Icon for back button

function SettingsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  // State for Account Settings (Change Password)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordChangeStatus, setPasswordChangeStatus] = useState(null);

  // State for Preferences
  const [receiveSms, setReceiveSms] = useState(true); // Default notification preference
  const [receiveEmail, setReceiveEmail] = useState(true); // Default notification preference
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesStatus, setPreferencesStatus] = useState(null);

  // State and hooks for Delete Account Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(); // Ref for the cancel button

  const user = auth.getCurrentUser(); // Get current user data

  // Chakra UI hook for dynamic colors based on color mode
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600'); // Added border color

  // Redirect if user is not logged in
  useEffect(() => {
      if (!user) {
          navigate('/login');
          toast({
               title: 'Authentication Required',
               description: 'You need to be logged in to access this page.',
               status: 'warning',
               duration: 3000,
               isClosable: true,
          });
      }
  }, [user, navigate, toast]);

  // Helper to format last login date (if user object includes it)
  const formatLastLogin = (dateString) => {
      if (!dateString) return 'N/A';
      try {
          const date = new Date(dateString);
          return date.toLocaleString();
      } catch (error) {
          console.error("Error formatting date:", error);
          return dateString;
      }
  };

  // Handle Password Change Submission (Mock API call)
  const handleChangePassword = async (e) => {
      e.preventDefault();
      setPasswordErrors({}); // Clear previous errors
      setPasswordChangeStatus(null); // Clear previous status

      // Basic validation
      const errors = {};
      if (!oldPassword) errors.oldPassword = 'Old password is required';
      if (!newPassword) {
           errors.newPassword = 'New password is required';
      } else if (newPassword.length < 6) {
          errors.newPassword = 'New password must be at least 6 characters long';
      }
      if (!confirmNewPassword) {
          errors.confirmNewPassword = 'Confirm new password is required';
      } else if (newPassword !== confirmNewPassword) {
          errors.confirmNewPassword = 'Passwords do not match';
      }

      if (Object.keys(errors).length > 0) {
          setPasswordErrors(errors);
           setPasswordChangeStatus({ status: 'error', message: 'Please fix the errors above' });
          return;
      }

      setPasswordChangeLoading(true);

      try {
          // --- MOCK API CALL FOR CHANGE PASSWORD ---
          console.log('Attempting to change password:', { oldPassword, newPassword });
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

          // Simulate success or failure
          const success = true; // Change to false to test error

          if (success) {
              toast({
                  title: 'Password Updated',
                  description: 'Your password has been updated successfully.',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
              });
              // Clear form fields on success
              setOldPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
              setPasswordChangeStatus({ status: 'success', message: 'Password updated successfully' });
          } else {
               toast({
                  title: 'Password Change Failed',
                  description: 'There was an error changing your password. Please try again later.',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
              });
              setPasswordChangeStatus({ status: 'error', message: 'Password change failed' });
          }

      } catch (error) {
          console.error('Password change error:', error);
           toast({
              title: 'Error Occurred',
              description: error.message || 'Could not change password',
              status: 'error',
              duration: 5000,
              isClosable: true,
          });
          setPasswordChangeStatus({ status: 'error', message: 'An error occurred' });
      } finally {
          setPasswordChangeLoading(false);
           // Hide status message after a few seconds
           setTimeout(() => setPasswordChangeStatus(null), 5000);
      }
  };

  // Handle Preferences Save (Mock API call)
   const handleSavePreferences = async () => {
       setPreferencesSaving(true);
       setPreferencesStatus(null); // Clear previous status
       try {
           // --- MOCK API CALL FOR SAVING PREFERENCES ---
           console.log('Saving preferences:', { receiveSms, receiveEmail });

           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

           toast({
               title: 'Preferences Saved',
               description: 'Your preferences have been saved successfully.',
               status: 'success',
               duration: 3000,
               isClosable: true,
           });
            setPreferencesStatus({ status: 'success', message: 'Preferences saved successfully' });

       } catch (error) {
           console.error('Preferences save error:', error);
            toast({
               title: 'Error Occurred',
               description: error.message || 'Could not save preferences',
               status: 'error',
               duration: 5000,
               isClosable: true,
           });
            setPreferencesStatus({ status: 'error', message: 'Failed to save preferences' });
       } finally {
           setPreferencesSaving(false);
           // Hide status message after a few seconds
           setTimeout(() => setPreferencesStatus(null), 5000);
       }
   };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
      // --- MOCK DELETE ACCOUNT PROCESS ---
      console.log('Deleting account for user:', user?.email);
      // In a real app: Call delete API, then clear auth token and redirect

      onClose(); // Close the confirmation modal
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      auth.logout(); // Clear auth token (assuming this clears localStorage)
       toast({
           title: 'Account Deleted',
           description: 'Your account has been deleted successfully.',
           status: 'success',
           duration: 3000,
           isClosable: true,
       });
      navigate('/login'); // Redirect to login page
      // --- END MOCK PROCESS ---
  };

  // Handle Back to Dashboard button
  const handleBackToDashboard = () => {
      navigate('/dashboard');
  };

  // Render loading spinner while user is being checked or data is loading initially
  if (!user) {
       return (
           <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
               <Spinner size="xl" color={spinnerColor} />
           </Flex>
       );
   }

  return (
    <Box minH="100vh" bg={bgColor}>
        <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6, lg: 8 }}>

            {/* Header / Back Button */}
            <HStack justify="flex-start" w="full" mb={8} pt={4}>
                <Button variant="link" colorScheme="blue" onClick={handleBackToDashboard}>
                   &larr; Back to Dashboard
                </Button>
            </HStack>

            <Heading as="h1" size="xl" color={headingColor} mb={2}>
              Settings
            </Heading>

            {/* Last Login Info */}
             <Text fontSize="sm" color={mutedTextColor} mb={8}>
                 Last login: {formatLastLogin(user?.lastLogin)}
             </Text>

            {/* Account Settings Section */}
            <Box p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg" bg={cardBg} mb={8}>
                <Heading as="h2" size="md" mb={4} color={headingColor}>Account Settings</Heading>
                <Collapse in={passwordChangeStatus !== null} animateOpacity>
                     {passwordChangeStatus && (
                        <Flex
                            align="center"
                            color={passwordChangeStatus.status === 'success' ? 'green.500' : 'red.500'}
                            mb={4}
                        >
                            <Icon
                                as={passwordChangeStatus.status === 'success' ? CheckCircleIcon : WarningIcon}
                                mr={2}
                            />
                            <Text>{passwordChangeStatus.message}</Text>
                        </Flex>
                     )}
                </Collapse>
                <VStack as="form" spacing={4} onSubmit={handleChangePassword} noValidate align="stretch">
                     <FormControl id="old-password" isInvalid={!!passwordErrors.oldPassword}>
                       <FormLabel fontSize="sm" color={mutedTextColor}>Old Password</FormLabel>
                       <Input
                         type="password"
                         placeholder="Enter current password"
                         value={oldPassword}
                         onChange={(e) => setOldPassword(e.target.value)}
                       />
                       <FormErrorMessage>{passwordErrors.oldPassword}</FormErrorMessage>
                     </FormControl>

                     <FormControl id="new-password" isInvalid={!!passwordErrors.newPassword}>
                       <FormLabel fontSize="sm" color={mutedTextColor}>New Password</FormLabel>
                       <Input
                         type="password"
                         placeholder="Enter new password"
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                       />
                       <FormErrorMessage>{passwordErrors.newPassword}</FormErrorMessage>
                     </FormControl>

                     <FormControl id="confirm-new-password" isInvalid={!!passwordErrors.confirmNewPassword}>
                       <FormLabel fontSize="sm" color={mutedTextColor}>Confirm New Password</FormLabel>
                       <Input
                         type="password"
                         placeholder="Confirm new password"
                         value={confirmNewPassword}
                         onChange={(e) => setConfirmNewPassword(e.target.value)}
                       />
                       <FormErrorMessage>{passwordErrors.confirmNewPassword}</FormErrorMessage>
                     </FormControl>

                     <Button
                       type="submit"
                       colorScheme="teal"
                       size="md"
                       w={{ base: 'full', md: 'auto' }} // Full width on mobile, auto on desktop
                       isLoading={passwordChangeLoading}
                       loadingText="Saving..."
                       mt={4}
                     >
                       Change Password
                     </Button>
                </VStack>
            </Box>

            <Divider mb={8} /> {/* Divider between sections */}

            {/* Preferences Section */}
             <Box p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg" bg={cardBg} mb={8}>
                <Heading as="h2" size="md" mb={4} color={headingColor}>Preferences</Heading>
                <Collapse in={preferencesStatus !== null} animateOpacity>
                     {preferencesStatus && (
                        <Flex
                            align="center"
                            color={preferencesStatus.status === 'success' ? 'green.500' : 'red.500'}
                             mb={2}
                        >
                            <Icon
                                as={preferencesStatus.status === 'success' ? CheckCircleIcon : WarningIcon}
                                mr={2}
                            />
                            <Text>{preferencesStatus.message}</Text>
                        </Flex>
                     )}
                </Collapse>
                <VStack spacing={4} align="stretch">
                     <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="sms-alerts" mb="0" fontSize="sm" color={mutedTextColor}>
                           Receive SMS Alerts
                        </FormLabel>
                        <Spacer /> {/* Pushes switch to the right */}
                        <Switch
                           id="sms-alerts"
                           isChecked={receiveSms}
                           onChange={(e) => setReceiveSms(e.target.checked)}
                           colorScheme="blue"
                         />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="email-alerts" mb="0" fontSize="sm" color={mutedTextColor}>
                           Receive Email Alerts
                        </FormLabel>
                        <Spacer /> {/* Pushes switch to the right */}
                        <Switch
                           id="email-alerts"
                           isChecked={receiveEmail}
                           onChange={(e) => setReceiveEmail(e.target.checked)}
                           colorScheme="blue"
                         />
                    </FormControl>

                    <Button
                       colorScheme="blue"
                       size="md"
                       w={{ base: 'full', md: 'auto' }}
                       isLoading={preferencesSaving}
                       loadingText="Saving..."
                        onClick={handleSavePreferences}
                       mt={4}
                     >
                       Save Preferences
                     </Button>
                </VStack>
            </Box>

            <Divider mb={8} /> {/* Divider between sections */}

            {/* Delete Account Section (Danger Zone) */}
             <Box p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg" bg={cardBg} borderColor="red.500" borderWidth={1}> {/* Add border for danger */}
                <Heading as="h2" size="md" mb={4} color="red.500">Danger Zone</Heading>
                <Text fontSize="sm" color={mutedTextColor} mb={4}>
                    Deleting your account is irreversible. All your data will be lost.
                </Text>
                <Button
                   colorScheme="red"
                   size="md"
                   w={{ base: 'full', md: 'auto' }}
                   onClick={onOpen} // Open the confirmation modal
                 >
                   Delete My Account
                 </Button>
            </Box>

            {/* Delete Account Confirmation Modal */}
             <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
             >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete My Account
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure you want to delete your account? This action cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
             </AlertDialog>


        </Box>
    </Box>
  );
}

export default SettingsPage;
