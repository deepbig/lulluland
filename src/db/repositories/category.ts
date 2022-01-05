import db from "..";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CategoryData } from "types/types";

const COLLECTION_NAME = "categories";

// retrieve current (5 recent records) performances
export const selectedSubcategories = async (category: string): Promise<CategoryData> => {
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    let data: CategoryData = null;

    querySnapshot.forEach((_data) => {
        data = _data.data();
    })
    // return and convert back it array of activity
    return data as CategoryData;
}
