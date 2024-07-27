import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  console.log('testing ping');
  return res.send('pong');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
