import db from '..';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { AssetData, StockHistoryData } from 'types';
const SUBCOLLECTION_ASSETS = 'assets';
const SUBCOLLECTION_ASSET_SUMMARIES = 'asset_summaries';
const SUBCOLLECTION_STOCK_HISTORIES = 'stock_histories';
const COLLECTION_NAME = 'users';
// TIME_ZONE = KST

export const current = async (uid: string): Promise<Array<AssetData>> => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSETS),
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

export const stockHistories = async (uid: string): Promise<Array<StockHistoryData>> => {

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_STOCK_HISTORIES),
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

  return data as Array<StockHistoryData>;
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
