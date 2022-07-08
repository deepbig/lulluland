import db from '..';
import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { PerformanceAddFormData } from 'types';
const COLLECTION_NAME = 'users';
const SUBCOLLECTION_NAME = 'performances';

// export const getAllPerformances = async (
//   uid: string,
//   categories: string[]
// ): Promise<any> => {
//   const q = query(
//     collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_NAME),
//     orderBy('category'),
//     orderBy('subcategory'),
//     orderBy('date', 'desc')
//   );

//   const performances: Array<any> = [];
//   const newCategories: Array<any> = [];
//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     //   const performanceSnapshot = await getDocs(q);

//     categories.forEach((category) => {
//       newCategories.push({ category: category, subcategories: [] });
//       performances.push([]);
//     });

//     let index = -1;
//     let category = '';
//     let subcategory = '';

//     querySnapshot.docs.forEach((_data) => {
//       if (category !== _data.data().category) {
//         category = _data.data().category;
//         index = categories.indexOf(category);
//       }

//       if (subcategory !== _data.data().subcategory) {
//         subcategory = _data.data().subcategory;
//         newCategories[index].subcategories.push(subcategory);
//       }
//       performances[index].push({
//         id: _data.id,
//         ..._data.data(),
//       });
//     });
//   });

//   return [
//     performances as Array<PerformanceData[]>,
//     newCategories as CategoryData[],
//     unsubscribe,
//   ];
// };

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
