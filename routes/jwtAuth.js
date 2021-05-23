const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGen = require("../utils/jwtGen");
const authorize = require("../middleware/auth");
const validInfo = require("../middleware/validInfo");

//register
router.post("/register", validInfo, async (req, res) => {
  const { email, password, firstName, lastName, company, city } = req.body;
  try {
    //check user already exists
    const user = await pool.query(
      "SELECT * FROM sponsor WHERE user_email = $1",
      [email]
    );

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists");
    }

    //bcrypt pwd
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptpwd = await bcrypt.hash(password, salt);

    //enter user into db
    const newuser = await pool.query(
      "INSERT INTO sponsor (user_email, user_password, user_first_name, user_last_name, companyname, city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [email, bcryptpwd, firstName, lastName, company, city]
    );
    const token = jwtGen(newuser.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("server error");
  }
});

//login
router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM sponsor WHERE user_email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credentials");
    }
    const token = jwtGen(user.rows[0].user_id);
    return res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//verify token
router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
