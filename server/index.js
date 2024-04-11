import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/itp-movie", routes);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>{
      console.log('MongoDB connected')
      server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    } )
    .catch(err =>{
      console.error(err);
      process.exit(1);
    })
