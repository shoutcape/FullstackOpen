export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type Patient = Omit<PatientData, 'ssn'>;

export type NewPatient = Omit<PatientData, 'id'>;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

//{
//    "id": "d2773336-f723-11e9-8f0b-362b9e155667",
//    "name": "John McClane",
//    "dateOfBirth": "1986-07-09",
//    "ssn": "090786-122X",
//    "gender": "male",
//    "occupation": "New york city cop"
//},
