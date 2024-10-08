import express from 'express';
import diagnosisRouter from './src/routes/diagnoses';
import patientRouter from './src/routes/patients';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  console.log('testing ping');
  return res.send('pong');
});

//endpoints
app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);
app.use('/api/patients/:id', patientRouter);
app.use('/api/patients/:id/entries', patientRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
