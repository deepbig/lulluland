import db from '..';
import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { PerformanceAddFormData } from 'types';
const COLLECTION_NAME = 'users';
const SUBCOLLECTION_NAME = 'performances';

export const savePerformance = async (values: PerformanceAddFormData) => {
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
};
