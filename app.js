const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/database");

require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

// Rutas

// Puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server ${PORT} running`);
});

// Conexión a la base de datos
connectDB();
