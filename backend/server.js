import express from "express";
import bcrypt from "bcrypt";
import pg from "pg";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = parseInt(process.env.APP_PORT);

app.use(cors());
app.use(express.json());

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const db = new pg.Client({
  user: process.env.DB_USER_NAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

db.connect();

app.get("/", async (req, res) => {
  const result = await db.query("select * from users");
  res.send(result.rows);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  try {
    let checkIfUserExist = await db.query(
      "SELECT email from users where email=$1",
      [email]
    );
    if (checkIfUserExist.rows.length === 0) {
      let responseDb = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, hash]
      );
      res.status(200).json({ message: "Successfully registered" });
    } else {
      res.status(409).json({ message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: "Can not register user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let responseDb = await db.query("SELECT * from users WHERE email=$1", [
      email,
    ]);
    if (responseDb.rows.length === 0) {
      res.status(401).json({ message: "User not found" });
    } else {
      try {
        let dbPassword = responseDb.rows[0].password;
        bcrypt.compare(password, dbPassword, function (err, result) {
          if (err) {
            console.log(err);
          } else if (result) {
            res.status(200).json({ message: "User is logined successfully!" });
          } else {
            res.status(401).json({ message: "Wrong credentials" });
          }
        });
      } catch (error) {
        res.status(500).json({ message: "Error" });
      }
    }
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
