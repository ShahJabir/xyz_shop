import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 8080;
app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.set("trust proxy", 1);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: express.Request & { user?: unknown }) => (req.user ? 1000 : 100), // Limit each user to 1000 requests and non user to 100 per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: express.Request) => req.ip, // Use the IP address as the key
});
app.use(limiter);

app.get('/gateway-health', (_, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});
app.use("/", proxy("http://localhost:8230"));

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
