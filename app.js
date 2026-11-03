var app = angular.module("myApp", []);

app.controller("collegectrl", function ($scope) {
    $scope.name = "sherin grace";
    $scope.department = "ISE";
    $scope.college = {
        name: "maharaja institute of technology",
        department: "ISE"
    };
});

