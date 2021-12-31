import db from "..";
import { collection, getDocs, query, where } from 'firebase/firestore';
const COLLECTION_NAME = "categories";

// retrieve current (5 recent records) performances
export const selectedSubcategories = async (category: string): Promise<Array<string>> => {
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    let data: Array<string> = [];

    querySnapshot.forEach((_data) => {
        data = _data.data().subcategories
    })
    // return and convert back it array of activity
    return data as Array<string>;
}
