import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

const PORT = 3003;

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});
app.get('/bmi', (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  if (!height || !weight) {
    throw new Error('malformatted parameters');
  }
  try {
    res.json({
      height: height,
      weight: weight,
      bmi: calculateBmi(Number(height), Number(weight)),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.json({
        error: error.message,
      });
    }
  }
});

app.post('/exercises', (req, res) => {
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.json({
      error: 'parameters missing',
    });
  }

  if (!target || isNaN(Number(target))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  const typed_daily_exercises = daily_exercises as number[];

  typed_daily_exercises.forEach((exercise) => {
    if (isNaN(Number(exercise))) {
      return res.status(400).send({ error: 'malformatted parameters' });
    }
    return;
  });

  const result = calculateExercises(Number(target), typed_daily_exercises);
  return res.send({ result });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
