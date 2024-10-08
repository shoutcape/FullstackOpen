export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'Lowrisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}


export type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T,K> : never;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export type Entry = BaseEntry | HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeave;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface Discharge {
    date: string;
    criteria: string;
  }

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: Discharge
}


export type NewPatient = Omit<Patient, 'id'>;

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;