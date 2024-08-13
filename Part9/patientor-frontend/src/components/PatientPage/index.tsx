import axios from 'axios';
import { apiBaseUrl } from '../../constants';
import { useEffect, useState } from 'react';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import { Diagnosis, Gender, Patient } from '../../types';
import { useParams } from 'react-router-dom';
import EntriesList from './components/Entries';
import EntryForm from './components/EntryForm';
import { Female, Male, Transgender } from '@mui/icons-material';
import { Alert } from '@mui/material';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | ''>('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [notify, setNotify] = useState<string>('');

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/patients/:id`);
    if (!id) {
      return;
    }
    const fetchPatientList = async () => {
      const patient = await patientService.getById(id);
      setPatient(patient);
    };

    const fetchDiagnoses = async () => {
      const foundDiagnoses = await diagnosesService.getAll();
      setDiagnoses(foundDiagnoses);
    };
    void fetchPatientList();
    void fetchDiagnoses();
  }, [id]);

  const updatePatient = async () => {
    if (id) {
      const updatedPatient = await patientService.getById(id);
      setPatient(updatedPatient);
    }
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const genderIcon = (gender: Gender): JSX.Element => {
    switch (gender) {
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      case Gender.Other:
        return <Transgender />;
      default:
        return assertNever(gender);
    }
  };

  return (
    <div>
      {patient && (
        <div>
          <h1>
            {patient.name} {genderIcon(patient.gender)}
          </h1>
          <br />
          <div>{`ssn: ${patient.ssn}`}</div>
          <div>{`occupation: ${patient.occupation}`}</div>
          {notify && <Alert severity='error'>{notify}</Alert>}
          <EntryForm
            updatePatient={updatePatient}
            patient={patient}
            diagnoses={diagnoses}
            setNotify={setNotify}
          />
          <EntriesList patient={patient} diagnoses={diagnoses} />
        </div>
      )}
    </div>
  );
};

export default PatientPage;
