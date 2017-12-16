var domain = 'https://animalrestapi.azurewebsites.net/';
var userkey = '?candidateID=54182bc3-6154-465c-a88e-36f810191b9a';
var app = angular.module("animalDatabase", ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "animals.html",
        controller : "readAll"
    })
    .when("/animal/:id", {
        templateUrl : "animal.html",
        controller: "readAnimal"
    })
    .when("/addanimal", {
        templateUrl : "addanimal.html",
        controller : "addAnimal"
    })
});

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
}]);

app.controller("readAll", function ($scope, $http) {

    $scope.readAll = function(){
        $http.get(domain + 'Animal/List' + userkey).
            then(function (response) {
                if(response.data.status == "OK"){
                    $scope.animals = response.data.list;
                } else {
                    alert('Error retriving Animal List');
                }
            });
    }
    
    $scope.deleteAnimal = function(deleteID){
        var dataObj = $.param({
            id: deleteID
        });
        if (confirm("Are you sure you want to delete this animal?") == true){
            $http.post(domain + 'Animal/Delete' + userkey, dataObj).
                then(function (response){
                    if (response.data.status != "OK"){
                        alert(response.data.status);
                    }
                });
            $scope.readAll();
        }
    }

    $scope.readAll();
});

app.controller("readAnimal", function ($scope, $http, $routeParams, $location) {
    $scope.readAnimal = function (id) {
        $http.get(domain + 'Animal/Id/' + id + userkey).
            then(function (response) {
                if (response.data.status == "OK") {
                    $scope.animal = response.data.animal;
                } else {
                    alert('Error retriving Animal');
                }
            });
    }
    var url = $location.path().split('/');
    $scope.readAnimal(url[2]);
});

app.controller("addAnimal", function ($scope, $http, $location){
    $scope.createAnimal = function () {

        if ($scope.commonName.length > 0){
            var dataObj = $.param({
                commonName: $scope.commonName,
                scientificName: $scope.scientificName,
                family: $scope.family,
                imageURL: $scope.imageURL
            });
            $http.post(domain + 'Animal/Create' + userkey, dataObj).
                then(function (response) {
                    if (response.data.status == "OK") {
                        $location.path("/");
                    } else {
                        alert(response.data.status);
                    }
                });
        } else {
            alert("You must specify a Common Name for the animal.")
        }
    }

    $scope.commonName = '';
    $scope.scientificName = '';
    $scope.family = '';
    $scope.imageURL = '';
})