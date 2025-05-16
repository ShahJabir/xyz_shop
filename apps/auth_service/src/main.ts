/* eslint-disable @nx/enforce-module-boundaries */

import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8230;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(errorMiddleware);

app.get('/', (_, res) => {
  res.send({ message: 'Hello API' });
});


const server = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

server.on('error', (err) => {
  console.error(err);
});
