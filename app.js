
var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {

    // Two-way data binding
    $scope.username = "";
    $scope.age = "";

    // One-way data binding (display values)
    $scope.department = "Information science";
    $scope.semester = 3;

});
