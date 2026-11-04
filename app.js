
// Name: Your Full Name
// Department: INFORMATION SCIENCE

var app = angular.module("studentApp", []);

// Parent Controller
app.controller("CollegeController", function($scope) {

    $scope.collegeName =
        "MAHARAJA INSTITUTE OF TECHNOLOGY, MYSURU";

});

// Child Controller
app.controller("StudentController", function($scope) {

    // Empty array to store student details
    $scope.students = [];

    // Input variables
    $scope.name = "";
    $scope.semester = "";
    $scope.marks = null;

    // Fixed department for all students
    $scope.department = "INFORMATION SCIENCE";

    // Initially hide student details
    $scope.showDetails = false;

    // Function to add student
    $scope.addStudent = function() {

        if ($scope.name && $scope.name.trim() !== "" &&
            $scope.semester !== "" &&
            $scope.semester !== null &&
            $scope.marks !== null &&
            $scope.marks !== undefined &&
            $scope.marks !== "") {

            // Store student details
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



