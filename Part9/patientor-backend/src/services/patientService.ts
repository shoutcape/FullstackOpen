import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { NewPatient, Patient, PatientData } from '../../types';

const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = (patient: NewPatient): PatientData => {
  const id: string = uuid();
  console.log(id);
  const newPatientEntry = {
    id: id,
    ...patient
  };

  return newPatientEntry;
};

export default {
  getPatients,
  addPatient,
};
