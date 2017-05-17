app.controller("measurementsController", function($scope, measurements, $routeParams, $rootScope, $timeout, $http, $location) {    $scope.project_id = $routeParams.id;    $scope.measure = {};    $scope.previousData = {};    $scope.measure.back_site = 0;    $scope.measure.intermediate_site = 0;    $scope.measure.fore_site = 0;    $scope.measure.adj = 0;    $scope.measure.adj_rl = 0;    $scope.measure.reduce_level = 0;    $scope.measure.northing = 0;    $scope.measure.easting = 0;    /* var self = this;var data = [{name: "Moroni", age: 50}];self.tableParams = new ngTableParams({}, { dataset: data}); */	$scope.config = {itemsPerPage: 5, fillLastPage: true};	$scope.measurementconfig = {itemsPerPage: 5,fillLastPage: true };	    $scope.loadMeasurements = function(id) {        $scope.measure.action = "listMeasurementReport";        $scope.measure.id = id;        measurements.commonFun($scope.measure).then(function(response) {            $scope.measurementList = response.data.data.measureData;            $scope.projectData = response.data.data.projects;            $scope.measureCount = $scope.measurementList.length;            $scope.list = response.data.data.measureData;                        $scope.measurementList = response.data.data.measureData;                    });    };    $scope.delete = function(id) {        var conf = confirm("Are you sure to delete?");        if (conf) {            $scope.measure.action = "delete";            $scope.measure.id = id;            measurements.commonFun($scope.measure).then(function(response) {                $scope.loadMeasurements($scope.project_id);            });        }    };    $scope.write_to_excel = function() {        $(".table2excel").table2excel({            exclude: ".noExl",            name: "OPAMG",            filename: "OPAMG",            fileext: ".xls",            exclude_img: true,            exclude_links: true,            exclude_inputs: true        });    };    $scope.write_to_datasheet = function() {        $(".table2datasheet").table2excel({            exclude: ".noExl",            name: "OPAMG",            filename: "OPAMG",            fileext: ".xls",            exclude_img: true,            exclude_links: true,            exclude_inputs: true        });    };	    $http.get('server/getSession.php').then(function(response) {        if (response.data.data.USER_NAME == 'Admin') {            $scope.admin = true;        } else {            $scope.admin = false;        }    });    $scope.loadMeasurements($scope.project_id);});