import express, { Request, Response } from 'express';
import { getApiLimit } from '../middleware/limit';
import open from '../service/open';

const app = express();

app.get('/identification/:email', getApiLimit, (req: Request, res: Response) => {
  open.identificationUrl(req, res);
});
app.get('/', getApiLimit, (req: Request, res: Response) => {
  open.openCode(req, res);
});

export default app;
