import express from "express";
import spacex from "./routes/routes";

const app = express();

app.use(express.static("public"));

app.use("/home", spacex);

const port = process.env.PORT || 3030;
app.listen(port, ()=> {
  console.info(`Running on ${port}...`);
});