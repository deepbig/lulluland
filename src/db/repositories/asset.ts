import db from '..';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { AssetData } from 'types';
const SUBCOLLECTION_ASSET_SUMMARIES = 'asset_summaries';
const SUBCOLLECTION_STOCK_HISTORIES = 'stock_histories';
const COLLECTION_NAME = 'users';
// TIME_ZONE = KST

export const summaries = async (uid: string): Promise<Array<AssetData>> => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES),
    where('date', '>=', start),
    where('date', '<', end),
    orderBy('date')
  );

  const assetsSnapshot = await getDocs(q);
  const data: Array<any> = [];

  assetsSnapshot.docs.forEach((_data) => {
    data.push({
      id: _data.id, // because id field in separate function in firestore
      ..._data.data(), // the remaining fields
    });
  });

  return data as Array<AssetData>;
};

export const stockHistories = async (uid: string): Promise<Array<any>> => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_STOCK_HISTORIES),
    where('date', '>=', start),
    where('date', '<', end),
    orderBy('date')
  );

  const assetsSnapshot = await getDocs(q);
  const data: Array<any> = [];

  assetsSnapshot.docs.forEach((_data) => {
    data.push({
      id: _data.id, // because id field in separate function in firestore
      ..._data.data(), // the remaining fields
    });
  });

  return data as Array<AssetData>;
};

export const updateAssetSummary = async (
  uid: string,
  values: AssetData
): Promise<AssetData> => {
  // if id is not exist, create new one
  try {
    const updatedValues = {
      date: serverTimestamp(),
      assets: values.assets,
      stocks: values.stocks,
      incomes: values.incomes,
      expenses: values.expenses,
    };
    if (!values.id) {
      const docRef = await addDoc(
        collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES),
        { ...updatedValues }
      );
      return { ...updatedValues, date: Timestamp.fromDate(new Date()), id: docRef.id } as AssetData;
    } else {
      console.log(uid, values.id, updatedValues);
      await updateDoc(
        doc(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES, values.id),
        { ...updatedValues }
      );
      return { ...updatedValues, date: Timestamp.fromDate(new Date()), id: values.id } as AssetData;
    }
  } catch (error) {
    throw error;
  }
};

// export const saveActivity = async (
//   values: ActivityAddFormData
// ): Promise<ActivityData | null> => {
//   const docRef = await addDoc(
//     collection(db, COLLECTION_NAME, values.uid, SUBCOLLECTION_ASSETS),
//     {
//       uid: values.uid,
//       category: values.category,
//       date: Timestamp.fromDate(new Date(values.date)),
//       note: values.note,
//       duration: +values.duration,
//     }
//   );

//   const newDocRef = doc(
//     db,
//     COLLECTION_NAME,
//     values.uid,
//     SUBCOLLECTION_ASSETS,
//     docRef.id
//   );
//   const docSnap = await getDoc(newDocRef);
//   if (docSnap.exists()) {
//     return { id: docSnap.id, ...docSnap.data() } as ActivityData;
//   } else {
//     return null;
//   }
// };

// // update an activity
// export const update = async (
//   id: string,
//   activity: ActivityData
// ): Promise<ActivityData> => {
//   const docRef = doc(db, COLLECTION_NAME, id);
//   await updateDoc(docRef, { ...activity });

//   return {
//     ...activity,
//     id: id,
//   } as ActivityData;
// };

// export const remove = async (userId: string, activityId: string) => {
//   await deleteDoc(
//     doc(db, COLLECTION_NAME, userId, SUBCOLLECTION_ASSETS, activityId)
//   );
// };
