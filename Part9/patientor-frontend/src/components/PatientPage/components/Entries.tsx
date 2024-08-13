import {
  Diagnosis,
  Entry,
  HealthCheckRating,
  Patient,
} from '../../../types';

import {
  Favorite,
  LocalHospital,
  MedicalServices,
  Work,
} from '@mui/icons-material';

interface EntryProps {
  patient: Patient;
  diagnoses: Diagnosis[];
}

const EntriesList = (props: EntryProps) => {
  const patient = props.patient;
  const diagnoses = props.diagnoses;

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };


  type healthCheckType = 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital';
  const typeIcon = (type: healthCheckType): JSX.Element => {
    switch (type) {
      case 'HealthCheck':
        return <MedicalServices />;
      case 'OccupationalHealthcare':
        return <Work />;
      case 'Hospital':
        return <LocalHospital />;
      default:
        return assertNever(type);
    }
  };

  const healthRating = (rating: HealthCheckRating) => {
    switch (rating) {
      case HealthCheckRating.Healthy:
        return <Favorite style={{ color: 'green' }} />;
      case HealthCheckRating.Lowrisk:
        return <Favorite style={{ color: 'yellow' }} />;
      case HealthCheckRating.HighRisk:
        return <Favorite style={{ color: 'orange' }} />;
      case HealthCheckRating.CriticalRisk:
        return <Favorite style={{ color: 'red' }} />;
      default:
        return assertNever(rating);
    }
  };

  const entryCss = {
    border: '2px solid',
    marginBlock: '10px',
    borderRadius: '5px',
    padding: '5px',
  };

  return (
    <div>
      {patient.entries.length > 0 && <h3>entries</h3>}
      {patient.entries &&
        patient.entries.map((entry: Entry) => {
          return (
            <div key={entry.id} style={entryCss}>
              <div>
                {entry.date} {typeIcon(entry.type)}
              </div>
              <div>{entry.description}</div>
              {entry.type === 'HealthCheck' && (
                <div>{healthRating(entry.healthCheckRating)}</div>
              )}
              <div style={{ margin: '10px' }}>
                {entry.diagnosisCodes &&
                  entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      {`${code} ${diagnoses.find((d: Diagnosis) => d.code === code)?.name} `}
                    </li>
                  ))}
              </div>
              <div>{`diagnose by ${entry.specialist}`}</div>
            </div>
          );
        })}
    </div>
  );
};

export default EntriesList;
