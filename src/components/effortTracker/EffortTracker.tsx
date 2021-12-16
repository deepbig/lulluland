import React, { useEffect, useState } from "react";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";

import styles from "./EffortTracker.module.css";

interface SheetInfo {
  spreadsheet_id: string;
  client_email: string;
  private_key: string;
}

const sheetInfo: SheetInfo = {
  spreadsheet_id: process.env.REACT_APP_SPREADSHEET_ID
    ? process.env.REACT_APP_SPREADSHEET_ID
    : "",
  client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL
    ? process.env.REACT_APP_GOOGLE_CLIENT_EMAIL
    : "",
  private_key: process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY
    ? process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : "",
};

export default function EffortTracker() {
  const [state, setState] = useState<GoogleSpreadsheetRow[]>();
  useEffect(() => {
    console.log(sheetInfo);
    const doc = new GoogleSpreadsheet(sheetInfo.spreadsheet_id);
    async function getSheetData() {
      await doc.useServiceAccountAuth({
        client_email: sheetInfo.client_email,
        private_key: sheetInfo.private_key,
      });

      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];
      const rows: GoogleSpreadsheetRow[] = await sheet.getRows();
      setState(rows);
    }
    getSheetData();
  }, []);

  return (
    <div className={styles.graph}>
      <ul className={styles.months}>
        <li>Jan</li>
        <li>Feb</li>
        <li>Mar</li>
        <li>Apr</li>
        <li>May</li>
        <li>Jun</li>
        <li>Jul</li>
        <li>Aug</li>
        <li>Sep</li>
        <li>Oct</li>
        <li>Nov</li>
        <li>Dec</li>
      </ul>
      <ul className={styles.days}>
        <li>Sun</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
      </ul>

      <ul className={styles.squares}>
        {state?.map((data, i) => (
          <li
            key={i}
            data-toggle="tooltip"
            data-placement="bottom"
            data-animation="false"
            title={data.date}
            data-level={data.level}
          ></li>
        ))}
      </ul>
    </div>
  );
}
