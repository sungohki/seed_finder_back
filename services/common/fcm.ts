// Import required modules
import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
import * as serviceAccount from '../../data/firebase-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const sendFCM = async (token: string) => {
  // Define the message payload
  const message: admin.messaging.Message = {
    notification: {
      title: 'title',
      body: 'body',
    },
    data: {
      documentId: '1',
    },
    token: token, // FCM device token
  };

  try {
    // Send the message
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};
