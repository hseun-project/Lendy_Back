import express from 'express';
import auth from './auth';

const app = express();

app.get('/health', (_, res) => {
  res.status(200).json({
    message: 'OK'
  });
});
app.use('/auth', auth);

export default app;
