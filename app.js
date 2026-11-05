
var app = angular.module("myApp", []);

// College Controller
app.controller("CollegeController", function ($scope) {
    $scope.collegeName = "ABC College";
});

// Student Registration Controller
app.controller("RegistrationController", function ($scope) {

    $scope.name = "john";
    $scope.department = "Computer Science";
    $scope.semester = 3;

    $scope.students = [
        "AMULYA E",
        "AKSHAY U SHET",
        "AMRUTHA H S",
        "AYUSH KUMAR K S"
    ];

    // Add student using ng-click
    $scope.addStudent = function () {

        if ($scope.name.trim() !== "") {
            $scope.students.push($scope.name);

            $scope.name = "";
        } else {
            alert("Please enter a student name");
        }
    };
});


// Student Management Controller (Supabase CRUD)
app.controller("StudentController", function ($scope, $http) {

    var API_URL = "https://vkxumfqltdfplxbvurpx.supabase.co/rest/v1/students";

    var API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreHVtZnFsdGRmcGx4YnZ1cnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NDkwOTksImV4cCI6MjEwOTMyNTA5OX0.rjDkKdVwlarXZ1gnXCPfRaBcTICa6irEtStAaEaHNgs";

    var config = {
        headers: {
            "apikey": API_KEY,
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    };

    $scope.students = [];
    $scope.student = {};

    // READ: Fetch all students
    $scope.getStudents = function () {

        $http.get(API_URL + "?select=*", config)
            .then(function (response) {
                $scope.students = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching students:", error);
                alert("Unable to fetch students");
            });
    };


    // CREATE and UPDATE: Save student
    $scope.saveStudent = function () {

        if ($scope.student.id) {

            // UPDATE
            $http.patch(
                API_URL + "?id=eq." + $scope.student.id,
                {
                    name: $scope.student.name,
                    department: $scope.student.department
                },
                config
            )
            .then(function () {

                alert("Student updated successfully!");

                $scope.student = {};
                $scope.getStudents();

            })
            .catch(function (error) {
                console.error("Update error:", error);
                alert("Unable to update student");
            });

        } else {

            // CREATE
            $http.post(
                API_URL,
                {
                    name: $scope.student.name,
                    department: $scope.student.department
                },
                config
            )
            .then(function () {

                alert("Student added successfully!");

                $scope.student = {};
                $scope.getStudents();

            })
            .catch(function (error) {
                console.error("Insert error:", error);
                alert("Unable to add student");
            });
        }
    };


    // Select student for editing
    $scope.editStudent = function (student) {

        $scope.student = angular.copy(student);

    };


    // Cancel editing
    $scope.cancelEdit = function () {

        $scope.student = {};

    };


    // DELETE: Remove student
    $scope.deleteStudent = function (id) {

        if (confirm("Are you sure you want to delete this student?")) {

            $http.delete(
                API_URL + "?id=eq." + id,
                config
            )
            .then(function () {

                alert("Student deleted successfully!");

                $scope.getStudents();

            })
            .catch(function (error) {
                console.error("Delete error:", error);
                alert("Unable to delete student");
            });
        }
    };


    // Load students when application starts
    $scope.getStudents();

});
