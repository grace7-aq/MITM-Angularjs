var app = angular.module('myApp', []);
var app = angular.module("studentApp", []);

//parent controller
app.controller("StudentController", function ($scope, $http) {

app.controller('CollegeController', function($scope) {
    $scope.collegeName = "abc college";
});
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
            });
    };

    // CREATE: Add a student
    // UPDATE: Edit an existing student
    $scope.saveStudent = function () {

        if ($scope.student.id) {

            $http.patch(
                API_URL + "?id=eq." + $scope.student.id,
                {
                    name: $scope.student.name,
                    department: $scope.student.department
                },
                config
            ).then(function () {
                $scope.student = {};
                $scope.getStudents();
            });

        } else {

//child controller

app.controller(
    "StudentController", function($scope) {
        $scope.name = "john";
        $scope.department = "Computer Science";
        $scope.semester = 3;

        //aray
        $scope.students =[
            "AMULYA E",
            "AKSHAY U SHET",
            "AMRUTHA H S",
            "AYUSH KUMAR K S",
        ];

//function to add a student ussing ng click
        $scope.addStudent = function() {
            if ($scope.name.trim() !==""){
                $scope.students.push($scope.name);
                $scope.name = "";
            }
            else{
                alert("Please enter a student name");
            }
        };
        
    }
);
            $http.post(API_URL, $scope.student, config)
                .then(function () {
                    $scope.student = {};
                    $scope.getStudents();
                });

        }
    };

    // Select a student for editing
    $scope.editStudent = function (student) {
        $scope.student = angular.copy(student);
    };

    // Cancel editing
    $scope.cancelEdit = function () {
        $scope.student = {};
    };

    // DELETE: Remove a student
    $scope.deleteStudent = function (id) {
        $http.delete(API_URL + "?id=eq." + id, config)
            .then(function () {
                $scope.getStudents();
            });
    };

    // Load students when the application starts
    $scope.getStudents();

});
