import db from '..';
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
  doc,
  where,
  getDoc,
} from 'firebase/firestore';
import { ActivityAddFormData, ActivityData } from 'types';
const SUBCOLLECTION_NAME = 'activities';
const COLLECTION_NAME = 'users';

// retrieve selected year activities
export const selected = async (
  currentYear: number,
  uid: string
): Promise<Array<ActivityData>> => {
  const start = new Date(currentYear, 0, 1);
  const end = new Date(currentYear + 1, 0, 1);

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_NAME),
    where('date', '>=', start),
    where('date', '<', end),
    orderBy('date')
  );

  const activitiesSnapshot = await getDocs(q);
  const data: Array<any> = [];

  activitiesSnapshot.docs.forEach((_data) => {
    data.push({
      id: _data.id, // because id field in separate function in firestore
      ..._data.data(), // the remaining fields
    });
  });

  // return and convert back it array of activity
  return data as Array<ActivityData>;
};

// retrieve current (1 year) activities
export const current = async (uid: string): Promise<Array<ActivityData>> => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_NAME),
    where('date', '>=', start),
    where('date', '<', end),
    orderBy('date')
  );

  const activitiesSnapshot = await getDocs(q);
  const data: Array<any> = [];

  activitiesSnapshot.docs.forEach((_data) => {
    data.push({
      id: _data.id, // because id field in separate function in firestore
      ..._data.data(), // the remaining fields
    });
  });

  // return and convert back it array of activity
  return data as Array<ActivityData>;
};

export const saveActivity = async (
  values: ActivityAddFormData
): Promise<ActivityData | null> => {
  const docRef = await addDoc(
    collection(db, COLLECTION_NAME, values.uid, SUBCOLLECTION_NAME),
    {
      uid: values.uid,
      category: values.category,
      date: Timestamp.fromDate(new Date(values.date)),
      note: values.note,
      duration: +values.duration,
    }
  );

  const newDocRef = doc(
    db,
    COLLECTION_NAME,
    values.uid,
    SUBCOLLECTION_NAME,
    docRef.id
  );
  const docSnap = await getDoc(newDocRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ActivityData;
  } else {
    return null;
  }
};

// update an activity
export const update = async (
  id: string,
  activity: ActivityData
): Promise<ActivityData> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { ...activity });

  return {
    ...activity,
    id: id,
  } as ActivityData;
};

export const remove = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
