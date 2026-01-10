// index.js
import express from "express";
import cors from "cors";
import routerapiv1 from "#routes/index.js";

const app = express();
const port = process.env.PORT || "9001";

app.use(cors());
app.use(express.json());
app.use("/api/v1", routerapiv1);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
