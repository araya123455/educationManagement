var bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const moment = require("moment");
const { status } = require("express/lib/response");
const uploadRouter = require("./src/routers/upload_router");
const uploadFileRouter = require("./src/routers/uploadfile_router");
const uploadlinksRouter = require("./src/routers/uploadlinkvideo_router");
// const uploadFileAssesmentRouter = require("./src/routers/uploadfilesubject_router");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors());
const object = { message: "Hello world", status_: 400 };
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var mysql = require("mysql");
const { error } = require("console");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "educationmanagement",
  // password: "yourpassword"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/admin/login", (req, res) => {
  const { adm_user, adm_pass } = req.body;
  // console.log(req.body);
  const sql = `SELECT * FROM admin where adm_user = ? and adm_pass = ?;`;
  con.query(sql, [adm_user, adm_pass], function (err, result) {
    console.log(result);
    if (err) return res.end(err);
    if (result.length > 0) {
      console.log("result", result);
      res.send({ data: result, message: "success" });
    } else res.send("Try Again");
  });
});

app.post("/teacher/login", (req, res) => {
  const { tch_user, tch_pass } = req.body;
  // console.log("req.body", res.body);
  const sql = `SELECT * FROM teacher where tch_user = ? and tch_pass = ?;`;
  con.query(sql, [tch_user, tch_pass], function (err, result) {
    // console.log("result123", result);
    if (err) return res.end(err);
    if (result.length > 0) res.send({ data: result, message: "success" });
    else res.send("Try Again");
  });
});

