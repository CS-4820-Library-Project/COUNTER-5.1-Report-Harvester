export type AppSettings = {
  passwordSettings: PasswordSettings;
  directories: DirectorySettings;
  request: RequestSettings;
};

export type RequestSettings = {
  requestInterval: number;
  requestTimeout: number;
  concurrentReports: number;
  concurrentVendors: number;
};

export type DirectorySettings = {
  mainDirectory: string;
  customDirectory: string;
  vendorsDirectory: string;
  exportDirectory: string;
  dbDirectory: string;
};

export type PasswordSettings = {
  isProtected: false;
  password: string;
};

export type UserDirectories = {
  data: string;
  vendors: string;
  search: string;
  main: string;
  custom: string;
  logs: string;
};

export type Auth = {
  password: string;
};
