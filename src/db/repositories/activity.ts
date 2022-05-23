import db from "..";
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { ActivityData } from 'types';
const COLLECTION_NAME = "activities";

// retrieve selected year activities
export const selected = async (currentYear: number): Promise<Array<ActivityData>> => {
    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear + 1, 0, 1);

    const q = query(collection(db, COLLECTION_NAME), where("category", "==", "Workout"),
        where("date", ">=", start), where("date", "<", end), orderBy("date"));

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
}

// retrieve current (1 year) activities
export const current = async (): Promise<Array<ActivityData>> => {
    const end = new Date();
    const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

    const q = query(collection(db, COLLECTION_NAME), where("date", ">=", start),
        where("date", "<", end), orderBy("date"));

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
}


// create an activity
export const create = async (activity: ActivityData): Promise<ActivityData> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), activity);

    // return new created activity
    return {
        id: docRef.id,
        ...activity,
    } as ActivityData;
}

// update an activity
export const update = async (id: string, activity: ActivityData): Promise<ActivityData> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...activity });

    return {
        id: id,
        ...activity,
    } as ActivityData;
};

export const remove = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
}
