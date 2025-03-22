import express from "express";
import bcrypt from "bcrypt";
import pg from "pg";
import cors from "cors";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

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

app.post("/add_secret", async (req, res) => {
  let userSecret = req.body.secret;
  let uuid = req.headers.uuid;
  if (!userSecret || !uuid) {
    return res.status(400).json({ message: "Secret or UUID is missing" });
  }
  try {
    let getUser = await db.query("SELECT * from users where uuid=$1", [uuid]);
    if (getUser.rows.length !== 0) {
      try {
        await db.query("UPDATE users SET secret = $1 WHERE uuid = $2", [
          userSecret,
          uuid,
        ]);
        return res.status(200).json({ message: "Secret updated successfully" });
      } catch (err) {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(401).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Can not register user" });
  }
});

app.get("/validate_session", async (req, res) => {
  const client_uuid = req.headers.uuid;
  try {
    let checkSession = await db.query("SELECT * from users where uuid=$1", [
      client_uuid,
    ]);
    if (checkSession.rows.length !== 0) {
      const db_exp_time = new Date(checkSession.rows[0].uuid_exp).getTime();
      const current_time = Date.now();
      if (client_uuid === checkSession.rows[0].uuid) {
        if (db_exp_time > current_time) {
          res.status(200).json({
            name: checkSession.rows[0].email,
            secret: checkSession.rows[0].secret,
          });
        } else {
          res.status(401).json({ message: "Session expired" });
        }
      } else {
        res.status(401).json({ message: "No active session 1" });
      }
    } else {
      res.status(401).json({ message: "No active session 2" });
    }
  } catch (err) {
    res.status(400).json({ message: "No active session 3" });
  }
});

app.post("/register", async (req, res) => {
  let uuid = uuidv4();
  let uuid_exp = new Date(Date.now() + 60 * 60 * 1000); // current date/time + 1 hour will be created for cookie expiration
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  try {
    let checkIfUserExist = await db.query(
      "SELECT email from users where email=$1",
      [email]
    );
    if (checkIfUserExist.rows.length === 0) {
      await db.query(
        "INSERT INTO users (email, password, uuid, uuid_exp) VALUES ($1, $2, $3, $4)",
        [email, hash, uuid, uuid_exp]
      );
      res.status(200).json({ message: "Successfully registered", uuid: uuid });
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
      return res.status(401).json({ message: "User not found" });
    }

    let dbPassword = responseDb.rows[0].password;

    const result = await bcrypt.compare(password, dbPassword);

    if (result) {
      let uuid = uuidv4();
      let uuid_exp = new Date(Date.now() + 60 * 60 * 1000); // поточний час + 1 година

      await db.query("UPDATE users SET uuid=$1, uuid_exp=$2 WHERE email=$3", [
        uuid,
        uuid_exp,
        email,
      ]);

      res.status(200).json({ message: "User logged in successfully!", uuid });
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});