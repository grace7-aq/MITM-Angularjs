var app = angular.module("myApp", []);

// Student Management Controller (Supabase CRUD)
app.controller("StudentController", function ($scope, $http) {

    var API_URL = "https://vkxumfqltdfplxbvurpx.supabase.co/rest/v1/students";

    var API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreHVtZnFsdGRmcGx4YnZ1cnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NDkwOTksImV4cCI6MjEwOTMyNTA5OX0.rjDkKdVwlarXZ1gnXCPfRaBcTICa6irEtStAaEaHNgs";

    var config = {
        headers: {
            "apikey": API_KEY,
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
    };

    $scope.students = [];
    $scope.student = {};

    // Shows the real reason from Supabase instead of a generic message
    function errorText(error) {
        if (error && error.data && error.data.message) {
            return error.data.message;
        }
        return "Status " + (error && error.status);
    }

    // READ
    $scope.getStudents = function () {
        $http.get(API_URL + "?select=*&order=id.asc", config)
            .then(function (response) {
                $scope.students = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching students:", error);
                alert("Unable to fetch students: " + errorText(error));
            });
    };

    // CREATE and UPDATE
    $scope.saveStudent = function () {

        var data = {
            name: $scope.student.name,
            department: $scope.student.department
        };

        if ($scope.student.id) {
            // UPDATE
            $http.patch(API_URL + "?id=eq." + $scope.student.id, data, config)
                .then(function () {
                    alert("Student updated successfully!");
                    $scope.student = {};
                    $scope.getStudents();
                })
                .catch(function (error) {
                    console.error("Update error:", error);
                    alert("Unable to update student: " + errorText(error));
                });
        } else {
            // CREATE
            $http.post(API_URL, data, config)
                .then(function () {
                    alert("Student added successfully!");
                    $scope.student = {};
                    $scope.getStudents();
                })
                .catch(function (error) {
                    console.error("Insert error:", error);
                    alert("Unable to add student: " + errorText(error));
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

    // DELETE
    $scope.deleteStudent = function (id) {
        if (confirm("Are you sure you want to delete this student?")) {
            $http.delete(API_URL + "?id=eq." + id, config)
                .then(function () {
                    alert("Student deleted successfully!");
                    $scope.getStudents();
                })
                .catch(function (error) {
                    console.error("Delete error:", error);
                    alert("Unable to delete student: " + errorText(error));
                });
        }
    };

    // Load students when page opens
    $scope.getStudents();
});