import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { Entry, EntryWithoutId, NewPatient, Patient } from '../../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientById = (id: string): Patient | undefined => {
  const found = patients.find((patient) => patient.id === id);
  return found;
};

const addPatient = (patient: NewPatient): Patient => {
  const id: string = uuid();
  const newPatientEntry = {
    id: id,
    ...patient,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addNewEntry = (patientId: string,entry: EntryWithoutId): Entry => {
  const id: string = uuid();
  const patient = patients.find((p) => p.id == patientId);
  const newEntry = {
    ...entry,
    id: id,
  };
  if (!patient) {
    throw new Error('no patient found to make a new entry');
  }

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  addPatient,
  getPatientById,
  addNewEntry
};
