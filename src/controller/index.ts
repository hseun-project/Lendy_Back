import express from 'express';
import auth from './auth';
import open from './open';
import user from './user';
import apply from './apply';

const app = express();

app.get('/health', (_, res) => {
  res.status(200).json({
    message: 'OK'
  });
});
app.use('/auth', auth);
app.use('/open', open);
app.use('/user', user);
app.use('/apply', apply);

export default app;
