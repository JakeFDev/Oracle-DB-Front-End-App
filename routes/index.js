var express = require('express');
var router = express.Router();

var dbConnectionUrl = "akka.d.umn.edu:1521/xe";

/** GET home page. **/
router.get('/', function (req, res) {
    res.sendFile('./public/index.html');
});

/** HTTP GET **/
router.get('/instructorMostLessons', function (req, res) {
    getInstructorMostLessons(req.query.user, req.query.pass, function(result) {
        res.send(result);
    });
});

router.get('/studentVehicleLessonHistory', function (req, res) {
    getStudentVehicleLessonHistory(req.query.user, req.query.pass, req.query.make, req.query.model, req.query.year, function(result) {
        res.send(result);
    })
});

module.exports = router;

/**
 DATABASE
 **/
var oracledb = require('oracledb');

function getInstructorMostLessons(username, password, callback) {
    oracledb.getConnection(
        {
            user    :       username,
            password:       password,
            connectString:  dbConnectionUrl
        },
        function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log("Connection was successful!");
            var query = "select name\n" +
                "from (\n" +
                "    SELECT name, COUNT(lesson.instrID) AS count\n" +
                "    FROM employee INNER JOIN lesson\n" +
                "    ON employee.empID = lesson.instrID\n" +
                "    GROUP BY name\n" +
                "    ORDER BY count DESC\n" +
                ") WHERE ROWNUM = 1";
            connection.execute(
                query,
                function(err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    console.log("Successfully retrieved data from getInstructorMostLessons call");
                    console.log(result.rows);
                    doRelease(connection);
                    callback(result.rows);
                });
        });
};

function getStudentVehicleLessonHistory(username, password, make, model, year, callback) {
    oracledb.getConnection(
        {
            user:           username,
            password:       password,
            connectString:  dbConnectionUrl
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }

            console.log("Connection was successful");
            var query = "SELECT student.name\n" +
                "FROM student\n" +
                "JOIN lesson ON (lesson.stuID = student.stuID)\n" +
                "JOIN employee ON (lesson.instrID = employee.empID)\n" +
                "JOIN vehicle ON (employee.empID = vehicle.empID)\n" +
                "JOIN vehicle ON (lesson.VIN = vehicle.VIN)\n" +
                "WHERE (vehicle.make = \'" + make + "\' AND vehicle.model = \'" + model + "\' AND vehicle.year=" + year + ")";
                console.log(query);
            connection.execute(
                query,

                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    console.log("Successfully retrieved data from getStudentVehicleLessonHistory call");
                    console.log(result.rows);
                    doRelease(connection);
                    callback(result.rows);
                });
        });
};

function doRelease(connection) {
    connection.close(function (err) {
        if (err)
            console.error(err.message);
        else
            console.log("DB Connection Released");
    });
};