app.post("/student/login", (req, res) => {
  const { stu_user, stu_pass } = req.body;
  console.log(req.body);
  const sql = `SELECT * FROM student where stu_user = ? and stu_pass = ?;`;
  con.query(sql, [stu_user, stu_pass], function (err, result) {
    if (err) return res.end(err);
    if (result.length > 0) res.send({ data: result, message: "success" });
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

// Addmin Management
// Manage YearTerm
app.post("/yearterminsert", (req, res) => {
  console.log(req.body);
  const { term, year } = req.body;
  const sql = `INSERT INTO schoolyearterm (term, year ) VALUES ( ? , ? )`;
  con.query(sql, [term, year], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("1 recorded" + result);
    const newRecord = { term, year };
    res
      .status(200)
      .json({ message: "Successfully added a new student", data: newRecord });
  });
});
app.patch("/yeartermupdate/:id", (req, res) => {
  const yearTerm_id = req.params.id;
  const { year, term } = req.body;

  const sql = `UPDATE schoolyearterm SET year = ?, term = ? WHERE yearTerm_id = ${yearTerm_id}`;

  con.query(sql, [year, term], function (err, result) {
    if (err) throw err;
    console.log(`YearTerm with ID ${yearTerm_id} updated` + result);

    const updatedYeartermSql = `SELECT * FROM schoolyearterm WHERE yearTerm_id = ${yearTerm_id}`;
    con.query(updatedYeartermSql, function (err, result) {
      if (err) return res.end(err);
      const updatedyearterm = result[0];
      res.status(200).json({
        message: `YearTerm with ID ${yearTerm_id} updated`,
        data: updatedyearterm,
      });
    });
  });
});
// kindergartenroomlavel
app.post("/kinroominsert", (req, res) => {
  console.log(req.body);
  const { kinde_level, Kinder_room } = req.body;
  const sql = `INSERT INTO kindergertenroomlevel (kinde_level, Kinder_room ) VALUES ( ? , ? )`;
  console.log(sql);
  con.query(sql, [kinde_level, Kinder_room], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("1 recorded" + result);
    const newRecord = { kinde_level, Kinder_room };
    res.status(200).json({
      message: "Successfully added a new kindergertenroomlevel",
      data: newRecord,
    });
  });
});
app.patch("/kinroomupdate/:id", (req, res) => {
  const kinder_id = req.params.id;
  const { kinde_level, Kinder_room } = req.body;

  const sql = `UPDATE kindergertenroomlevel SET kinde_level = ?, Kinder_room = ? WHERE kinder_id = ${kinder_id}`;

  con.query(sql, [kinde_level, Kinder_room], function (err, result) {
    if (err) throw err;
    console.log(`Kindergertenroomlevel with ID ${kinder_id} updated` + result);

    const updatedkinroomupdateSql = `SELECT * FROM kindergertenroomlevel WHERE kinder_id = ${kinder_id}`;
    con.query(updatedkinroomupdateSql, function (err, result) {
      if (err) return res.end(err);
      const updatekinroomupdate = result[0];
      res.status(200).json({
        message: `Kindergertenroomlevel with ID ${kinder_id} updated`,
        data: updatekinroomupdate,
      });
    });
  });
});
// Teacher
app.post("/teacherinsert", (req, res) => {
  console.log(req.body);
  const {
    prefix,
    tch_Fname,
    tch_Lname,
    tch_sn,
    tch_user,
    tch_pass,
    status,
    tch_sect,
    position_id,
  } = req.body;
  const sql = `INSERT INTO teacher (prefix, tch_Fname, tch_Lname, tch_sn, tch_user, tch_pass, status, tch_sect, position_id) VALUES ( ? , ? , ?, ?, ?, ?, ?, ?, ?)`;
  con.query(
    sql,
    [
      prefix,
      tch_Fname,
      tch_Lname,
      tch_sn,
      tch_user,
      tch_pass,
      status,
      tch_sect,
      position_id,
    ],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error!!" });
      }
      console.log("1 recorded" + result);
      const newRecord = {
        prefix,
        tch_Fname,
        tch_Lname,
        tch_sn,
        tch_user,
        tch_pass,
        status,
        tch_sect,
        position_id,
      };
      res
        .status(200)
        .json({ message: "Successfully added a new teacher", data: newRecord });
    }
  );
});
app.patch("/teacherupdate/:id", (req, res) => {
  const tch_id = req.params.id;
  const {
    prefix,
    tch_Fname,
    tch_Lname,
    tch_sn,
    tch_user,
    tch_pass,
    status,
    tch_sect,
    position_id,
  } = req.body;

  const sql = `
  UPDATE teacher 
  SET 
    prefix = ?,
    tch_Fname = ?,
    tch_sn = ?,
    tch_user = ?,
    tch_Lname = ?,
    tch_pass = ?,
    status = ?,
    tch_sect = ?,
    position_id = ? 
  WHERE tch_id = ${tch_id}`;

  con.query(
    sql,
    [
      prefix,
      tch_Fname,
      tch_sn,
      tch_user,
      tch_Lname,
      tch_pass,
      status,
      tch_sect,
      position_id,
      tch_id,
    ],
    function (err, result) {
      if (err) throw err;
      console.log(`Teacher with ID ${tch_id} updated` + result);

      const updatedYeartermSql = `SELECT * FROM teacher WHERE tch_id = ${tch_id}`;
      con.query(updatedYeartermSql, function (err, result) {
        if (err) return res.end(err);
        const updatedyearterm = result[0];
        res.status(200).json({
          message: `Teacher with ID ${tch_id} updated`,
          data: updatedyearterm,
        });
      });
    }
  );
});
// Class
app.post("/classinsert", (req, res) => {
  const { kinder_id, yearterm_id, stu_id, crt_id } = req.body;
  const sql = `INSERT INTO class (kinder_id, yearterm_id, stu_id, crt_id) VALUES ( ?, ? , ?, ? )`;

  con.query(
    sql,
    [kinder_id, yearterm_id, stu_id, crt_id],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      console.log("1 record inserted");
      const newRecord = {
        kinder_id,
        yearterm_id,
        stu_id,
        crt_id,
      };
      res
        .status(200)
        .json({ message: "Successfully added a new class", data: newRecord });
    }
  );
});
app.patch("/classupdate/:id", (req, res) => {
  const class_id = req.params.id;
  const { kinder_id, yearterm_id, stu_id, crt_id } = req.body;

  const sql = `UPDATE class SET kinder_id = ?, yearterm_id = ?, stu_id = ?, crt_id = ? WHERE class_id = ${class_id}`;

  con.query(sql, [kinder_id, yearterm_id, stu_id, crt_id], function (err, result) {
    if (err) throw err;
    console.log(`class with ID ${class_id} updated` + result);

    const updatedclassSql = `SELECT * FROM class WHERE class_id = ${class_id}`;
    con.query(updatedclassSql, function (err, result) {
      if (err) return res.end(err);
      const updatedclass = result[0];
      res.status(200).json({
        message: `class with ID ${class_id} updated`,
        data: updatedclass,
      });
    });
  });
});
// Teacher Qualification
app.post("/qualificationinsert/:id", (req, res) => {
  console.log(req.body);
  const tch_id = req.params.id;
  const { eduQualif1, eduQualif2, eduQualif3, eduQualif4 } = req.body;
  const sql = `INSERT INTO teachereducationqualification (eduQualif1, tch_id , eduQualif2, 	eduQualif3, eduQualif4) VALUES ( ? , ? , ?, ?, ?)`;
  con.query(
    sql,
    [eduQualif1, tch_id, eduQualif2, eduQualif3, eduQualif4],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error!!" });
      }
      console.log("1 recorded" + result);
      const newRecord = {
        eduQualif1,
        tch_id,
        eduQualif2,
        eduQualif3,
        eduQualif4,
      };
      res
        .status(200)
        .json({ message: "Successfully added a new teacher", data: newRecord });
    }
  );
});
app.patch("/qualificationupdate/:id", (req, res) => {
  const eduQualif_id = req.params.id;
  const { eduQualif1, tch_id, eduQualif2, eduQualif3, eduQualif4 } = req.body;

  const sql = `UPDATE teachereducationqualification SET eduQualif1 = ?, tch_id  = ?, eduQualif2 = ?, eduQualif3 = ?, eduQualif4 = ? WHERE tch_id = ${eduQualif_id}`;

  con.query(
    sql,
    [eduQualif1, eduQualif_id, eduQualif2, eduQualif3, eduQualif4],
    function (err, result) {
      if (err) throw err;
      console.log(
        `teachereducationqualification with ID ${eduQualif_id} updated` + result
      );

      const updatedYeartermSql = `SELECT * FROM teachereducationqualification WHERE eduQualif_id = ${eduQualif_id}`;
      con.query(updatedYeartermSql, function (err, result) {
        if (err) return res.end(err);
        const updatedyearterm = result[0];
        res.status(200).json({
          message: `teachereducationqualification with ID ${eduQualif_id} updated`,
          data: updatedyearterm,
        });
      });
    }
  );
});
// Student
app.post("/studentinsert", (req, res) => {
  const { prefix, stu_Fname, stu_Lname, stu_sn, stu_user, stu_pass, status } =
    req.body;
  const sql = `INSERT INTO student (prefix, stu_Fname, stu_Lname, stu_sn, stu_user, stu_pass, status) VALUES ( ? , ? , ?, ?, ?, ?, ?)`;

  con.query(
    sql,
    [prefix, stu_Fname, stu_Lname, stu_sn, stu_user, stu_pass, status],
    function (err, result) {
      if (err) return res.end(err);
      console.log("1 recorded" + result);
      const newRecord = {
        prefix,
        stu_Fname,
        stu_Lname,
        stu_sn,
        stu_user,
        stu_pass,
        status,
      };
      res
        .status(200)
        .json({ message: "Successfully added a new student", data: newRecord });
    }
  );
});
app.patch("/studentupdate/:id", (req, res) => {
  const stu_id = req.params.id;
  const { prefix, stu_Fname, stu_Lname, stu_sn, stu_user, stu_pass, status } =
    req.body;

  const sql = `UPDATE student SET prefix = ?, stu_Fname = ?, stu_Lname = ?, stu_sn = ?, stu_user = ?, stu_pass = ?, status = ? WHERE stu_id = ${stu_id}`;

  con.query(
    sql,
    [prefix, stu_Fname, stu_Lname, stu_sn, stu_user, stu_pass, status],
    function (err, result) {
      if (err) throw err;
      console.log(`Student with ID ${stu_id} updated` + result);

      const updatedStudentSql = `SELECT * FROM student WHERE stu_id = ${stu_id}`;
      con.query(updatedStudentSql, function (err, result) {
        if (err) return res.end(err);
        const updatedStudent = result[0];
        res.status(200).json({
          message: `Student with ID ${stu_id} updated`,
          data: updatedStudent,
        });
      });
    }
  );
});
// Syllabus
app.post("/syllabusinsert", (req, res) => {
  console.log(req.body);
  const { sylla_name } = req.body;
  const sql = `INSERT INTO syllabus (sylla_name) VALUES ( ?)`;
  con.query(sql, [sylla_name], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("1 recorded" + result);
    const newRecord = {
      sylla_name,
    };
    res.status(200).json({
      message: "Successfully added a new syllabus",
      data: newRecord,
    });
  });
});
app.patch("/syllabusupdate/:id", (req, res) => {
  const sylla_id = req.params.id;
  const { sylla_name } = req.body;

  const sql = `UPDATE syllabus SET sylla_name = ? WHERE sylla_id = ${sylla_id}`;

  con.query(sql, [sylla_name], function (err, result) {
    if (err) throw err;
    console.log(`syllabus with ID ${sylla_id} updated` + result);

    const updatedsyllabusSql = `SELECT * FROM syllabus WHERE sylla_id = ${sylla_id}`;
    con.query(updatedsyllabusSql, function (err, result) {
      if (err) return res.end(err);
      const updatedsyllabus = result[0];
      res.status(200).json({
        message: `syllabus with ID ${sylla_id} updated`,
        data: updatedsyllabus,
      });
    });
  });
});
// Subject
app.post("/subjectinsert", (req, res) => {
  const { sub_name, sylla_id } = req.body;
  const sql = `INSERT INTO subject (sub_name, sylla_id) VALUES ( ? , ? )`;

  con.query(sql, [sub_name, sylla_id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    console.log("1 record inserted");
    const newRecord = {
      sub_name,
      sylla_id,
    };
    res
      .status(200)
      .json({ message: "Successfully added a new subject", data: newRecord });
  });
});
app.patch("/subjectupdate/:id", (req, res) => {
  const sub_id = req.params.id;
  const { sub_name } = req.body;

  const sql = `UPDATE subject SET sub_name = ? WHERE sub_id = ${sub_id}`;

  con.query(sql, [sub_name], function (err, result) {
    if (err) throw err;
    console.log(`subject with ID ${sub_id} updated` + result);

    const updatedsubjectSql = `SELECT * FROM subject WHERE sub_id = ${sub_id}`;
    con.query(updatedsubjectSql, function (err, result) {
      if (err) return res.end(err);
      const updatedsubject = result[0];
      res.status(200).json({
        message: `subject with ID ${sub_id} updated`,
        data: updatedsubject,
      });
    });
  });
});
app.patch("/subfullscoretupdate/:id", (req, res) => {
  const sub_id = req.params.id;
  const { fullscore } = req.body;

  const sql = `UPDATE subject SET fullscore = ? WHERE sub_id = ${sub_id}`;

  con.query(sql, [fullscore], function (err, result) {
    if (err) throw err;
    console.log(`subject with ID ${sub_id} updated` + result);

    const updatedsubjectSql = `SELECT * FROM subject WHERE sub_id = ${sub_id}`;
    con.query(updatedsubjectSql, function (err, result) {
      if (err) return res.end(err);
      const updatedsubject = result[0];
      res.status(200).json({
        message: `subject with ID ${sub_id} updated`,
        data: updatedsubject,
      });
    });
  });
});
// ClassroomTimeTable
app.post("/classtimeinsert", (req, res) => {
  const { kinder_id, yearterm_id, sylla_id, tch_id } = req.body;
  const sql = `INSERT INTO classroomtimetable ( kinder_id, yearterm_id, sylla_id, tch_id) VALUES ( ? , ?, ?, ? )`;

  con.query(
    sql,
    [kinder_id, yearterm_id, sylla_id, tch_id],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      console.log("1 record inserted");
      const newRecord = {
        kinder_id,
        yearterm_id,
        sylla_id,
        tch_id,
      };
      res
        .status(200)
        .json({ message: "Successfully added a new subject", data: newRecord });
    }
  );
});
app.patch("/classtimeupdate/:id", (req, res) => {
  const crt_id = req.params.id;
  const { kinder_id, yearterm_id, sylla_id, tch_id } = req.body;

  const sql = `UPDATE classroomtimetable SET kinder_id = ?, yearterm_id = ?, sylla_id = ?, tch_id = ? WHERE crt_id = ${crt_id}`;

  con.query(
    sql,
    [kinder_id, yearterm_id, sylla_id, tch_id],
    function (err, result) {
      if (err) throw err;
      console.log(`classroomtimetable with ID ${crt_id} updated` + result);

      const updatedclassroomtimetableSql = `SELECT * FROM classroomtimetable WHERE crt_id = ${crt_id}`;
      con.query(updatedclassroomtimetableSql, function (err, result) {
        if (err) return res.end(err);
        const updatedclassroomtimetable = result[0];
        res.status(200).json({
          message: `classroomtimetable with ID ${crt_id} updated`,
          data: updatedclassroomtimetable,
        });
      });
    }
  );
});
// Test
app.post("/testinsert", (req, res) => {
  const { test_detail } = req.body;
  const sql = `INSERT INTO test ( test_detail) VALUES ( ? )`;

  con.query(sql, [test_detail], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    console.log("1 record inserted");
    const newRecord = {
      test_detail,
    };
    res
      .status(200)
      .json({ message: "Successfully added a new test", data: newRecord });
  });
});
app.patch("/testupdate/:id", (req, res) => {
  const test_id = req.params.id;
  const { test_detail } = req.body;

  const sql = `UPDATE test SET test_detail = ? WHERE test_id = ${test_id}`;

  con.query(sql, [test_detail], function (err, result) {
    if (err) throw err;
    console.log(`test with ID ${test_id} updated` + result);

    const updatedtestSql = `SELECT * FROM test WHERE test_id = ${test_id}`;
    con.query(updatedtestSql, function (err, result) {
      if (err) return res.end(err);
      const updatedtest = result[0];
      res.status(200).json({
        message: `test with ID ${test_id} updated`,
        data: updatedtest,
      });
    });
  });
});
// Test Detail
app.post("/testdeinsert", (req, res) => {
  const { test_id, test_status, kinder_id, yearterm_id } = req.body;
  const sql = `INSERT INTO testdetail ( test_id, test_status, kinder_id, yearterm_id) VALUES ( ?, ?, ?, ? )`;

  con.query(
    sql,
    [test_id, test_status, kinder_id, yearterm_id],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      console.log("1 record inserted");
      const newRecord = {
        test_id,
        test_status,
        kinder_id,
        yearterm_id,
      };
      res.status(200).json({
        message: "Successfully added a new testdetail",
        data: newRecord,
      });
    }
  );
});
app.patch("/testdeupdate/:id", (req, res) => {
  const testDe_id = req.params.id;
  const { test_status, kinder_id, yearterm_id } = req.body;

  const sql = `UPDATE testdetail SET test_status = ?,kinder_id = ?, yearterm_id = ? WHERE testDe_id = ${testDe_id}`;

  con.query(sql, [test_status, kinder_id, yearterm_id], function (err, result) {
    if (err) throw err;
    console.log(`testdetail with ID ${testDe_id} updated` + result);

    const updatedtestdetailSql = `SELECT * FROM testdetail WHERE testDe_id = ${testDe_id}`;
    con.query(updatedtestdetailSql, function (err, result) {
      if (err) return res.end(err);
      const updatedtestdetail = result[0];
      res.status(200).json({
        message: `testdetail with ID ${testDe_id} updated`,
        data: updatedtestdetail,
      });
    });
  });
});
// Question and Choice
app.post("/questioninsert", (req, res) => {
  const {
    ques,
    choice1,
    choice2,
    choice3,
    choice4,
    answer,
    score_ques,
    test_id,
  } = req.body;
  const sql = `INSERT INTO question (
    ques,
    choice1,
    choice2,
    choice3,
    choice4,
    answer,
    score_ques,
    test_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  con.query(
    sql,
    [ques, choice1, choice2, choice3, choice4, answer, score_ques, test_id],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      console.log("1 record inserted");
      const newRecord = {
        ques,
        choice1,
        choice2,
        choice3,
        choice4,
        answer,
        score_ques,
        test_id,
      };
      res.status(200).json({
        message: "Successfully added a new testdetail",
        data: newRecord,
      });
    }
  );
});
app.patch("/questionupdate/:id", (req, res) => {
  const ques_id = req.params.id;
  const { ques, choice1, choice2, choice3, choice4, answer, score_ques } =
    req.body;

  const sql = `UPDATE question SET ques = ?,choice1 = ?, choice2 = ?, choice3 = ?, choice4 = ?, answer = ?, score_ques = ? WHERE ques_id = ${ques_id}`;

  con.query(
    sql,
    [ques, choice1, choice2, choice3, choice4, answer, score_ques],
    function (err, result) {
      if (err) throw err;
      console.log(`question with ID ${ques_id} updated` + result);

      const updatedquestionSql = `SELECT * FROM question WHERE ques_id = ${ques_id}`;
      con.query(updatedquestionSql, function (err, result) {
        if (err) return res.end(err);
        const updatedquestion = result[0];
        res.status(200).json({
          message: `question with ID ${ques_id} updated`,
          data: updatedquestion,
        });
      });
    }
  );
});
// Save answer
app.post("/savetestresult", (req, res) => {
  const { stu_id, time_duration, test_id } = req.body;
  const sql = `INSERT INTO testresult (stu_id, time_duration, test_id) VALUES (?, ?, ?)`;

  con.query(sql, [stu_id, time_duration, test_id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    console.log("1 record inserted");
    const newRecord = {
      stu_id,
      time_duration,
      test_id,
    };
    res.status(200).json({
      message: "Successfully added a new testresult",
      data: newRecord,
    });
  });
});
app.post("/savetestresultdetail", (req, res) => {
  const { ans_result, score, ques_id, stu_id, test_id } = req.body;
  const sql = `INSERT INTO testresultdetail (ans_result, score, ques_id, stu_id, test_id) VALUES (?, ?, ?, ?, ?)`;

  con.query(
    sql,
    [ans_result, score, ques_id, stu_id, test_id],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      console.log("1 record inserted");
      const newRecord = {
        ans_result,
        score,
        ques_id,
        stu_id,
        test_id,
      };
      res.status(200).json({
        message: "Successfully added a new testresultdetail",
        data: newRecord,
      });
    }
  );
});
//------------irin assessment-----------
app.post("/assessmentinsert", (req, res) => {
  console.log(req.body);
  const { assess_name, full_score, kinder_id, yearterm_id } = req.body;
  const sql = `INSERT INTO assessment (assess_name, full_score, kinder_id, yearterm_id) VALUES (?, ?, ?, ?)`;
  con.query(
    sql,
    [assess_name, full_score, kinder_id, yearterm_id],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      console.log("1 recorded" + result);
      const newRecord = {
        assess_name,
        full_score,
        kinder_id,
        yearterm_id,
      };
      res.status(200).json({
        message: "Successfully added a new syllabus",
        data: newRecord,
      });
    }
  );
});
app.patch("/assessmentupdate/:id", (req, res) => {
  const asses_id = req.params.id;
  const { assess_name, full_score } = req.body;

  const sql = `UPDATE assessment SET assess_name = ?, full_score = ? WHERE asses_id = ${asses_id}`;

  con.query(sql, [assess_name, full_score], function (err, result) {
    if (err) throw err;
    console.log(`assessment with ID ${asses_id} updated` + result);

    const updatedassessmentSql = `SELECT * FROM assessment WHERE asses_id = ${asses_id}`;
    con.query(updatedassessmentSql, function (err, result) {
      if (err) return res.end(err);
      const updatedassessmentSql = result[0];
      res.status(200).json({
        message: `assessment with ID ${asses_id} updated`,
        data: updatedassessmentSql,
      });
    });
  });
});
// assessment score
app.post("/assessmentstuinsert", (req, res) => {
  console.log(req.body);
  const { asses_score, stu_id, asses_id } = req.body;
  const sql = `INSERT INTO assessmentscore (asses_score, stu_id, asses_id) VALUES (?, ?, ?)`;
  con.query(sql, [asses_score, stu_id, asses_id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    console.log("1 recorded" + result);
    const newRecord = {
      asses_score,
      stu_id,
      asses_id,
    };
    res.status(200).json({
      message: "Successfully added a new assessment score",
      data: newRecord,
    });
  });
});
app.patch("/assessmentstuupdate/:id", (req, res) => {
  const assesSc_id = req.params.id;
  const { asses_score } = req.body;
  // console.log(req.params.id);
  // console.log(asses_score);

  const sql = `UPDATE assessmentscore SET asses_score = ? WHERE assesSc_id = ${assesSc_id}`;

  con.query(sql, [asses_score], function (err, result) {
    if (err) throw err;
    console.log(`assessment score with ID ${assesSc_id} updated` + result);

    const updatedassessmentscoreSql = `SELECT * FROM assessmentscore WHERE assesSc_id = ${assesSc_id}`;
    con.query(updatedassessmentscoreSql, function (err, result) {
      if (err) return res.end(err);
      const updatedassessmentscoreSql = result[0];
      res.status(200).json({
        message: `assessment score with ID ${assesSc_id} updated`,
        data: updatedassessmentscoreSql,
      });
    });
  });
});
// attendance detail
app.post("/attendancedetailinsert", (req, res) => {
  const { date, stu_id, attd_id } = req.body;
  const sql = `INSERT INTO attendancedetail (  date, stu_id, attd_id ) VALUES ( ?, ?, ? )`;

  con.query(sql, [date, stu_id, attd_id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    console.log("1 record inserted");
    const newRecord = {
      date,
      stu_id,
      attd_id,
    };
    res.status(200).json({
      message: "Successfully added a new attendancedetail",
      data: newRecord,
    });
  });
});
app.patch("/attendancedetailupdate/:id", (req, res) => {
  const attdDt_id = req.params.id;
  const { attd_id } = req.body;

  const sql = `UPDATE attendancedetail SET attd_id = ? WHERE attdDt_id = ${attdDt_id}`;

  con.query(sql, [attd_id], function (err, result) {
    if (err) throw err;
    console.log(`attendancedetail with ID ${attdDt_id} updated` + result);

    const updatedattendancedetailSql = `SELECT * FROM attendancedetail WHERE attdDt_id = ${attdDt_id}`;
    con.query(updatedattendancedetailSql, function (err, result) {
      if (err) return res.end(err);
      const updateattendancedetail = result[0];
      res.status(200).json({
        message: `attendancedetail with ID ${attdDt_id} updated`,
        data: updateattendancedetail,
      });
    });
  });
});
// Student subject score insert and edit
app.post("/subjectscoreinsert", (req, res) => {
  const { subscore, sub_id, stu_id } = req.body;
  const sql = `INSERT INTO subjectscore ( subscore, sub_id, stu_id ) VALUES ( ?, ?, ? )`;

  con.query(sql, [subscore, sub_id, stu_id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    console.log("1 record inserted");
    const newRecord = {
      subscore,
      sub_id,
      stu_id,
    };
    res.status(200).json({
      message: "Successfully added a new subjectscore",
      data: newRecord,
    });
  });
});
app.patch("/subjectscoreupdate/:id", (req, res) => {
  const subscore_id = req.params.id;
  const { subscore } = req.body;

  const sql = `UPDATE subjectscore SET subscore = ? WHERE subscore_id = ${subscore_id}`;

  con.query(sql, [subscore], function (err, result) {
    if (err) throw err;
    console.log(`subjectscore with ID ${subscore_id} updated` + result);

    const updatedsubjectscoreSql = `SELECT * FROM subjectscore WHERE subscore_id = ${subscore_id}`;
    con.query(updatedsubjectscoreSql, function (err, result) {
      if (err) return res.end(err);
      const updatesubjectscore = result[0];
      res.status(200).json({
        message: `subjectscore with ID ${subscore_id} updated`,
        data: updatesubjectscore,
      });
    });
  }); 
});

//---------upload Video----------
app.post("/upload/video_links", (req, res) => {
  const { video_detail, video_link, cont_id } = req.body;
  const sql = `INSERT INTO learningmaterialsvideo (video_detail, video_link, cont_id) VALUES ( ? , ?, ? )`;
  con.query(sql, [video_detail, video_link, cont_id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    console.log("1 record inserted");
    const newRecord = {
      video_detail,
      video_link,
      cont_id,
    };
    res.status(200).json({
      message: "Successfully added a new learningmaterialsvideo",
      data: newRecord,
    });
  });
});

app.get("/yearterm", (req, res) => {
  const sql = "select * from schoolyearterm";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
app.get("/kinderroom", (req, res) => {
  const sql = "select * from kindergertenroomlevel";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
app.get("/teacher", (req, res) => {
  const sql = "select * from teacher";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
app.get("/searchteacher", (req, res) => {
  const { stu_id } = req.query;

  // First query to get crt_id from class
  const selectClassQuery = "SELECT crt_id FROM class WHERE stu_id = ?";

  con.query(selectClassQuery, [stu_id], function (err, classResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    const class_id = classResult.map((result) => result.crt_id);
    if (class_id.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // Query to select data of stu_id from classroomtimetable
    const selectTeacherIdQuery =
      "SELECT tch_id FROM classroomtimetable WHERE crt_id = ?";

    con.query(selectTeacherIdQuery, [class_id[0]], function (err, teacherId) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      const teacher_id = teacherId.map((result) => result.tch_id);
      if (teacher_id.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      // Query to select data of teacher from tch_id
      const selectTeacherDataQuery = "SELECT * FROM teacher WHERE tch_id = ?";

      con.query(
        selectTeacherDataQuery,
        [teacher_id[0]],
        function (err, teacherdata) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }
          res.send(teacherdata);
        }
      );
    });
  });
});
app.get("/searchdirector", (req, res) => {
  const selectPosiQuery =
    'SELECT position_id FROM teacherposi WHERE position = "ผู้อำนวยการ"'; // Use single quotes around the string value

  con.query(selectPosiQuery, function (err, posiResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    const posi_id = posiResult.map((result) => result.position_id);
    if (posi_id.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // Assuming you want to select teachers with a matching position_id
    const selectTeacherDataQuery = `SELECT * FROM teacher WHERE position_id = ?`; // Use a placeholder for the value
    con.query(
      selectTeacherDataQuery,
      [posi_id[0]],
      function (err, teacherdata) {
        // Use posi_id[0] to get the first position_id
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }
        res.send(teacherdata);
      }
    );
  });
});

app.get("/teacherposi", (req, res) => {
  const sql = "select * from teacherposi";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
app.get("/class", (req, res) => {
  const sql = "select * from class";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/pyearterm", (req, res) => {
  const { stu_id } = req.query;
  const sql = `SELECT yearterm_id FROM class WHERE stu_id = ${stu_id}`;
  con.query(sql, function (err, yeartermResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    const yearterm_id = yeartermResult.map((result) => result.yearterm_id);
    if (yearterm_id.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const selectStuYeartermDataQuery = `SELECT * FROM schoolyearterm WHERE yearTerm_id IN (${yearterm_id.join(
      ","
    )})`;

    con.query(selectStuYeartermDataQuery, function (err, yeartermdata) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      res.send(yeartermdata);
    });
  });
});
app.get("/pkinder", (req, res) => {
  const { stu_id } = req.query;
  const sql = `SELECT kinder_id FROM class WHERE stu_id = ${stu_id}`;
  con.query(sql, function (err, kinderResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    const kinder_id = kinderResult.map((result) => result.kinder_id);
    if (kinder_id.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const selectStuKinderDataQuery = `SELECT * FROM kindergertenroomlevel WHERE kinder_id IN (${kinder_id.join(
      ","
    )})`;

    con.query(selectStuKinderDataQuery, function (err, kinderdata) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      res.send(kinderdata);
    });
  });
});
app.get("/student", (req, res) => {
  const sql = "select * from student";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/searcstudent", (req, res) => {
  const { stu_id } = req.query;
  let sql = "SELECT * FROM student";
  const params = [];
  if (stu_id) {
    sql += " WHERE stu_id = ?";
    params.push(stu_id);
  }
  con.query(sql, params, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred!" });
    }
    res.status(200).json({
      message: "Student data",
      data: result,
    });
  });
});
app.get("/subject", (req, res) => {
  const sql = "select * from subject";
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/selectsubject", (req, res) => {
  const { sylla_id } = req.query;
  const sql = `SELECT * FROM subject WHERE sylla_id = ${sylla_id}`;
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/syllabus", (req, res) => {
  const sql = "select * from syllabus";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/qualification", (req, res) => {
  const sql = "select * from qualification";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/classtime", (req, res) => {
  const sql = "select * from classroomtimetable";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
    res.send(result);
  });
});
// search classtime
app.get("/searchclasstime", (req, res) => {
  const sql = "select crt_id, kinder_id, yearterm_id from classroomtimetable";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
// search stuclass
app.get("/searchstuclass", (req, res) => {
  const { kinder_id, yearterm_id } = req.query;
  let sql = "SELECT * FROM class";
  const params = [];
  if (kinder_id && yearterm_id) {
    sql += " WHERE kinder_id = ? AND yearterm_id = ?";
    params.push(kinder_id, yearterm_id);
  }
  con.query(sql, params, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred!" });
    }
    res.status(200).json({
      message: "Class data",
      data: result,
    });
  });
});
//attendance detail
app.get("/attendance", (req, res) => {
  const sql = "select * from attendance";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
//attendance detail
app.get("/attendancedetail", (req, res) => {
  const sql = "select * from attendancedetail";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/studentattendance", (req, res) => {
  const { crt_id } = req.query;
  // console.log(req.query);
  // Query to get stu_id from class
  const selectStuQuery = `SELECT stu_id FROM class WHERE crt_id = ${crt_id}`;
  con.query(selectStuQuery, function (err, studentResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    const student_id = studentResult.map((result) => result.stu_id);
    if (student_id.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // Query to select data of student from stu_id
    const selectStudentDataQuery = `SELECT stu_id, prefix, stu_Fname, stu_Lname, stu_sn FROM student WHERE stu_id IN (${student_id.join(
      ","
    )})`;

    con.query(selectStudentDataQuery, function (err, studentdata) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      res.send(studentdata);
    });
  });
});
// search attendance
app.get("/searceattendance", (req, res) => {
  const { date, stu_id, crt_id } = req.query;
  let selectStuQuery = `SELECT stu_id FROM class WHERE crt_id = ${crt_id}`;
  const pushparams = [];
  if (stu_id) {
    selectStuQuery += ` AND stu_id = ${stu_id}`;
    pushparams.push(stu_id);
  }
  con.query(selectStuQuery, function (err, studentResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    const student_id = studentResult.map((result) => result.stu_id);
    if (student_id.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    let sql = "SELECT * FROM attendancedetail";
    const params = [];
    if (stu_id && date) {
      sql += ` WHERE date = ? AND stu_id IN (${student_id.join(",")})`;
      params.push(date, stu_id);
    } else if (stu_id) {
      sql += ` WHERE stu_id IN (${student_id.join(",")})`;
      params.push(stu_id);
    } else if (date) {
      sql += ` WHERE date = ? AND stu_id IN (${student_id.join(",")})`;
      params.push(date);
    } else {
      sql += ` WHERE stu_id IN (${student_id.join(",")})`;
      params.push(stu_id);
    }

    con.query(sql, params, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "An error occurred!" });
      }
      res.status(200).json({
        message: "Attendance",
        data: result,
      });
    });
  });
});
// Teat
app.get("/test", (req, res) => {
  const sql = "select * from test";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/testde", (req, res) => {
  const sql = "select * from testdetail";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/question", (req, res) => {
  const sql = "select * from question";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
// Show student from testDe_id haven't take tests seperate class
app.get("/testresultdetatil", (req, res) => {
  const { testDe_id } = req.query;
  // First query to get kinder_id and yearterm_id from testdetail
  const selectTestdetailQuery = `SELECT test_id, kinder_id, yearterm_id FROM testdetail WHERE testDe_id = ${testDe_id}`;
  con.query(selectTestdetailQuery, function (err, resultdetail) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    // Extracting kinder_id and yearterm_id
    const kinder_id = resultdetail[0].kinder_id;
    const yearterm_id = resultdetail[0].yearterm_id;
    const test_id = resultdetail[0].test_id;

    // Second query to get stu_id values based on kinder_id and yearterm_id from class
    const selectClassQuery = `SELECT stu_id FROM class WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id}`;
    con.query(selectClassQuery, function (err, resultclass) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      // Extracting stu_id
      const stuid = resultclass.map((result) => result.stu_id);
      if (stuid.length === 0) {
        return res
          .status(404)
          .json({ message: "No available for the student" });
      }

      // Third query to get stu_id (student haven't take class) check with testresultdetail
      const selectTestdetail = `SELECT stu_id FROM testresultdetail WHERE test_id = ${test_id} AND stu_id IN (${stuid.join(
        ","
      )})`;
      con.query(selectTestdetail, function (err, resultTestde) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }
        // initialization first
        const takeTestdeId = resultTestde.map((result) => result.stu_id);
        const availableTestdeId = stuid.filter(
          (testde) => !takeTestdeId.includes(testde) // id student not already have test
        );
        if (availableTestdeId.length === 0) {
          return res
            .status(404)
            .json({ message: "No available for the student" });
        }

        const selectStudentQuery = `SELECT stu_id, prefix, stu_Fname, stu_Lname, stu_sn FROM student WHERE stu_id IN (${availableTestdeId.join(
          ","
        )})`;
        con.query(selectStudentQuery, function (err, resultStudent) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }
          res.send(resultStudent);
        });
      });
    });
  });
});

// Show student from testDe_id have take tests seperate class
app.get("/testresultdetatiled", (req, res) => {
  const { testDe_id } = req.query;
  // First query to get kinder_id and yearterm_id from testdetail
  const selectTestdetailQuery = `SELECT test_id, kinder_id, yearterm_id FROM testdetail WHERE testDe_id = ${testDe_id}`;
  con.query(selectTestdetailQuery, function (err, resultdetail) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    // Extracting kinder_id and yearterm_id
    const kinder_id = resultdetail[0].kinder_id;
    const yearterm_id = resultdetail[0].yearterm_id;
    const test_id = resultdetail[0].test_id;

    // Second query to get stu_id values based on kinder_id and yearterm_id from class
    const selectClassQuery = `SELECT stu_id FROM class WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id}`;
    // Get student on this class
    con.query(selectClassQuery, function (err, resultclass) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      // Extracting stu_id
      const stuid = resultclass.map((result) => result.stu_id);
      if (stuid.length === 0) {
        return res
          .status(404)
          .json({ message: "No available tests for the student" });
      }

      // Third query to get stu_id (student haven't take class) check with testresultdetail
      const selectTestdetail = `SELECT stu_id FROM testresultdetail WHERE test_id = ${test_id} AND stu_id IN (${stuid.join(
        ","
      )})`;
      con.query(selectTestdetail, function (err, resultTestde) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }
        // initialization first
        const takeTestdeId = resultTestde.map((result) => result.stu_id);
        const availableTestdeId = stuid.filter((testde) =>
          takeTestdeId.includes(testde)
        );
        if (availableTestdeId.length === 0) {
          return res
            .status(404)
            .json({ message: "No available tests for the student" });
        }

        const selectStudentQuery = `SELECT stu_id, prefix, stu_Fname, stu_Lname, stu_sn FROM student WHERE stu_id IN (${availableTestdeId.join(
          ","
        )})`;
        con.query(selectStudentQuery, function (err, resultStudent) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }
          res.send(resultStudent);
        });
      });
    });
  });
});
// Just show test
app.get("/selecttestold", (req, res) => {
  const { stu_id } = req.query; // Use query instead of body for GET requests
  // First query to get kinder_id and yearterm_id based on stu_id
  const selectClassQuery = `SELECT kinder_id, yearterm_id FROM class WHERE stu_id = ${stu_id}`;

  con.query(selectClassQuery, function (err, classResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    // Extracting kinder_id and yearterm_id from the classResult
    const kinder_id = classResult[0].kinder_id;
    const yearterm_id = classResult[0].yearterm_id;

    // Second query to get test_id values based on kinder_id and yearterm_id
    const selectTestQuery = `SELECT test_id FROM testdetail WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id} AND test_status = 1`;

    con.query(selectTestQuery, function (err, testResult) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      // Extracting test_id values from the testResult
      const testIds = testResult.map((result) => result.test_id);
      // console.log("test ids: ", testIds);

      // Third query to get questions based on multiple test_id values using IN clause
      const selectQuestionsQuery = `SELECT test_id, test_detail FROM test WHERE test_id IN (${testIds.join(
        ","
      )})`;

      con.query(selectQuestionsQuery, function (err, questionResult) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }
        res.send(questionResult);
      });
    });
  });
});
// Show test students haven't taken yet
app.get("/selecttest", (req, res) => {
  const { stu_id } = req.query; // Find class student and test

  // First query to get kinder_id and yearterm_id based on stu_id
  const selectClassQuery = `SELECT kinder_id, yearterm_id FROM class WHERE stu_id = ${stu_id}`;
  con.query(selectClassQuery, function (err, classResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    if (classResult.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const kinder_id = classResult[0].kinder_id;
    const yearterm_id = classResult[0].yearterm_id;

    // Second query to get test_id values based on kinder_id and yearterm_id
    const selectTestQuery = `SELECT test_id FROM testdetail WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id} AND test_status = 1`;
    con.query(selectTestQuery, function (err, testResult) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      const testIds = testResult.map((result) => result.test_id);

      if (testIds.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      // Query to select test_ids that the student already has
      const selectTestTakenQuery = `SELECT test_id FROM testresult WHERE stu_id = ${stu_id} AND test_id IN (${testIds.join(
        ","
      )})`;
      con.query(selectTestTakenQuery, function (err, selectresult) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }

        const takenTestIds = selectresult.map((result) => result.test_id);

        // Filter out test_ids that the student already has
        const availableTestIds = testIds.filter(
          (testId) => !takenTestIds.includes(testId)
        );

        if (availableTestIds.length === 0) {
          return res.status(404).json({ message: "Not found" });
        }

        // Third query to get questions based on available test_id values using IN clause
        const selectQuestionsQuery = `SELECT test_id, test_detail FROM test WHERE test_id IN (${availableTestIds.join(
          ","
        )})`;

        con.query(selectQuestionsQuery, function (err, questionResult) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }
          console.log(questionResult);
          res.send(questionResult);
        });
      });
    });
  });
});
// Already have score
app.get("/finishedtest", (req, res) => {
  const { stu_id } = req.query;
  // First query to get kinder_id and yearterm_id based on stu_id
  const selectClassQuery = `SELECT kinder_id, yearterm_id FROM class WHERE stu_id = ${stu_id}`;
  con.query(selectClassQuery, function (err, classResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    if (classResult.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const kinder_id = classResult[0].kinder_id;
    const yearterm_id = classResult[0].yearterm_id;

    // Second query to get test_id values based on kinder_id and yearterm_id
    const selectTestQuery = `SELECT test_id FROM testdetail WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id} AND test_status = 1`;
    con.query(selectTestQuery, function (err, testResult) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      const testIds = testResult.map((result) => result.test_id);

      if (testIds.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      // Query to select test_ids that the student already has
      const selectTestTakenQuery = `SELECT test_id FROM testresult WHERE stu_id = ${stu_id} AND test_id IN (${testIds.join(
        ","
      )})`;
      con.query(selectTestTakenQuery, function (err, selectresult) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }

        const takenTestIds = selectresult.map((result) => result.test_id);

        // Filter out test_ids that the student already has
        const availableTestIds = testIds.filter((testId) =>
          takenTestIds.includes(testId)
        );

        if (availableTestIds.length === 0) {
          return res.status(404).json({ message: "Not found" });
        }

        // Third query to get questions based on available test_id values using IN clause
        const selectQuestionsQuery = `SELECT test_id, test_detail FROM test WHERE test_id IN (${availableTestIds.join(
          ","
        )})`;

        con.query(selectQuestionsQuery, function (err, questionResult) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }
          res.send(questionResult);
        });
      });
    });
  });
});
// selectquestion
app.get("/showquestion", (req, res) => {
  const { test_id } = req.query;
  const selectQuestionsQuery = `SELECT ques_id, ques, choice1, choice2, choice3, choice4, score_ques, answer FROM question WHERE test_id = ${test_id}`;

  con.query(selectQuestionsQuery, function (err, questionResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    // console.log(questionResult);
    res.send(questionResult);
  });
});
app.get("/testresult", (req, res) => {
  const { stu_id, test_id } = req.query;
  const selectQuestionsQuery = `SELECT stu_id, time_duration, test_id FROM testresult WHERE test_id = ${test_id} AND stu_id = ${stu_id}`;

  con.query(selectQuestionsQuery, function (err, testresult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    console.log(testresult);
    if (testresult.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});
app.get("/testresultdetail", (req, res) => {
  const { stu_id, test_id } = req.query;
  const selectQuestionsQuery = `SELECT 	testDe_id, ans_result, score, ques_id, stu_id, test_id FROM testresultdetail WHERE test_id = ${test_id} AND stu_id = ${stu_id}`;

  con.query(selectQuestionsQuery, function (err, testresult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    res.send(testresult);
  });
});
app.get("/testedresult", (req, res) => {
  const { stu_id, test_id } = req.query;
  const selectQuestionsQuery = `SELECT testR_id, stu_id, time_duration, test_id FROM testresult WHERE test_id = ${test_id} AND stu_id = ${stu_id}`;

  con.query(selectQuestionsQuery, function (err, testedresult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    res.send(testedresult);
  });
});
// show test
app.get("/selectedtest", (req, res) => {
  const { test_id } = req.query;
  const selectQuestionsQuery = `SELECT test_detail, test_id FROM test WHERE test_id = ${test_id}`;

  con.query(selectQuestionsQuery, function (err, testresult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    res.send(testresult);
  });
});
// Search syllabus
app.get("/shownamesyllabus", (req, res) => {
  const { kinder_id, yearterm_id } = req.query;
  const selectSyllabus = `SELECT sylla_id FROM classroomtimetable WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id}`;

  con.query(selectSyllabus, function (err, syllabusid) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    const takesyllabusid = syllabusid.map((result) => result.sylla_id);
    if (takesyllabusid.length === 0) {
      return res.status(404).json({
        message: "No shownamesyllabus found for the given parameters",
      });
    }

    const selectSyllabusname = `SELECT * FROM syllabus WHERE sylla_id = ${takesyllabusid}`;
    con.query(selectSyllabusname, function (err, resultsyllaname) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      res.send(resultsyllaname);
    });
  });
});
// Search subject
app.get("/shownamesubject", (req, res) => {
  const { kinder_id, yearterm_id } = req.query;
  const selectSyllabus = `SELECT sylla_id FROM classroomtimetable WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id}`;

  con.query(selectSyllabus, function (err, syllabusid) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    const takesyllabusid = syllabusid.map((result) => result.sylla_id);
    if (takesyllabusid.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for the given parameters" });
    }

    const selectSyllabusname = `SELECT sylla_id FROM syllabus WHERE sylla_id = ${takesyllabusid}`;
    con.query(selectSyllabusname, function (err, resultsyllaname) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      // Just make sure
      const takesylladata = resultsyllaname.map((result) => result.sylla_id);
      if (takesylladata.length === 0) {
        return res
          .status(404)
          .json({ message: "No students found for the given parameters" });
      }

      const selectSubject = `SELECT * FROM subject WHERE sylla_id = ${takesylladata}`;
      con.query(selectSubject, function (err, resultsubject) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }
        res.send(resultsubject);
      });
    });
  });
});
// Show student student score
app.get("/showstusubscore", (req, res) => {
  const sql = "SELECT * FROM subjectscore";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
app.get("/showstusubreport", (req, res) => {
  const { stu_id } = req.query;
  const sql = `SELECT * FROM subjectscore WHERE stu_id = ${stu_id}`;
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});

//------irin----------
app.get("/assessment", (req, res) => {
  const sql = "select * from assessment";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/assessmentstu", (req, res) => {
  const sql = "SELECT * FROM assessmentscore";
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    // console.log("Result: " + result);
    res.send(result);
  });
});
app.get("/assessmentreport", (req, res) => {
  const { stu_id } = req.query;
  const sql = `SELECT * FROM assessmentscore WHERE stu_id = ${stu_id}`;
  con.query(sql, function (err, result) {
    // console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
// find student from yearterm_id and kinder_id
app.get("/findstudent", (req, res) => {
  const { kinder_id, yearterm_id } = req.query;
  const selectStudentId = `SELECT stu_id FROM class WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id}`;

  con.query(selectStudentId, function (err, studentId) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    // Extracting stu_id values from the query result
    const takestudentId = studentId.map((result) => result.stu_id);

    // Check if there are available students
    if (takestudentId.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for the given parameters" });
    }

    // Construct the query to fetch student data
    const selectStudentdata = `SELECT stu_id, prefix, stu_Fname, stu_Lname, stu_sn FROM student WHERE stu_id IN (${takestudentId.join(
      ","
    )})`;

    con.query(selectStudentdata, function (err, resultstudata) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }
      res.send(resultstudata);
    });
  });
});
// find assesment on class
app.get("/findassessment", (req, res) => {
  const { kinder_id, yearterm_id } = req.query;
  const selectAssessId = `SELECT asses_id, assess_name, full_score FROM assessment WHERE kinder_id = ${kinder_id} AND yearterm_id = ${yearterm_id}`;

  con.query(selectAssessId, function (err, AssessData) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    res.send(AssessData);
  });
});

//irin video
//------------------------------
app.get("/learningvideo", (req, res) => {
  const sql = "select * from learningmaterialsvideo where cont_id";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
});
//------irin file pdf---------
//------File PDF--------
//---------------learning---------------------------
app.use("/upload/file_pdf", uploadFileRouter);

const pdfDirectory = path.join(__dirname, "./public/upload/file_pdf/");

app.use("/pdf", express.static(pdfDirectory));

app.get("/pdf", (req, res) => {
  fs.readdir(pdfDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    const pdfFiles = files.filter((file) => path.extname(file) === ".pdf");
    console.log("logfile", pdfFiles);
    if (pdfFiles.length === 0) {
      return res.status(404).send("No PDF files found");
    }
    const pdfUrls = pdfFiles.map((file) => {
      return {
        url: `/pdf/${file}`,
        name: file,
      };
    });
    res.status(200).json(pdfUrls);
  });
});
//-------------English-------------
app.use("/upload/subject_contant/English", uploadFileRouter);

const pdfEnglishDirectory = path.join(
  __dirname,
  "./public/upload/subject_contant/English/"
);

app.use("/pdfEnglish", express.static(pdfEnglishDirectory));

app.get("/pdfEnglish", (req, res) => {
  fs.readdir(pdfEnglishDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    const pdfFiles = files.filter((file) => path.extname(file) === ".pdf"); // Change the file extension here
    console.log("logfile", pdfFiles);
    if (pdfFiles.length === 0) {
      return res.status(404).send("No PDF files found");
    }
    const pdfUrls = pdfFiles.map((file) => {
      return {
        url: `/pdfEnglish/${file}`,
        name: file,
      };
    });
    res.status(200).json(pdfUrls);
  });
});
//-------------Echance The Experienc-------------
app.use("/upload/subject_contant/EnhanceTheExperience", uploadFileRouter);

const pdfEnhanceTheExperienceDirectory = path.join(
  __dirname,
  "./public/upload/subject_contant/EnhanceTheExperience/"
);

app.use(
  "/pdfEnhanceTheExperience",
  express.static(pdfEnhanceTheExperienceDirectory)
);

app.get("/pdfEnhanceTheExperience", (req, res) => {
  fs.readdir(pdfEnhanceTheExperienceDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    const pdfFiles = files.filter((file) => path.extname(file) === ".pdf"); // Change the file extension here
    console.log("logfile", pdfFiles);
    if (pdfFiles.length === 0) {
      return res.status(404).send("No PDF files found");
    }
    const pdfUrls = pdfFiles.map((file) => {
      return {
        url: `/pdfEnhanceTheExperience/${file}`,
        name: file,
      };
    });
    res.status(200).json(pdfUrls);
  });
});
//-------------Math-------------
app.use("/upload/subject_contant/Mathh", uploadFileRouter);

const pdfMathhDirectory = path.join(
  __dirname,
  "./public/upload/subject_contant/Mathh/"
);

app.use("/pdfMath", express.static(pdfMathhDirectory));

app.get("/pdfMath", (req, res) => {
  fs.readdir(pdfMathhDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    const pdfFiles = files.filter((file) => path.extname(file) === ".pdf"); // Change the file extension here
    console.log("logfile", pdfFiles);
    if (pdfFiles.length === 0) {
      return res.status(404).send("No PDF files found");
    }
    const pdfUrls = pdfFiles.map((file) => {
      return {
        url: `/pdfMath/${file}`,
        name: file,
      };
    });
    res.status(200).json(pdfUrls);
  });
});
//-------------Thai-------------
app.use("/upload/subject_contant/Thai", uploadFileRouter);

const pdfThaiDirectory = path.join(
  __dirname,
  "./public/upload/subject_contant/Thai/"
);

app.use("/pdfThai", express.static(pdfThaiDirectory));

app.get("/pdfThai", (req, res) => {
  fs.readdir(pdfThaiDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    const pdfFiles = files.filter((file) => path.extname(file) === ".pdf"); // Change the file extension here
    console.log("logfile", pdfFiles);
    if (pdfFiles.length === 0) {
      return res.status(404).send("No PDF files found");
    }
    const pdfUrls = pdfFiles.map((file) => {
      return {
        url: `/pdfThai/${file}`,
        name: file,
      };
    });
    res.status(200).json(pdfUrls);
  });
});
//--------------------------------------------------------------
app.delete("/yeartermdelete/:id", (req, res) => {
  const yearTerm_id = req.params.id;

  const deletestudent = `DELETE FROM schoolyearterm WHERE yearTerm_id = ?`;

  con.query(deletestudent, [yearTerm_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        // Handle foreign key constraint violation error
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        // Handle other errors
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }

    console.log(`Student with ID ${yearTerm_id} deleted` + result);

    res.status(200).json({
      message: `Student with ID ${yearTerm_id} deleted`,
    });
  });
});
app.delete("/kinroomdelete/:id", (req, res) => {
  const kinder_id = req.params.id;
  const deletestudent = `DELETE FROM kindergertenroomlevel WHERE kinder_id = ?`;
  con.query(deletestudent, [kinder_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    res.status(200).json({
      message: `Kindergertenroomlevel with ID ${kinder_id} deleted`,
    });
  });
});
app.delete("/teacherdelete/:id", (req, res) => {
  const tch_id = req.params.id;

  const deleteteacher = `DELETE FROM teacher WHERE tch_id = ?`;

  con.query(deleteteacher, [tch_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`Teacher with ID ${tch_id} deleted` + result);

    res.status(200).json({
      message: `Teacher with ID ${tch_id} deleted`,
    });
  });
});
app.delete("/studentdelete/:id", (req, res) => {
  const stu_id = req.params.id;

  const deletestudent = `DELETE FROM student WHERE stu_id = ?`;

  con.query(deletestudent, [stu_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`Student with ID ${stu_id} deleted` + result);

    res.status(200).json({
      message: `Student with ID ${stu_id} deleted`,
    });
  });
});
app.delete("/syllabusdelete/:id", (req, res) => {
  const sylla_id = req.params.id;

  const deletesyllabus = `DELETE FROM syllabus WHERE sylla_id = ?`;

  con.query(deletesyllabus, [sylla_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`syllabus with ID ${sylla_id} deleted` + result);
    res.status(200).json({
      message: `syllabus with ID ${sylla_id} deleted`,
    });
  });
});
app.delete("/subjectdelete/:id", (req, res) => {
  const sub_id = req.params.id;

  const deletesubject = `DELETE FROM subject WHERE sub_id = ?`;

  con.query(deletesubject, [sub_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`subject with ID ${sub_id} deleted` + result);

    res.status(200).json({
      message: `subject with ID ${sub_id} deleted`,
    });
  });
});
app.delete("/qualificationdelete/:id", (req, res) => {
  const sub_id = req.params.id;

  const deletesubject = `DELETE FROM teachereducationqualification WHERE sub_id = ?`;

  con.query(deletesubject, [sub_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`subject with ID ${sub_id} deleted` + result);

    res.status(200).json({
      message: `subject with ID ${sub_id} deleted`,
    });
  });
});
app.delete("/attendancedelete/:id", (req, res) => {
  const attdDt_id = req.params.id;

  const deletesubject = `DELETE FROM attendancedetail WHERE attdDt_id = ?`;

  con.query(deletesubject, [attdDt_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`attendancedetail with ID ${attdDt_id} deleted` + result);

    res.status(200).json({
      message: `attendancedetail with ID ${attdDt_id} deleted`,
    });
  });
});
app.delete("/classtimedelete/:id", (req, res) => {
  const crt_id = req.params.id;

  const deleteclassroomtimetable = `DELETE FROM classroomtimetable WHERE crt_id = ?`;

  con.query(deleteclassroomtimetable, [crt_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`classroomtimetable with ID ${crt_id} deleted` + result);
    res.status(200).json({
      message: `classroomtimetable with ID ${crt_id} deleted`,
    });
  });
});
app.delete("/classdelete/:id", (req, res) => {
  const class_id = req.params.id;

  const deleteclass = `DELETE FROM class WHERE class_id = ?`;

  con.query(deleteclass, [class_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`class with ID ${class_id} deleted` + result);

    res.status(200).json({
      message: `class with ID ${class_id} deleted`,
    });
  });
});
app.delete("/testdelete/:id", (req, res) => {
  const test_id = req.params.id;

  const deletetest = `DELETE FROM test WHERE test_id = ?`;

  con.query(deletetest, [test_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`test with ID ${test_id} deleted` + result);

    res.status(200).json({
      message: `test with ID ${test_id} deleted`,
    });
  });
});
app.delete("/testdedelete/:id", (req, res) => {
  const testDe_id = req.params.id;

  const deletetest = `DELETE FROM testdetail WHERE testDe_id = ?`;

  con.query(deletetest, [testDe_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`testdetail with ID ${testDe_id} deleted` + result);

    res.status(200).json({
      message: `testdetail with ID ${testDe_id} deleted`,
    });
  });
});
app.delete("/questiondelete/:id", (req, res) => {
  const ques_id = req.params.id;

  const deletetest = `DELETE FROM question WHERE ques_id = ?`;

  con.query(deletetest, [ques_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`question with ID ${ques_id} deleted` + result);

    res.status(200).json({
      message: `question with ID ${ques_id} deleted`,
    });
  });
});
//-------assessment--------
app.delete("/assessmentdelete/:id", (req, res) => {
  const asses_id = req.params.id;
  const deleteassessment = `DELETE FROM assessment WHERE asses_id = ?`;

  con.query(deleteassessment, [asses_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`assessment with ID ${asses_id} deleted` + result);
    res.status(200).json({
      message: `assessment with ID ${asses_id} deleted`,
    });
  });
});
app.delete("/assessmentstudelete/:id", (req, res) => {
  const assesSc_id = req.params.id;
  // console.log(assesSc_id);
  const deleteassessment = `DELETE FROM assessmentscore WHERE assesSc_id = ?`;

  con.query(deleteassessment, [assesSc_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`assessment with ID ${assesSc_id} deleted` + result);
    res.status(200).json({
      message: `assessment with ID ${assesSc_id} deleted`,
    });
  });
});
app.delete("/subjectscoredelete/:id", (req, res) => {
  const subscore_id = req.params.id;
  // console.log(subscore_id);
  const deleteassessment = `DELETE FROM subjectscore WHERE subscore_id = ?`;

  con.query(deleteassessment, [subscore_id], function (err, result) {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete this record due to references in other tables.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred while deleting the record.",
        });
      }
    }
    console.log(`assessment with ID ${subscore_id} deleted` + result);
    res.status(200).json({
      message: `assessment with ID ${subscore_id} deleted`,
    });
  });
});

app.get("/:id", (req, res) => {
  console.log(req.params.id);
  res.send(object);
});

app.post("/testpost", (req, res) => {
  console.log("req.body");
});

//Custom middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
