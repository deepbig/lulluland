import db from '..';
import {
  collection,
  Timestamp,
  query,
  orderBy,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { PerformanceAddFormData, PerformanceData } from 'types';
const COLLECTION_NAME = 'users';
const SUBCOLLECTION_NAME = 'performances';

export const fetchAllPerformances = async (
  uid: string
): Promise<PerformanceData[]> => {
  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_NAME),
    orderBy('category'),
    orderBy('subcategory'),
    orderBy('date')
  );

  const performancesSnapshot = await getDocs(q);
  const data: Array<any> = [];

  performancesSnapshot.docs.forEach((_data) => {
    data.push({
      id: _data.id,
      ..._data.data(),
    });
  });

  return data as Array<PerformanceData>;
};

export const savePerformance = async (
  values: PerformanceAddFormData
): Promise<PerformanceData[]> => {
  try {
    await addDoc(
      collection(db, COLLECTION_NAME, values.uid, SUBCOLLECTION_NAME),
      {
        uid: values.uid,
        category: values.category,
        subcategory: values.subcategory,
        date: Timestamp.fromDate(new Date(values.date)),
        note: values.note,
        performance: +values.performance,
      }
    );

    return await fetchAllPerformances(values.uid);
  } catch (e) {
    throw e;
  }
};
