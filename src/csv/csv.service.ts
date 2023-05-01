import { Injectable } from '@nestjs/common';
import { createObjectCsvStringifier, createObjectCsvWriter } from 'csv-writer';
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
      const row = { title };
      let task_amount = 0;

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

    const csvWriter = createObjectCsvWriter({
      path: `${getMonthName(monthIndex)}-evidence.csv`,
      header: [
        { id: 'title', title: 'Title' },
        ...dates.map((date) => ({
          id: date,
          title: date,
        })),
        { id: 'task_amount', title: 'Amount per task row' },
      ],
    });

    csvWriter.writeRecords(rows);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'title', title: 'Title' },
        ...dates.map((date) => ({
          id: date,
          title: date,
        })),
        { id: 'task_amount', title: 'Amount per task row' },
      ],
    });

    const csvContent =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(rows);
    const blob = new Blob([csvContent], { type: 'text/csv' });

    return blob;

    // const writable = new Writable();
    // const chunks: Uint8Array[] = [];

    // writable._write = (chunk, encoding, next) => {
    //   chunks.push(chunk);
    //   next();
    // };

    // writable.on('finish', () => {
    //   const blob = new Blob(chunks, { type: 'text/csv' });
    //   // Do something with the blob
    // });

    // await csvWriter.writeRecords(records).pipe(writable);

    //   const csvContent = await csvWriter.writeToString(rows);
    //   const blob = new Blob([csvContent], { type: 'text/csv' });

    //   return blob;
    // };

    //   csvWriter.writeRecords(rows);
  };
}
