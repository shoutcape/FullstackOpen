import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import {
  Diagnosis,
  Entry,
  EntryWithoutId,
  Patient,
} from '../../../types';
import patientService from '../../../services/patients';
import axios from 'axios';

interface EntryFormProps {
  patient: Patient;
  diagnoses: Diagnosis[];
  updatePatient: () => void;
  setNotify: (notification: string) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EntryForm = (props: EntryFormProps) => {
  const [entryFormType, setEntryFormType] = useState<string>('');
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<
    string[]
  >([]);
  const [healthRating, setHealthRating] = useState<string>('');

  const entryFormCss = {
    marginBlock: '10px',
    border: 'dashed 2px',
    padding: '10px',
  };

  const textFieldProps = {
    fullWidth: true,
    margin: 'normal' as const,
    size: 'small' as const,
    variant: 'standard' as const,
    InputLabelProps: {
      shrink: true,
    },
  };

  const timeoutNotification = (message: string) => {
    setTimeout(() => {
      props.setNotify('');
    }, 5000);
    props.setNotify(message);
  };

  const handleTypeChange = (event: SelectChangeEvent): void => {
    event.preventDefault();
    setEntryFormType(event.target.value as string);
  };

  const handleHealthRating = (event: SelectChangeEvent): void => {
    setHealthRating(event.target.value);
  };

  const handleDiagnosisChange = (
    event: SelectChangeEvent<typeof selectedDiagnosisCodes>,
  ): void => {
    const {
      target: { value },
    } = event;
    setSelectedDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSubmit = async (
    event: React.BaseSyntheticEvent,
  ): Promise<void> => {
    event.preventDefault();
    const target = event.target;
    const baseEntry = {
      date: target.Date.value,
      specialist: target.Specialist.value,
      diagnosisCodes: selectedDiagnosisCodes,
      description: target.Description.value,
    };

    let newEntry: EntryWithoutId | null = null;
    switch (entryFormType) {
      case 'Hospital':
        newEntry = {
          ...baseEntry,
          type: 'Hospital',
          discharge: {
            date: target.dischargeDate.value,
            criteria: target.dischargeCriteria.value,
          },
        };
        break;

      case 'OccupationalHealthcare':
        newEntry = {
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName: target.employerName.value,
        };
        if (target.startDate.value && target.endDate.value) {
          newEntry.sickLeave = {
            startDate: target.startDate.value,
            endDate: target.endDate.value,
          };
        }
        break;

      case 'Healthcheck':
        newEntry = {
          ...baseEntry,
          type: 'HealthCheck',
          healthCheckRating: isNaN(Number(healthRating))
            ? 0
            : Number(healthRating),
        };
        break;

      default:
        throw new Error('No Entryformtype recognized');
    }

    try {
      await patientService.addEntry(props.patient.id, newEntry as Entry);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        timeoutNotification(error.response?.data);
      }
    }

    setSelectedDiagnosisCodes([]);
    setEntryFormType('');
    props.updatePatient();
  };

  return (
    <div style={entryFormCss}>
      {!entryFormType && (
        <div>
          <FormControl fullWidth>
            <InputLabel id='entry-type-label'>Select Entry Type</InputLabel>
            <Select
              placeholder='Select Entry Type'
              label='Select Entry Type'
              labelId='entry-type-label'
              id='entry-type'
              value={entryFormType}
              onChange={handleTypeChange}
            >
              <MenuItem id='Hospital' value='Hospital'>
                Hospital Entry
              </MenuItem>
              <MenuItem
                id='OccupationalHealthcare'
                value='OccupationalHealthcare'
              >
                OccupationalHealthcare Entry
              </MenuItem>
              <MenuItem id='Healthcheck' value='Healthcheck'>
                Healthcheck Entry
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
      {entryFormType && (
        <form onSubmit={handleSubmit}>
          <h2>{`New ${entryFormType} entry`}</h2>

          <TextField
            {...textFieldProps}
            id='Description'
            type='text'
            label='Description'
          />
          <TextField {...textFieldProps} id='Date' type='date' label='Date' />
          <TextField
            {...textFieldProps}
            id='Specialist'
            type='text'
            label='Specialist'
          />
          {entryFormType === 'Healthcheck' && (
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel id='healthRating'>Select Health Rating</InputLabel>
              <Select
                placeholder='Select Health Rating'
                label='Select Health Rating'
                labelId='health-rating-label'
                id='healthCheckRating'
                value={healthRating}
                onChange={handleHealthRating}
              >
                <MenuItem id='health-rating0' value='0'>
                  0
                </MenuItem>
                <MenuItem id='health-rating1' value='1'>
                  1
                </MenuItem>
                <MenuItem id='health-rating2' value='2'>
                  2
                </MenuItem>
                <MenuItem id='health-rating3' value='3'>
                  3
                </MenuItem>
              </Select>
            </FormControl>
          )}
          {entryFormType === 'OccupationalHealthcare' && (
            <div>
              <TextField
                {...textFieldProps}
                id='employerName'
                type='text'
                label='Employer Name'
              />
              <TextField
                {...textFieldProps}
                id='startDate'
                type='date'
                label='Sick leave start Date'
              />
              <TextField
                {...textFieldProps}
                id='endDate'
                type='date'
                label='Sick leave end Date'
              />
            </div>
          )}
          {entryFormType === 'Hospital' && (
            <div>
              <TextField
                {...textFieldProps}
                id='dischargeDate'
                type='date'
                label='Discharge date'
              />
              <TextField
                {...textFieldProps}
                id='dischargeCriteria'
                type='text'
                label='Discharge criteria'
              />
            </div>
          )}
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id='diagnosisCodes'>Diagnosis codes</InputLabel>
            <Select
              labelId='diagnosisCodes'
              id='diagnosisCodes'
              multiple
              value={selectedDiagnosisCodes}
              onChange={handleDiagnosisChange}
              input={<OutlinedInput label='Diagnosis codes' />}
              MenuProps={MenuProps}
            >
              {props.diagnoses.map((diagnosis) => (
                <MenuItem key={diagnosis.code} value={diagnosis.code}>
                  {diagnosis.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display={'flex'} justifyContent={'space-between'}>
            <Button
              type='reset'
              onClick={() => setEntryFormType('')}
              variant='contained'
              color='error'
              size='large'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              slot='end'
              variant='contained'
              color='inherit'
              size='large'
            >
              Add
            </Button>
          </Box>
        </form>
      )}
    </div>
  );
};

export default EntryForm;
