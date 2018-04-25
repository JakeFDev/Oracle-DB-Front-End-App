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
    getStudentVehicleLessonHistory(req.query.user, req.query.pass, function(result) {
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

            connection.execute(
                'SELECT name FROM EMPLOYEE',

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

function getStudentVehicleLessonHistory(username, password, callback) {
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

            connection.execute(
                'SELECT name FROM EMPLOYEE',

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