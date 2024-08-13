import {
  Diagnosis,
  Discharge,
  EntryWithoutId,
  Gender,
  HealthCheckRating,
  NewPatient,
  SickLeave,
} from './types';

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newPatientEntry: NewPatient = {
      name: parseString(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: [],
    };
    return newPatientEntry;
  }

  throw new Error('Something went wrong: Fields are missing');
};

const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'type' in object &&
    'diagnosisCodes' in object
  ) {
    const newEntry: EntryWithoutId = {
      description: parseString(object.description),
      date: parseDate(object.date),
      specialist: parseString(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
      type: parseType(object.type),
    };

    switch (object.type) {
      case 'HealthCheck':
        if ('healthCheckRating' in object) {
          const healthCheckEntry = {
            ...newEntry,
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
          return healthCheckEntry;
        }
        throw new Error('no healthCheckRating or missing');

      case 'Hospital':
        if ('discharge' in object) {
          const hospitalEntry = {
            ...newEntry,
            discharge: parseDischarge(object.discharge),
          };
          return hospitalEntry;
        }
        throw new Error('no Discharge or missing');

      case 'OccupationalHealthcare':
        if ('employerName' in object) {
          const noSickLeaveEntry = {
            ...newEntry,
            employerName: parseString(object.employerName),
          };

          if ('sickLeave' in object) {
            const sickLeaveEntry = {
              ...noSickLeaveEntry,
              sickLeave: parseSickLeave(object.sickLeave),
            };
            return sickLeaveEntry;
          }
          return noSickLeaveEntry;
        }
        throw new Error('no healthCheckRating or missing');
    }

    return newEntry;
  }
  throw new Error('something went wrong: entryFields are missing');
};

//Guards
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const isSickLeave = (obj: unknown): obj is SickLeave => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'startDate' in obj &&
    'endDate' in obj &&
    isDate(parseDate(obj.startDate)) &&
    isDate(parseDate(obj.endDate))
  );
};

const isDischarge = (obj: unknown): obj is Discharge => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'date' in obj &&
    'criteria' in obj &&
    isDate(parseDate(obj.date)) &&
    isString(obj.criteria)
  );
};


//Parsers
const parseString = (string: unknown): string => {
  if (!isString(string)) {
    throw new Error('Incorrect or missing String');
  }
  return string;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || !isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing Sickleave dates');
  }
  return sickLeave;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge dates or criteria');
  }
  return discharge;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseHealthCheckRating = (healthCheckRating: unknown) => {
  if (
    healthCheckRating === undefined ||
    typeof healthCheckRating !== 'number' ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error('HealthCheckRating incorrect or missing');
  }
  return healthCheckRating;
};

type types = 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare';
const parseType = (type: unknown): types => {
  if (!isString(type)) {
    throw new Error('Incorrect or missing type');
  }
  if (
    type === 'Hospital' ||
    type === 'HealthCheck' ||
    type === 'OccupationalHealthcare'
  ) {
    return type;
  }
  throw new Error('Incorrect or missing type');
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

export default {
  toNewPatient,
  toNewEntry,
};
