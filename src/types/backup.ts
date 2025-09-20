export type BackupFormat = 'csv' | 'json';
export type BackupType = 'all' | 'incomes' | 'expenses';
export type BackupPeriod =
    | 'all_time'
    | 'last_week'
    | 'last_month'
    | 'last_year'
    | 'custom';
export type BackupCustomPeriod = {
    startDate: Date;
    endDate: Date;
};
