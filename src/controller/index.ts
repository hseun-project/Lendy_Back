import express from 'express';
import auth from './auth';
import open from './open';

const app = express();

app.get('/health', (_, res) => {
  res.status(200).json({
    message: 'OK'
  });
});
app.use('/auth', auth);
app.use('/open', open);

export default app;
