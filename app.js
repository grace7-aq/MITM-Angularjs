
var app = angular.module("myApp", []);

// Parent Controller
app.controller("CollegeController", function($scope) {

    $scope.collegeName = "MIT Mysore";

});

// Student Controller
app.controller("StudentController", function($scope) {

    // Empty student array
    $scope.students = [];

    // Add Student Function
    $scope.addStudent = function() {

        if ($scope.name && $scope.name.trim() !== "" &&
            $scope.department && $scope.department.trim() !== "" &&
            $scope.semester) {

            // Store student details
            $scope.students.push(
                $scope.name + " - " +
                $scope.department + " - Semester " +
                $scope.semester
            );

            // Clear input fields
            $scope.name = "";
            $scope.department = "";
            $scope.semester = "";

        }
        else {

            alert("Please enter all student details");

        }

    };

});

