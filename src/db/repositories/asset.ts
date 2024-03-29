import db from '..';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  setDoc,
  runTransaction,
} from 'firebase/firestore';
import {
  AssetData,
  AssetTypes,
  IncomeExpensesData,
  StockHistoryData,
} from 'types';
import { currentDateToId } from 'lib';
const SUBCOLLECTION_ASSET_SUMMARIES = 'asset_summaries';
const SUBCOLLECTION_STOCK_HISTORIES = 'stock_histories';
const COLLECTION_NAME = 'users';
// TIME_ZONE = KST

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

export const stockHistories = async (uid: string): Promise<Array<any>> => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);

  const q = query(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_STOCK_HISTORIES),
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

export const updateAssetSummary = async (
  uid: string,
  values: AssetData
): Promise<AssetData> => {
  // if id is not exist, create new one
  try {
    const updatedValues = {
      date: serverTimestamp(),
      assets: values.assets,
      stocks: values.stocks,
      incomes: values.incomes,
      expenses: values.expenses,
    };
    if (!values.id) {
      const id = currentDateToId();
      await setDoc(
        doc(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES, id),
        { ...updatedValues }
      );
      return {
        ...updatedValues,
        date: Timestamp.fromDate(new Date()),
        id: id,
      } as AssetData;
    } else {
      await updateDoc(
        doc(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES, values.id),
        { ...updatedValues }
      );
      return {
        ...updatedValues,
        date: Timestamp.fromDate(new Date()),
        id: values.id,
      } as AssetData;
    }
  } catch (error) {
    throw error;
  }
};

export const updateAssetSummaries = async (
  uid: string,
  assetId: string,
  type: 'incomes' | 'expenses',
  values: IncomeExpensesData[],
  cashChange: number
) => {
  try {
    const data: Array<any> = [];
    await runTransaction(db, async (transaction) => {
      const yearMonth = assetId.split('-');
      const assetDate = Timestamp.fromDate(
        new Date(parseInt(yearMonth[0]), parseInt(yearMonth[1]) - 1, 1)
      );

      const q = query(
        collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES),
        where('date', '>=', assetDate),
        orderBy('date')
      );

      const assetsSnapshot = await getDocs(q);

      assetsSnapshot.docs.forEach((_data) => {
        let newData = { ..._data.data() };

        if (assetId === _data.id) {
          newData[type] = values;
        } else {
          if (type === 'incomes') {
            newData.assets[AssetTypes.CASH] += cashChange;
          } else {
            newData.assets[AssetTypes.CASH] -= cashChange;
          }
        }

        data.push({
          id: _data.id,
          ...newData,
        });

        transaction.update(_data.ref, { ...newData });
      }); // end of assetSummaries loop
    }); // end of transaction

    return data as Array<AssetData>;
  } catch (error) {
    throw error;
  }
};

export const deletePastIncomeExpenseItem = async (
  uid: string,
  type: 'incomes' | 'expenses',
  value: IncomeExpensesData
): Promise<Array<AssetData>> => {
  try {
    const data: Array<any> = [];
    await runTransaction(db, async (transaction) => {
      // Step 1. get all assetSummary after the month of the deleted item
      const valueDate = value.date.toDate();
      const valueId = `${valueDate.getFullYear()}-${valueDate.getMonth() + 1}`;

      const q = query(
        collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_ASSET_SUMMARIES),
        where('date', '>=', value.date),
        orderBy('date')
      );

      const assetsSnapshot = await getDocs(q);

      // Step 2. update asset value of all assetSummary after the month of the deleted item
      assetsSnapshot.docs.forEach((_data) => {
        let newData = { ..._data.data() };

        if (valueId === _data.id) {
          // Step 3. delete selected item
          newData[type] = newData[type].filter(
            (item: IncomeExpensesData) =>
              JSON.stringify(item) !== JSON.stringify(value)
          );
        } else {
          if (type === 'incomes') {
            newData.assets[AssetTypes.CASH] -= value.amount;
          } else {
            newData.assets[AssetTypes.CASH] += value.amount;
          }
        }

        data.push({
          id: _data.id,
          ...newData,
        });

        transaction.update(_data.ref, { ...newData });
      }); // end of assetSummaries loop
    }); // end of transaction

    return data as Array<AssetData>;
  } catch (error) {
    throw error;
  }
};

export const getAllStockHistories = async (
  uid: string
): Promise<StockHistoryData[]> => {
  const stockHistorySnapshot = await getDocs(
    collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_STOCK_HISTORIES)
  );
  const data: Array<any> = [];

  stockHistorySnapshot.docs.forEach((_data) => {
    data.push({
      id: _data.id, // because id field in separate function in firestore
      ..._data.data(), // the remaining fields
    });
  });

  return data as Array<StockHistoryData>;
};

export const createStockHistory = async (
  uid: string,
  stockHistory: StockHistoryData,
  assetSummary: AssetData
): Promise<StockHistoryData> => {
  try {
    const batch = writeBatch(db);

    // Step 1. stock history 추가
    const stockHistoryRef = doc(
      collection(db, COLLECTION_NAME, uid, SUBCOLLECTION_STOCK_HISTORIES)
    );

    const addedStockHistory = {
      ...stockHistory,
      date: Timestamp.fromDate(new Date(stockHistory.date)),
      id: stockHistoryRef.id,
    };
    batch.set(stockHistoryRef, addedStockHistory);

    const assetSummaryRef = doc(
      db,
      COLLECTION_NAME,
      uid,
      SUBCOLLECTION_ASSET_SUMMARIES,
      assetSummary.id
    );

    // Step 2. asset summary 업데이트
    batch.update(assetSummaryRef, {
      ...assetSummary,
    });

    await batch.commit();

    return addedStockHistory;
  } catch (error) {
    throw error;
  }
};
