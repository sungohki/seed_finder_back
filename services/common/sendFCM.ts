// Import required modules
import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
import * as serviceAccount from '../../data/firebase-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

interface IMessageData {
  documentId: string;
}

export interface IMessageRequest {
  title: string;
  body: string;
  data: IMessageData;
  deviceToken: string;
}

export const sendFCM = async (req: IMessageRequest) => {
  // Define the message payload
  const message: admin.messaging.Message = {
    notification: {
      title: req.title,
      body: req.body,
    },
    data: {
      ...req.data,
    },
    token: req.deviceToken, // FCM device token
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
