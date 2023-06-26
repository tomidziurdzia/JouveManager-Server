import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";

const app: Application = express();
app.use(express.json());
dotenv.config();

// Call DB
connectDB();

// Configurate CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      // El origen del request esta permitido
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

//Routing
app.use("/api/users", userRoutes);

const port = process.env.PORT || 4000;
app.listen(() => {
  console.log(`Server running on port ${port}`);
});
