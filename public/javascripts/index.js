/**
 * You must include the dependency on 'ngMaterial'
 */
var app = angular.module('myApp', ['ngMaterial', 'ngMessages', 'ngRoute']);

//Setup routing so we maintain a single page app without any reloading
app.config(function ($routeProvider) {
    $routeProvider
        .when("/studentVehicle", {
            templateUrl : "Pages/studentsVehicle.html",
            controller: "studentVehicleCtrl"
        })
        .when("/instructorLesson", {
            templateUrl : "Pages/instructorLesson.html",
            controller: "instructorLessonCtrl"
        });
});

app.controller('instructorLessonCtrl', function($scope, $http) {
    $scope.isDisabled = false;          //init state of execute button
    $scope.showCard = false;             //init state of the single card containing the result
    $scope.errorInput = false;          //error message if input is not valid and execute is pressed
    $scope.instructorName = "";         //Instructor name is blank by default
    $scope.cardTheme = "dark-orange";   //set card theme

    //Function to see if required input is set.
    var requiredInputSet = function() {
        if (typeof $scope.dbuser === 'undefined' || $scope.dbuser.length === 0)
            return false;
        if (typeof $scope.dbpass === 'undefined' || $scope.dbpass.length === 0)
            return false;
        return true;
    }

    //on click function for instructor lesson execute button
    $scope.instructorLessonOnClick = function() {
        if (!requiredInputSet()) {
            console.error("Username or Password not set");
            $scope.errorInput = true;
            return;
        }
        //Disable execute button and error in case its visible
        $scope.isDisabled = true;
        $scope.errorInput = false;

        //Get username and password for oracle db from inputs
        var _username = $scope.dbuser;
        var _pass = $scope.dbpass;

        //HTTP
        $http.get('http://localhost:3000/instructorMostLessons', {
            params:{
                user: _username,
                pass: _pass
            }}).then(function (successCallback, err) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(successCallback.data);
            //Set card and unhide
            $scope.instructorName = successCallback.data[0][0];
            $scope.showCard = true;
        });
    };

});

//Set button disable logic for the controllers in the routed pages
app.controller('studentVehicleCtrl', function($scope, $http) {
    $scope.isDisabled = false;
    $scope.errorInput = false;

    var requiredInputSet = function() {
        if (typeof $scope.dbuser === 'undefined' || $scope.dbuser.length === 0)
            return false;
        if (typeof $scope.dbpass === 'undefined' || $scope.dbpass.length === 0)
            return false;
        if (typeof $scope.makeData === 'undefined' || $scope.makeData.length === 0)
            return false;
        if (typeof $scope.modelData === 'undefined' || $scope.modelData.length === 0)
            return false;
        if (typeof $scope.yearData === 'undefined' || $scope.yearData.length === 0)
            return false;
        return true;
    }

    $scope.studentVehicleOnClick = function() {
        if (!requiredInputSet()) {
            console.error("Username or Password or required fields not set");
            $scope.errorInput = true;
            return;
        }

        $scope.isDisabled = true;
        $scope.errorInput = false;

        var _username = $scope.dbuser;
        var _pass = $scope.dbpass;
        var _make = $scope.makeData;
        var _model = $scope.modelData;
        var year = $scope.yearData;

        $http.get('http://localhost:3000/studentVehicleLessonHistory', {
            params:{
                user: _username,
                pass: _pass,
                make: _make,
                model: _model,
                year: year
            }}).then(function (successCallback, err) {
            if (err) {
                console.error(err.message);
                return;
            }
            //log the data and set the result array to our result.
            //resultArray is an ng-repeat so it will create a new card for each name returned
            console.log(successCallback.data);
            $scope.resultArray = successCallback.data;
        });
    }

    $scope.cardTheme = "dark-orange";
});


//Set card themes
app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    $mdThemingProvider.theme('dark-red').backgroundPalette('red').dark();
    $mdThemingProvider.theme('teal').backgroundPalette('teal');
});