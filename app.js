
var app = angular.module("myApp", []);

// Parent Controller
app.controller("CollegeController", function($scope) {
    $scope.collegeName = "MIT Mysore";
});

// Student Controller
app.controller("StudentController", function($scope) {

    // Empty student array
    $scope.students = [];

    // Function to add student
    $scope.addStudent = function() {

        if ($scope.name && $scope.department && $scope.semester) {

            // Store student details in array
            $scope.students.push({
                name: $scope.name,
                department: $scope.department,
                semester: $scope.semester
            });

            // Clear input fields
            $scope.name = "";
            $scope.department = "";
            $scope.semester = "";

        } else {
            alert("Please enter all student details!");
        }

    };

});

