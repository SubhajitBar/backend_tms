import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import ErrorMiddleware from './middlewares/Error.js';
import userRoutes from './routes/userRoutes.js';
import cors from "cors";

//dotenv path
config({
    path: "./config/config.env"
});
const app = express();

// cookie parser and json data
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use("/api/v1", userRoutes);

export default app;

app.get("/", (req, res) => res.send(
    `<h1>Site is Working. Click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
    )
);

app.use(ErrorMiddleware);