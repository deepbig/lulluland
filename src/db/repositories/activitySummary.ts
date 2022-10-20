import db from '..';
import { collection, getDocs, query } from 'firebase/firestore';
import { ActivitySummaryData } from 'types';
const SUBCOLLECTION_NAME = 'activity_summaries';
const COLLECTION_NAME = 'users';

export const fetchAllActivitySummaries = async (
  uid: string
): Promise<Array<ActivitySummaryData>> => {
  const q = query(collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_NAME));

  const activitySummarySnapshot = await getDocs(q);
  const res: Array<ActivitySummaryData> = [];

  activitySummarySnapshot.docs.forEach((_data) => {
    res.push({
      category: _data.id,
      ..._data.data(),
    } as ActivitySummaryData);
  });

  if (res.length > 0) {
    for (let data of res) {
      if (data.yearly?.length > 2) {
        data.yearly.sort((a, b) => b.year - a.year);

        for (let yearly of data.yearly) {
          if (yearly.monthly?.length > 2) {
            yearly.monthly.sort((a, b) => a.month - b.month);
          }
        } // end of yearly loop
      }
    } // end of res loop
  }

  return res;
};
