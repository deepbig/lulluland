import db from '..';
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { UserData } from 'types';
const COLLECTION_NAME = 'users';

export const getLoggedInUser = async (user: {
  uid: string;
  displayName: any;
  email: any;
  photoURL: any;
}): Promise<UserData | null> => {
  const docRef = doc(db, COLLECTION_NAME, user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserData;
  } else {
    // add doc
    try {
      await setDoc(doc(db, COLLECTION_NAME, user.uid), {
        displayName: user.displayName,
        username: '',
        email: user.email,
        photoURL: user.photoURL,
        gender: null,
        levelOfExperience: 0,
        peerRating: 10,
        categories: [],
        groups: [],
        age: 0,
        title: '',
        bio: '',
      });
    } catch (e) {
      // need to handle error case.
      return null;
    }
    const newDocSnap = await getDoc(docRef);
    return { uid: newDocSnap.id, ...newDocSnap.data() } as UserData;
  }
};

export const getUserFromDB = async (
  username: string
): Promise<UserData | null> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('username', '==', username)
  );

  const docSnap = await getDocs(q);
  if (docSnap.empty) {
    return null;
  } else {
    const data: any = {
      uid: docSnap.docs[0].id,
      ...docSnap.docs[0].data(),
    };
    return data as UserData;
  }
};

export const updateUserUsernameAndCategories = async (
  uid: string,
  username: string,
  categories: string[]
): Promise<UserData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);

    await updateDoc(docRef, {
      username: username,
      categories: categories,
    });

    const newDocSnap = await getDoc(docRef);
    return { uid: newDocSnap.id, ...newDocSnap.data() } as UserData;
  } catch (e) {
    // need to handle error case.
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  values: { title: string; bio: string }
): Promise<UserData | null> => {
  const docRef = doc(db, COLLECTION_NAME, userId);
  try {
    await updateDoc(docRef, {
      title: values.title,
      bio: values.bio,
    });
  } catch (e) {
    return null;
  }

  const newDocSnap = await getDoc(docRef);
  return { uid: newDocSnap.id, ...newDocSnap.data() } as UserData;
};
