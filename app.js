
// Name: Your Full Name
// Department: INFORMATION SCIENCE

var app = angular.module("studentApp", []);

app.controller("CollegeController", function($scope) {

    $scope.collegeName =
        "MAHARAJA INSTITUTE OF TECHNOLOGY, MYSURU";

});

app.controller("StudentController", function($scope) {

    // Array to store student details
    $scope.students = [];

    // Input variables
    $scope.name = "";
    $scope.semester = "";
    $scope.marks = null;

    // Fixed department
    $scope.department = "INFORMATION SCIENCE";

    // Initially hide details
    $scope.showDetails = false;

    // Function to add student
    $scope.addStudent = function() {

        if ($scope.name && $scope.name.trim() !== "" &&
            $scope.semester && $scope.marks !== null &&
            $scope.marks !== undefined) {

            // Store student details in array
            $scope.students.push({

                name: $scope.name,
                department: $scope.department,
                semester: $scope.semester,
                marks: $scope.marks

            });

            // Clear input fields
            $scope.name = "";
            $scope.semester = "";
            $scope.marks = null;

        } else {

            alert("Please enter all student details");

        }

    };

});



