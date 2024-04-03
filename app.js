const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const app = express();
const port = 3000;

const v1Router = require("./routes/v1/index");
const file = fs.readFileSync("./api-docs.yaml", "utf-8");
const swaggerDocument = yaml.parse(file);

app.use(cors());
app.use(express.json());

app.use("/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/v1", v1Router);

// ERROR HANDLING MIDDLEWARE

// INTERNAL SERVER ERROR
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    err: err.message,
    data: null,
  });
});

// 404 ERROR
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    err: `Server not found on ${req.url}`,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
