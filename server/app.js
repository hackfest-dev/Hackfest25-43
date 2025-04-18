import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();