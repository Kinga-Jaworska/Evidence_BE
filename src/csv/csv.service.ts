import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import { AmountsPerDay, CSVData } from './csv.types';
import { generateListOfDates, getMonthName } from './csv.utils';

@Injectable()
export class CSVService {
  generateCSV = async (
    data: CSVData[],
    amountsPerDay: AmountsPerDay,
    monthIndex: number,
  ) => {
    const dates = generateListOfDates(monthIndex);

    let rowsum = { sum: {} };
    data = { ...data, ...rowsum };

    // Create rows per each task
    let overall_amount = 0;
    let rows = Object.keys(data).map((title) => {
      const time_slots = data[title];
      const { description } = time_slots;
      const row = { title };
      let task_amount = 0;

      row['description'] = description;

      dates.forEach((date) => {
        row[date] = time_slots[date] ? `${time_slots[date]}` : '';
        task_amount += Number(time_slots[date]) || 0;

        row['task_amount'] = task_amount;

        if (title === 'sum') {
          row[date] = amountsPerDay[date];
          row['task_amount'] = overall_amount;
        }
      });

      overall_amount += task_amount;
      return row;
    });

    const path = `${getMonthName(monthIndex)}-evidence.csv`;
    const csvWriter = createObjectCsvWriter({
      path,
      header: [
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        ...dates.map((date) => ({
          id: date,
          title: date,
        })),
        { id: 'task_amount', title: 'Amount per task row' },
      ],
    });

    csvWriter.writeRecords(rows);
    return path;
  };

  generateOverallCSV = async (data) => {
    const path = `TEST-overall-evidence.csv`;

    const columnTitles = Array.from(
      new Set(Object.values(data).flatMap(Object.keys)),
    );

    const csvWriter = createObjectCsvWriter({
      path,
      header: [
        { id: 'row', title: 'User' }, // Column for row labels
        ...columnTitles.map((title) => ({ id: title, title })), // Columns for data titles
      ],
    });

    const records = Object.entries(data).map(([row, rowData]) => {
      const record: { [key: string]: string | number } = { row };
      columnTitles.forEach((title) => {
        record[title] = rowData[title] || '';
      });
      return record;
    });

    csvWriter
      .writeRecords(records)
      .then(() => console.log('CSV file has been written successfully.'))
      .catch((error) => console.error('Error writing CSV file:', error));
    return path;
  };
}
