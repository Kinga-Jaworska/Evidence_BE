import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import { AmountsPerDay, CSVData } from './csv.types';
import {
  changeDurationFormatToString,
  generateListOfDates,
  getMonthName,
} from './csv.utils';

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
    let rows = Object.keys(data).map((project_name) => {
      const time_slots = data[project_name];
      const { description } = time_slots;
      const row = { project_name };
      let task_amount = 0;

      row['description'] = description;

      dates.forEach((date) => {
        row[date] = time_slots[date] ? `${time_slots[date]}` : '';
        task_amount += Number(time_slots[date]) || 0;

        row['task_amount'] = changeDurationFormatToString(task_amount);

        if (project_name === 'sum') {
          row[date] = amountsPerDay[date]
            ? changeDurationFormatToString(+amountsPerDay[date])
            : amountsPerDay[date];
          row['task_amount'] = changeDurationFormatToString(overall_amount);
        }
      });

      overall_amount += task_amount;
      return row;
    });

    const path = `${getMonthName(monthIndex)}-evidence.csv`;
    const csvWriter = createObjectCsvWriter({
      path,
      header: [
        { id: 'project_name', title: 'Project name' },
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
    const path = `overall-report-evidence.csv`;

    const columnTitles = Array.from(
      new Set(Object.values(data).flatMap(Object.keys)),
    );

    const csvWriter = createObjectCsvWriter({
      path,
      header: [
        { id: 'row', title: 'User' },
        ...columnTitles.map((title) => ({
          id: title,
          title,
        })),
      ],
    });

    const records = Object.entries(data).map(([row, rowData]) => {
      const record: { [key: string]: string | number } = { row };
      columnTitles.forEach((project_name) => {
        record[project_name] = changeDurationFormatToString(
          rowData[project_name] || '',
        );
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
