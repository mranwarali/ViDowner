const express = require("express");
const cors = require("cors");
const requestIp = require("request-ip");
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const MONGO_CONNECT = process.env.MONGODB_URI;
const PORT_NO = "3030";

if (!MONGO_CONNECT) {
  console.error("MONGODB_URI is missing. Set it in server/.ev.");

  process.exit(1);
}

if (!/^mongodb(?:\+srv)?:\/\//.test(MONGO_CONNECT)) {
  console.error(
    'MONGODB_URI must start with "mongodb://" or "mongodb+srv://". Check server/.env.',
  );
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestIp.mw());

const User = require("./models/user");

const publicRoutes = require("./routes/public");

app.use((req, res, next) => {
  User.findOne({ ip: req.clientIp })
    .then((user) => {
      if (!user) {
        const useragent = req.headers["user-agent"];
        let parser = new UAParser(useragent);
        let parserResults = parser.getResult();
        console.log(parserResults);

        const newUser = new User({
          ip: req.clientIp,
          deviceInfo: parserResults,
          activity: [],
        });
        return newUser.save().then((result) => {
          User.findOne({ ip: req.clientIp }).then((user) => {
            req.users = user;
            next();
          });
        });
      } else {
        req.users = user;
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      next(new Error(err));
    });
});

app.use(publicRoutes);

mongoose
  .connect(MONGO_CONNECT)
  .then((result) => {
    app.listen(process.env.PORT || PORT_NO, () => {
      console.log(`Server Running On ${PORT_NO}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exitCode = 1;
  });
