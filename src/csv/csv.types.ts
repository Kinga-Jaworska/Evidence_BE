export type CSVData = {
  project_name: string;
  start_time: string;
  duration: string;
};

export type AmountsPerDay = {
  [key: string]: string;
};

export type CSVOverallData = {
  user_id: string;
  project_name: string;
  duration: string;
};
