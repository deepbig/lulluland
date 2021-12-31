import db from "..";
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { PerformanceData } from 'types/types';
const COLLECTION_NAME = "performances";

// retrieve current (5 recent records) performances
export const selectedCurrentFive = async (subcategories: Array<string>): Promise<Array<PerformanceData[]>> => {

    const data: Array<any> = [];
    let promise = new Promise<void>((resolve, reject) => {
        subcategories.forEach(async (subcategory, index, array) => {
            const q = query(collection(db, COLLECTION_NAME), where("category", "==", "Workout"),
                where("subcategory", "==", subcategory), orderBy("date", "desc"), limit(5));
            const PerformancesSnapshot = await getDocs(q);
            const subData: Array<any> = [];

            PerformancesSnapshot.docs.forEach((_data) => {
                subData.push({
                    id: _data.id, // because id field in separate function in firestore
                    ..._data.data(), // the remaining fields
                });
            });
            data.push(subData);
            if (index === array.length - 1) resolve();
        })
    });

    await promise.then();
    // return and convert back it array of activity
    return data as Array<PerformanceData[]>;
}
