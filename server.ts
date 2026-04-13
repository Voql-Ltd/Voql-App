import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });

import cors from "cors";
import express, { Express } from "express";
import connectDB from "./src/configs/database";
import { connectRedis } from './src/configs/redis';
import routes from "./src/routes/api";

const app: Express = express();

app.use(cors({
  origin:'*'
  // origin: ["https://www.use-webbi.com", "https://use-webbi.com", "https://use-webbi.vercel.app"]
}));

app.use(express.urlencoded({ limit: "1000000mb", extended: true }));
app.use(express.json({ limit: "1000000mb" }));

const PORT: number = parseInt(process.env.PORT || "5001", 10);


const startServer = async () => {
  try {
    
    await connectDB();
    await connectRedis();
  
    app.listen(PORT, () => {
      console.log(`Server now running on port ${PORT}`);
      routes(app);
    });
  } catch (error: any) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
