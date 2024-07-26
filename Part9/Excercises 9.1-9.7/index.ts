import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

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
    res.json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
