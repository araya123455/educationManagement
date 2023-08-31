var bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { status } = require("express/lib/response");
const uploadRouter = require("./src/routers/upload_router");
const uploadFileRouter = require( "./src/routers/uploadfile_router" );
const uploadlinksRouter = require("./src/routers/uploadlinkvideo_router")
const fs = require('fs');
const path = require('path');
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
  database: "educationmanagment",
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
    console.log("result123", result);
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
  } = req.body;
  const sql = `INSERT INTO teacher (prefix, tch_Fname, tch_Lname, tch_sn, tch_user, tch_pass, status, tch_sect) VALUES ( ? , ? , ?, ?, ?, ?, ?, ?)`;
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
      };
      res
        .status(200)
        .json({ message: "Successfully added a new teacher", data: newRecord });
    }
  );
});
app.patch("/teacherupdate/:id", (req, res) => {
  const tch_id = req.params.id;
  const { prefix, tch_Fname, tch_Lname, tch_pass, status, tch_sect } = req.body;

  const sql = `UPDATE teacher SET prefix = ?, tch_Fname = ?, tch_Lname = ?, tch_pass = ?, status = ?, tch_sect = ? WHERE tch_id = ${tch_id}`;

  con.query(
    sql,
    [prefix, tch_Fname, tch_Lname, tch_pass, status, tch_sect],
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
  const { kinder_id, yearterm_id, stu_id } = req.body;

  const sql = `UPDATE class SET kinder_id = ?, yearterm_id = ?, stu_id = ? WHERE class_id = ${class_id}`;

  con.query(sql, [kinder_id, yearterm_id, stu_id], function (err, result) {
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
  const { prefix, stu_Fname, stu_Lname, stu_pass, status } = req.body;

  const sql = `UPDATE student SET prefix = ?, stu_Fname = ?, stu_Lname = ?, stu_pass = ?, status = ? WHERE stu_id = ${stu_id}`;

  con.query(
    sql,
    [prefix, stu_Fname, stu_Lname, stu_pass, status],
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
  const { sub_name, sylla_id } = req.body;

  const sql = `UPDATE subject SET sub_name = ?, sylla_id = ? WHERE sub_id = ${sub_id}`;

  con.query(sql, [sub_name, sylla_id], function (err, result) {
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
//---------Video----------
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
      video_detail, video_link, cont_id
    };
    res
      .status(200)
      .json({ message: "Successfully added a new learningmaterialsvideo", data: newRecord });
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
app.get("/class", (req, res) => {
  const sql = "select * from class";
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
app.get("/student", (req, res) => {
  const sql = "select * from student";
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
    console.log(result);
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
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
// Teat
app.get("/test", (req, res) => {
  const sql = "select * from test";
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    console.log("Result: " + result);
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
    console.log("Result: " + result);
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
// selecttest
app.get("/selecttest", (req, res) => {
  const { stu_id } = req.query; // Use query instead of body for GET requests
  console.log("stu_id", stu_id);
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

        console.log("Result: ", questionResult);
        res.send(questionResult);
      });
    });
  });
});
app.get("/selecttested", (req, res) => {
  const { stu_id } = req.query;

  // Use parameterized queries to prevent SQL injection
  const selectClassQuery = `SELECT kinder_id, yearterm_id FROM class WHERE stu_id = ?`;

  con.query(selectClassQuery, [stu_id], function (err, classResult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }

    if (classResult.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const kinder_id = classResult[0].kinder_id;
    const yearterm_id = classResult[0].yearterm_id;

    const selectTestQuery = `
      SELECT test_id
      FROM testdetail
      WHERE kinder_id = ? AND yearterm_id = ? AND test_status = 1
    `;

    con.query(selectTestQuery, [kinder_id, yearterm_id], function (err, testResult) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      }

      if (testResult.length === 0) {
        return res.status(404).json({ message: "No tests found" });
      }

      const test_id = testResult[0].test_id;

      const selectTestResultQuery = `
        SELECT test_id
        FROM testresult
        WHERE test_id != ? AND stu_id != ?
      `;

      con.query(selectTestResultQuery, [test_id, stu_id], function (err, testresult) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred" });
        }

        const testIds = testresult.map((result) => result.test_id);

        if (testIds.length === 0) {
          return res.status(404).json({ message: "No matching test results found" });
        }

        const selectQuestionsQuery = `
          SELECT test_id, test_detail
          FROM test
          WHERE test_id IN (?)
        `;

        con.query(selectQuestionsQuery, [testIds], function (err, questionResult) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }

          console.log("Result: ", questionResult);
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
  const selectQuestionsQuery = `SELECT ans_result, score, ques_id, stu_id, test_id FROM testresultdetail WHERE test_id = ${test_id} AND stu_id = ${stu_id}`;

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
  const selectQuestionsQuery = `SELECT stu_id, time_duration, test_id FROM testresult WHERE test_id = ${test_id} AND stu_id = ${stu_id}`;

  con.query(selectQuestionsQuery, function (err, testedresult) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
    console.log(testedresult);
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
app.get("/learningvideo", (req, res) => {
  const sql = "select * from learningmaterialsvideo where cont_id" ;
  con.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error!!" });
    }
    res.send(result);
  });
})

//------File PDF--------
app.get('/learningFilePdf', (req, res) =>  {
  const pdfFilePath = 'uploadFile';
  const pdfStream = fs.createReadStream(pdfFilePath);
  pdfStream.pipe(res);
});

const pdfDirectory = path.join(__dirname, './public/upload/file_pdf/'); 

app.use('/pdf', express.static(pdfDirectory));

app.get('/pdf', (req, res) => {
  fs.readdir(pdfDirectory, (err, files) => {
    
    if (err) {
      return res.status(500).send('Error reading directory');
    }
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');
    console.log("logfile", pdfFiles)
    if (pdfFiles.length === 0) {
      return res.status(404).send('No PDF files found');
    }
    const pdfUrls = pdfFiles.map(file => {
      return {
        url: `/pdf/${file}`,   
        name: file,            
      };
    });
    res.status(200).json(pdfUrls);
  });
});



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
