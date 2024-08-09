// import the sdk functions
import { initializeApp } from 'firebase/app';
import { format } from 'date-fns';
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
import { firebaseConfig } from './config';
import { utcToZonedTime } from 'date-fns-tz';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// instantiate firestore
const db = getFirestore(app);

// Timezone/America
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const addDataPerDay = async ({ userId, timestamp, type, value }) => {
  try {
    const utcTimestamp = utcToZonedTime(
      new Date(timestamp),
      timezone,
    ).getTime();
    const day = format(utcTimestamp, 'yyyy-MM-dd');
    // '2024-03-26';

    // Construct the path to the collection
    const collectionPath = `users/${userId}/${type}`;

    // Add data to Firestore with the date as the document ID
    const docRef = await addDoc(
      collection(db, `${collectionPath}/${day}/entries`),
      {
        timestamp: utcTimestamp,
        value: value,
      },
    );
    console.log(`${type} data added successfully with ID: `, docRef.id);
  } catch (error) {
    console.error(`Error adding ${type} data: `, error);
  }
};

export const addDataPerDayAverage = async ({
  userId,
  timestamp,
  type,
  value,
}) => {
  try {
    const utcTimestamp = utcToZonedTime(
      new Date(timestamp),
      timezone,
    ).getTime();
    const day = format(utcTimestamp, 'yyyy-MM-dd');
    // '2024-03-26';

    const pathRef = doc(db, `users/${userId}/${type}/${day}`);

    // Set the 'average' field
    await setDoc(pathRef, {
      average: value,
    });

    console.log(`${type} data average added successfully `);
  } catch (error) {
    console.error(`Error adding average ${type} data: `, error);
  }
};

export const retrieveData = async ({
  userId, // 1
  type, // temperature
  day, // 2024-03-27
}) => {
  try {
    const collectionPath = `users/${userId}/${type}/${day}/entries`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    const data = [];
    querySnapshot.forEach(doc => {
      data.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return data;
  } catch (error) {
    console.error('Error retrieving data: ', error);
  }
  // try {
  //   const utcTimestamp = utcToZonedTime(
  //     new Date(timestamp),
  //     timezone,
  //   ).getTime();
  //   console.log(utcTimezone);
  //   const day = format(utcTimestamp, 'yyyy-MM-dd');
  //   // '2024-03-26';
  //   // Construct the path to the collection
  //   const collectionPath = `users/${userId}/temperature`;
  //   // Add data to Firestore with the date as the document ID
  //   const docRef = await addDoc(
  //     collection(db, `${collectionPath}/${day}/entries`),
  //     {
  //       timestamp: utcTimestamp,
  //       value: temperatureValue,
  //     },
  //   );
  //   console.log('Temperature data added successfully with ID: ', docRef.id);
  // } catch (error) {
  //   console.error('Error adding temperature data: ', error);
  // }
};

export const retrieveAverageData = async ({ userId, type, dates }) => {
  try {
    const averages = [];

    for (const date of dates) {
      const collectionPath = `users/${userId}/${type}/${date}`;
      const docRef = doc(db, collectionPath);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const average = data.average;
        averages.push(average);
      } else {
        averages.push(0);
      }
    }
    return averages;
  } catch (error) {
    console.error('Error retrieving average data: ', error);
  }
};
