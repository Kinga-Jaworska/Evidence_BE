import { mockedDataListApril } from 'src/mocked_data/csv-utils';
import { generateListOfDates, getMonthName } from './csv.utils';

describe('getMonthName', () => {
  it('should return the correct month name for a given index', () => {
    expect(getMonthName(1)).toBe('Styczen');
    expect(getMonthName(2)).toBe('Luty');
    expect(getMonthName(3)).toBe('Marzec');
    expect(getMonthName(4)).toBe('Kwiecien');
    expect(getMonthName(5)).toBe('Maj');
    expect(getMonthName(6)).toBe('Czerwiec');
    expect(getMonthName(7)).toBe('Lipiec');
    expect(getMonthName(8)).toBe('Sierpien');
    expect(getMonthName(9)).toBe('Wrzesien');
    expect(getMonthName(10)).toBe('Pazdziernik');
    expect(getMonthName(11)).toBe('Listopad');
    expect(getMonthName(12)).toBe('Grudzien');
    expect(getMonthName(13)).toBe('');
  });
});

describe('generateListOfDates', () => {
  it('should generate a list of dates for the given 30days month', () => {
    expect(generateListOfDates(4)).toEqual(mockedDataListApril);
  });
});
