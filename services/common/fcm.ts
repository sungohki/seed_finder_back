// Import required modules
import * as admin from 'firebase-admin';
import express, { Request, Response } from 'express';

// Initialize the Firebase Admin SDK
const serviceAccount = require('.../data/seedfinder-23b19-firebase-adminsdk-19tl8-da1abb6560.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendFCM=async (sendMessage)=>{
    // Define the message payload
    const {title,body,token}=sendMessage
  const message: admin.messaging.Message = {
    notification: {
      title: title,
      body: body,
    },
    token: token, // FCM device token
  };

  try {
    // Send the message
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}


  


