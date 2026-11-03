var app = angular.module("myApp", []);

// PARENT controller
app.controller("LibraryCtrl", function ($scope) {
    $scope.libraryName = "Maharaja Institute of Technology Library";
    $scope.search = "";
    $scope.categories = ["Science", "Computer", "History"];

    $scope.books = [
        { title: "Physics Basics", category: "Science" },
        { title: "Chemistry Fundamentals", category: "Science" },
        { title: "Biology Today", category: "Science" },
        { title: "Learning AngularJS", category: "Computer" },
        { title: "Data Structures", category: "Computer" },
        { title: "Indian History", category: "History" },
        { title: "World War II", category: "History" }
    ];

    $scope.newBook = { title: "", category: "Science" };

    $scope.addBook = function () {
        if (!$scope.newBook.title) return;
        $scope.books.push