var bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { status } = require("express/lib/response");
const app = express();
app.use(cors());
const object = { message: "Hello world", status_: 400 };
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "websitelearning",
  // password: "yourpassword"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/admin/login", (req, res) => {
    const { adm_user, adm_pass } = req.body;
    console.log(req.body);
    const sql = `SELECT * FROM admin where adm_user = ? and adm_pass = ?;`;
    con.query(sql, [adm_user, adm_pass], function (err, result) {
      if (err) return res.end(err);
      if (result.length > 0) res.send("success");
      else res.send("Try Again");
    });
  });

app.post("/teacher/login", (req, res) => {
  const { tch_user, tch_pass } = req.body;
  console.log(req.body);
  const sql = `SELECT * FROM teacher where tch_user = ? and tch_pass = ?;`;
  con.query(sql, [tch_user, tch_pass], function (err, result) {
    if (err) return res.end(err);
    if (result.length > 0) res.send("success");
    else res.send("Try Again");
  });
});

app.post("/student/login", (req, res) => {
    const { stu_user, stu_pass } = req.body;
    console.log(req.body);
    const sql = `SELECT * FROM student where stu_user = ? and stu_pass = ?;`;
    con.query(sql, [stu_user, stu_pass], function (err, result) {
      if (err) return res.end(err);
      if (result.length > 0) res.send("success");
      else res.send("Try Again");
    });
  });

app.get("/admindata", (req, res) => {
  const sql = "select * from admin";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
    res.send(result);
  });
});

app.get("/:id", (req, res) => {
  console.log(req.params.id);
  res.send(object);
});

app.post("/testpost", (req, res) => {
  console.log("req.body");
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
