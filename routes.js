const express = require("express");
const conn = require("./db/mysql");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const isValid = jwt.verify(token, process.env.SECRET_KEY);

  if (!isValid) {
    return res.sendStatus(401);
  }

  next();
};

router.post("/users/signup", (req, res, next) => {
  const { user } = req.body;
  const {
    username,
    email,
    encrypted_password: password,
    phone,
    address,
    city,
    country,
    name,
    postcode,
  } = user;

  const query =
    "INSERT INTO user (username, email, password, phone, address, city, country, name, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    username,
    email,
    password,
    phone,
    address,
    city,
    country,
    name,
    postcode,
  ];

  conn.query(query, values, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }

    const payload = { id: result.insertId, username: username };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return res.json({
      email: email,
      token: token,
      username: username,
    });
  });
});

router.post("/users/signin", (req, res, next) => {
  const { email, password } = req.body;

  const query = "SELECT id, username FROM user WHERE email=? AND password=?";
  const values = [email, password];

  conn.query(query, values, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }

    const { id, username } = result[0];

    const payload = { id: id, username: username };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return res.json({
      email: email,
      token: token,
      username: username,
    });
  });
});

router.get("/users", authentication, (req, res, next) => {
  conn.query("SELECT * FROM user", (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }

    return res.json({
      data: result,
    });
  });
});

router.post("/shopping", authentication, (req, res, next) => {
  const { shopping } = req.body;
  const { createddate, name } = shopping;

  const query = "INSERT INTO shopping (CreatedDate, Name) VALUES (?, ?)";
  const values = [createddate, name];

  conn.query(query, values, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }

    return res
      .json({
        data: {
          createddate,
          id: result.insertId,
          name,
        },
      })
      .sendStatus(201);
  });
});

router.get("/shopping", authentication, (req, res, next) => {
  conn.query("SELECT * FROM shopping", (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }

    return res.json({
      data: result.map((value) => {
        return {
          id: value.id,
          name: value.Name,
          createddate: value.CreatedDate,
        };
      }),
    });
  });
});

router.get("/shopping/:id", authentication, (req, res, next) => {
  const { id } = req.params;

  const query = "SELECT * FROM shopping WHERE id=?";
  const values = [id];

  conn.query(query, values, (error, result) => {
    if (error) {
      return res.sendStatus(404);
    }

    return res.json({
      data: result,
    });
  });
});

router.put("/shopping/:id", authentication, (req, res, next) => {
  const { id } = req.params;
  const { createddate, name } = req.body;

  const query = "UPDATE shopping SET createddate=?, name=? WHERE id=?";
  const values = [createddate, name, id];

  conn.query(query, values, (error, result) => {
    if (error) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  });
});

router.delete("/shopping/:id", authentication, (req, res, next) => {
  const { id } = req.params;
  const { createddate, name } = req.body;

  const query = "DELETE FROM shopping WHERE id=?";
  const values = [createddate, name, id];

  conn.query(query, values, (error, result) => {
    if (error) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  });
});

module.exports = router;
