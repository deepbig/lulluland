import db from '..';
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  Timestamp,
  doc,
  where,
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import {
  ActivityAddFormData,
  ActivityData,
  ActivitySummaryData,
  ActivitySummaryMonthlyData,
  ActivitySummaryYearlyData,
} from 'types';
const ACTIVITY_SUBCOLLECTION_NAME = 'activities';
const ACTIVITY_SUMMARY_SUBCOLLECTION_NAME = 'activity_summaries';
const COLLECTION_NAME = 'users';

// retrieve selected year activities
export const selected = async (
  currentYear: number,
  uid: string
): Promise<Array<ActivityData>> => {
  const start = new Date(currentYear, 0, 1);
  const end = new Date(currentYear + 1, 0, 1);

  const q = query(
    collection(db, COLLECTION_NAME, uid, ACTIVITY_SUBCOLLECTION_NAME),
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
    collection(db, COLLECTION_NAME, uid, ACTIVITY_SUBCOLLECTION_NAME),
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
  const activitySummaryDocRef = doc(
    db,
    COLLECTION_NAME,
    values.uid,
    ACTIVITY_SUMMARY_SUBCOLLECTION_NAME,
    values.category
  );

  const newActivityRef = doc(
    collection(db, COLLECTION_NAME, values.uid, ACTIVITY_SUBCOLLECTION_NAME)
  );

  const year = +values.date.split('-')[0];
  const month = +values.date.split('-')[1];

  try {
    await runTransaction(db, async (transaction) => {
      // get activity summaries from db.
      const activitySummaryDoc = await transaction.get(activitySummaryDocRef);

      // create new activity.
      transaction.set(newActivityRef, {
        uid: values.uid,
        category: values.category,
        date: Timestamp.fromDate(new Date(values.date)),
        note: values.note,
        duration: +values.duration,
      });

      const newYearlySummary = {
        year: year,
        bestPractice: +values.duration,
        counts: 1,
        durations: +values.duration,
        monthly: [
          {
            month: month,
            bestPractice: +values.duration,
            counts: 1,
            durations: +values.duration,
          },
        ],
      };

      if (!activitySummaryDoc.exists()) {
        //
        // if not exist, create new one.
        transaction.set(activitySummaryDocRef, {
          yearly: [{ ...newYearlySummary }],
        });
      } else {
        // find and update existing one.
        const yearlyData = activitySummaryDoc.data().yearly;
        const yearIndex = yearlyData.findIndex(
          (data: ActivitySummaryYearlyData) => data.year === year
        );

        if (yearIndex !== -1) {
          const monthlyIndex = yearlyData[yearIndex].monthly.findIndex(
            (data: ActivitySummaryMonthlyData) => data.month === month
          );
          if (monthlyIndex !== -1) {
            // update monthly data.
            yearlyData[yearIndex].monthly[monthlyIndex].counts += 1;
            yearlyData[yearIndex].monthly[monthlyIndex].durations +=
              +values.duration;
            if (
              yearlyData[yearIndex].monthly[monthlyIndex].bestPractice <
              +values.duration
            ) {
              yearlyData[yearIndex].monthly[monthlyIndex].bestPractice =
                +values.duration;
            }
          } else {
            // create new monthly data.
            yearlyData[yearIndex].monthly.push({
              month: month,
              bestPractice: +values.duration,
              counts: 1,
              durations: +values.duration,
            });
          }
          // update yearly data.
          yearlyData[yearIndex].counts += 1;
          yearlyData[yearIndex].durations += +values.duration;
          if (yearlyData[yearIndex].bestPractice < +values.duration) {
            yearlyData[yearIndex].bestPractice = +values.duration;
          }
        } else {
          yearlyData.push(newYearlySummary);
        }

        console.log(yearlyData);

        transaction.update(activitySummaryDocRef, {
          yearly: yearlyData,
        });
      }
    });

    const newDocRef = doc(
      db,
      COLLECTION_NAME,
      values.uid,
      ACTIVITY_SUBCOLLECTION_NAME,
      newActivityRef.id
    );
    const docSnap = await getDoc(newDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ActivityData;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
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

export const remove = async (userId: string, activity: ActivityData) => {
  const activitySummaryDocRef = doc(
    db,
    COLLECTION_NAME,
    userId,
    ACTIVITY_SUMMARY_SUBCOLLECTION_NAME,
    activity.category
  );

  try {
    await runTransaction(db, async (transaction) => {
      // get activity summaries from db.
      const activitySummaryDoc = await transaction.get(activitySummaryDocRef);

      const year = +activity.date.toDate().getFullYear();
      const month = +activity.date.toDate().getMonth() + 1;

      if (activitySummaryDoc.exists()) {
        const yearlyData = activitySummaryDoc.data().yearly;

        const yearlyIndex = yearlyData.findIndex(
          (data: ActivitySummaryYearlyData) => data.year === year
        );

        if (yearlyIndex !== -1) {
          const monthlyIndex = yearlyData[yearlyIndex].monthly.findIndex(
            (data: ActivitySummaryMonthlyData) => data.month === month
          );
          if (monthlyIndex !== -1) {
            // update monthly data.
            yearlyData[yearlyIndex].monthly[monthlyIndex].counts -= 1;
            yearlyData[yearlyIndex].monthly[monthlyIndex].durations -=
              +activity.duration;
            if (
              yearlyData[yearlyIndex].monthly[monthlyIndex].bestPractice ===
              +activity.duration
            ) {
              // TODO - find max value from activities and replace the monthly best practice value.
            }

            // update yearly data.
            yearlyData[yearlyIndex].counts -= 1;
            yearlyData[yearlyIndex].durations -= +activity.duration;
            if (yearlyData[yearlyIndex].bestPractice === +activity.duration) {
              yearlyData[yearlyIndex].bestPractice = Math.max(
                ...yearlyData[yearlyIndex].monthly.map(
                  (data: ActivitySummaryMonthlyData) => data.bestPractice
                )
              );
            }

            transaction.update(activitySummaryDocRef, {
              yearly: yearlyData,
            });
          } // end of monthlyIndex
        } // end of yearlyIndex
      } // end of activitySummaryDoc.exists()

      // delete activity.
      const activityRef = doc(
        db,
        COLLECTION_NAME,
        userId,
        ACTIVITY_SUBCOLLECTION_NAME,
        activity.id
      );
      transaction.delete(activityRef);
    });
  } catch (e) {
    throw e;
  }
};

export const fetchAllActivitySummaries = async (
  uid: string
): Promise<Array<ActivitySummaryData>> => {
  const q = query(
    collection(db, COLLECTION_NAME, uid, ACTIVITY_SUMMARY_SUBCOLLECTION_NAME)
  );

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
