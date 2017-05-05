var app = angular.module('myApp',['ngRoute', 'ngMessages', "angucomplete-alt", "angular-table"]);

app.config( function( $routeProvider ){
    
    $routeProvider
        .when("/",{
            templateUrl: "pages/login.html",
            controller: "loginController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/projects');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })
        .when("/registration", {
            templateUrl: "pages/registration.html",
            controller: "registrationController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code != 200 ){ 
                            $location.path('/registration');
                        }else{
                            $location.path('/dashboard');
                        }
                    });                        
                }
            }
        })
        .when("/forget-password", {
            templateUrl: "pages/forget-password.html",
            controller: "registrationController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code != 200 ){ 
                            $location.path('/forget-password');
                        }else{
                            $location.path('/dashboard');
                        }
                    });                        
                }
            }
        })
        .when("/projects", {
            templateUrl: "pages/projects.html",
            controller: "projectsController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/projects');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })        
        .when("/dashboard", {
            templateUrl: "pages/dashboard.html",
            controller: "dashboardController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/dashboard');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })
        .when("/users", {
            templateUrl: "pages/users.html",
            controller: "usersController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/users');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })
        .when("/roles", {
            templateUrl: "pages/roles.html",
            controller: "rolesController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/roles');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })
        .when("/equipments", {
            templateUrl: "pages/equipments.html",
            controller: "equipmentsController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/equipments');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })
        .when("/layers", {
            templateUrl: "pages/layers.html",
            controller: "layersController",
            resolve:{
                "check":function($location, $http){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 
                            $location.path('/layers');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })                
        .when("/measurements/:id", {
            templateUrl: "pages/measurements.html",
            controller: "measurementsController",
            resolve:{
                "check":function($location, $http, $routeParams){
                    $http.get('server/getSession.php').then( function( response ){
                        if( response.data.code == 200 ){ 							setTimeout(function(){								 var id = $routeParams.id;								$location.path('/measurements/'+id);							},500);
                           
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        })
        .when("/logout",{
            resolve:{
                "check":function($location, $http){
                    $http.get('server/logout.php').then( function( response ){
                        if( response.data == 200 ){ 
                            $location.path('/');
                        }else{
                            $location.path('/');
                        }
                    });                        
                }
            }
        });
});

app.run( function( $rootScope ){
    $rootScope.token = 'b72ca621f8e147274c8189ee440916b6';
});
app.factory( "login", function( $http, $rootScope ){
	return {
            doLogin: function(data){
                return $http.post('server/login.php',{data: data}, {headers: {'login_token': $rootScope.token }});
            }
	}
});

app.factory( "users", function( $http, $rootScope ){
    return{
        commonFun: function( data ){
            return $http.post('server/users.php',{data: data}, {headers: {'login_token': $rootScope.token }});
        }
    }
});

app.factory( "roles", function( $http, $rootScope ){
    return{
        commonFun: function( data ){
            return $http.post('server/roles.php',{data: data}, {headers: {'login_token': $rootScope.token }});
        }
    }
});

app.factory( "equ", function( $http, $rootScope ){
    return{
        commonFun: function( data ){
            return $http.post('server/equipment.php',{data: data}, {headers: {'login_token': $rootScope.token }});
        }
    }
});

app.factory( "layers", function( $http, $rootScope ){
    return{
        commonFun: function( data ){
            return $http.post('server/layers.php',{data: data}, {headers: {'login_token': $rootScope.token }});
        }
    }
});

app.factory( "project", function( $http, $rootScope ){
    return{
        commonFun: function( data ){
            return $http.post('server/projects.php',{data: data}, {headers: {'login_token': $rootScope.token }});
        }
    }
});

app.factory( "measurements", function( $http, $rootScope ){
    return{
        commonFun: function( data ){
            return $http.post('server/measurements.php',{data: data}, {headers: {'login_token': $rootScope.token }});
        }
    }
});

app.filter('range', function () {
  return function (input, total) {
    total = parseInt(total);
    for (var i = 0; i < total; i++) {
      input.push(i);
    }
    return input;
  }; //filter range
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
   };
}]);
app.controller("loginController", function( $scope, login, $location ){
    $scope.login = {};
	
    $scope.loginUser = function(){
        login.doLogin($scope.login).then( function(response){
            if( response.data.code == '200'){
                $location.path('/projects');
            }else{
                alert('Login Error');
            }
        });
    }
});
// We can write our own fileUpload service to reuse it in the controller
app.factory('fileUpload', ['$http', function ($http) {
    return{
		uploadFileToUrl : function(file, uploadUrl, name){
			var fd = new FormData();
			fd.append('file', file);
			fd.append('name', name);
			return $http.post(uploadUrl, fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined,'Process-Data': false}});
		}
    }
 }]);
 
app.controller("registrationController", function($scope, users, $location, $http){
    $scope.registration = {};    
    $scope.addUser = function(){ 
        $scope.registration.action = "add";
        users.commonFun( $scope.registration ).then( function(response){
            if( response.data.code == '200'){
                $scope.message = "Successfully Added";
                $scope.class = "success";
				$location.path("/");
            }else{
                $scope.message = response.data.message; 
                $scope.class = "error";
            }
        });
    }
    
    $scope.sendMail = function(){
        $scope.registration.action = "senMail";
        users.commonFun( $scope.registration ).then( function(response){
            if( response.data.code == '200'){
                $scope.message = "Check Your Mail Box";
                $scope.class = "success";
            }else{
                $scope.message = "Email ID Not Registered with us!";
                $scope.class = "error";
            }
        });
    }
});

app.controller("sidebarController", function($scope, $http){
    $("#wrapper").addClass('forced');
    $scope.pass = {};
    $scope.hideMenu = function(){
        if($("#wrapper").hasClass("enlarged"))
            $("#wrapper").removeClass('enlarged');
        else
            $("#wrapper").addClass('enlarged');
    } 
    
	var active = window.location.hash;
	if( active == '#!/projects'){
		$scope.activeProject = 'active'
	}else if( active == '#!/users'){
		$scope.activeUser = 'active'
	}else if( active == '#!/roles'){
		$scope.activeRoles = 'active'
	}else if( active == '#!/layers'){
		$scope.activeLayers = 'active'
	}else if( active == '#!/equipments'){
		$scope.activeEqui = 'active'
	}else{
		$scope.activeProject = 'active'
	}
	
	$http.get('server/getSession.php').then( function( response ){
		$scope.session_name = response.data.data.USER_NAME;
	});
					
    $scope.showChangePopup = function(){
        $("#custom-width-modal").modal('show');
        setTimeout( function(){
            $('.modal-backdrop').remove();
        },500);        
    }
    
    $scope.changePassword = function(){
        $scope.pass.action = "changePassword";
        changePassword.changePass( $scope.pass ).then( function(response){
            if( response.data.code == '200'){
                $("#custom-width-modal").modal('hide');
            }
        });
    }
});


app.controller("dashboardController", function($scope){
    
});
app.controller("usersController", function($scope, users, roles){
    $scope.listOfUsers = {};
    $scope.changeStatus = {};
    $scope.userRole = {};
    //$scope.role = [{'type': 'officer'},{'type': 'survivor'}];
    $scope.listUser = function(){ 
        $scope.listOfUsers.action = "list";
        users.commonFun( $scope.listOfUsers ).then( function(response){
            if( response.data.code == '200'){
               $scope.usersList = response.data.data;
            }else{
                
            }
        });
    }    
    $scope.edit = function( id ){
        $scope.listOfUsers.action = "edit";
        $scope.listOfUsers.id = id;
        users.commonFun( $scope.listOfUsers ).then( function(response){
            if( response.data.code == '200'){
               $scope.registration = response.data.data;
                $("#update-users-modal").modal('show');
            }else{
                
            }
        });       
    }
    $scope.updateUser = function(){
        $scope.registration.action = "update";
        users.commonFun( $scope.registration ).then( function(response){
            if( response.data.code == '200'){
                $scope.message = '';                        
                $("#update-users-modal").modal('hide');
            }else{
                $scope.message = response.data.message;
                $scope.class = 'error';
            }
        });       
    }    
    $scope.approve = function( status="", id="" ){
        if( $scope.changeStatus.id == undefined || $scope.changeStatus.id == '' ){
            $("#assign-role-modal").modal();
            $scope.changeStatus.action = "changeStatus";
            $scope.changeStatus.currentStatus = status;
            $scope.changeStatus.id = id;
        }else{
            //var conf = confirm("Are you sure to change the Status?");
            //if(conf){
                $scope.changeStatus.role = $scope.roles.type;
               users.commonFun( $scope.changeStatus ).then( function(response){
                    if( response.data.code == '200'){
                        $scope.changeStatus.id = '';
                        $("#assign-role-modal").modal('hide');
                        $scope.listUser();
                    }
                });   
            //}  
        }      
    }
    $scope.delete = function( id ){
        $scope.changeStatus.action = "delete";
        $scope.changeStatus.id = id;
        
        var conf = confirm("Are you sure to delete?");
        if(conf){
           users.commonFun( $scope.changeStatus ).then( function(response){
                if( response.data.code == '200'){
                    $scope.listUser();
                }
            });   
        }             
    }
	$scope.exportToCSV = function(){
		$("#users").tableToCSV();
	}
	
	$scope.listRole = function(){ 
        $scope.userRole.action = "list";
        roles.commonFun( $scope.userRole ).then( function(response){
            if( response.data.code == '200'){
               $scope.role = response.data.data;
			   console.log($scope.role)
            }else{
                
            }
        });
    } 
	
    $scope.listUser();
    $scope.listRole();
});

app.controller("rolesController", function($scope, roles){
    $scope.userRole = {};
    $scope.changeStatus = {};
    var editId;
	
    $scope.listRole = function(){ 
        $scope.userRole.action = "list";
        roles.commonFun( $scope.userRole ).then( function(response){
            if( response.data.code == '200'){
               $scope.usersList = response.data.data;
            }else{
                
            }
        });
    } 	
    
    $scope.edit = function( val ){
		$scope.userRole.name = val.name;
		editId = val.id;
		
        $("#add-role-modal").modal();
    }
	
	$scope.addRole = function(){
        $scope.userRole.action = "add";
        $scope.userRole.id = editId;
        roles.commonFun( $scope.userRole ).then( function(response){
            if( response.data.code == '200'){				
                $("#add-role-modal").modal('hide');
				$scope.listRole();
            }else{
				$scope.userRole.name = "";
				$scope.errorMessage = response.data.message;
            }
        });       
    } 
	
	
    $scope.delete = function( id ){
        $scope.changeStatus.action = "delete";
        $scope.changeStatus.id = id;
        
        var conf = confirm("Are you sure to delete?");
        if(conf){
           roles.commonFun( $scope.changeStatus ).then( function(response){
                if( response.data.code == '200'){
                    $scope.listRole();
                }
            });   
        }             
    }
    $scope.listRole();
});

app.controller("layersController", function($scope, layers){
    $scope.mappingLayer = {};
    $scope.changeStatus = {};
    var editId;
	
    $scope.listRole = function(){ 
        $scope.mappingLayer.action = "list";
        layers.commonFun( $scope.mappingLayer ).then( function(response){
            if( response.data.code == '200'){
               $scope.usersList = response.data.data;
            }else{
                
            }
        });
    } 	
    
    $scope.edit = function( val ){
		$scope.mappingLayer.symble = val.symble;
		$scope.mappingLayer.code = val.code;
		$scope.mappingLayer.category = val.category;
		$scope.mappingLayer.description = val.description;
		
		editId = val.id;		
        $("#add-layer-modal").modal();
    }
	
	$scope.addLayer = function(){
        $scope.mappingLayer.action = "add";
        $scope.mappingLayer.id = editId;
        layers.commonFun( $scope.mappingLayer ).then( function(response){
            if( response.data.code == '200'){				
                $("#add-layer-modal").modal('hide');
				$scope.listRole();
            }else{
				$scope.errorMessage = response.data.message;
            }
        });       
    } 
	
	
    $scope.delete = function( id ){
        $scope.changeStatus.action = "delete";
        $scope.changeStatus.id = id;
        
        var conf = confirm("Are you sure to delete?");
        if(conf){
           layers.commonFun( $scope.changeStatus ).then( function(response){
                if( response.data.code == '200'){
                    $scope.listRole();
                }
            });   
        }             
    }
    $scope.listRole();
});


app.controller("equipmentsController", function($scope, equ){
    $scope.equipent = {};
    $scope.changeStatus = {};
    var editId;
	
    $scope.listRole = function(){ 
        $scope.equipent.action = "list";
        equ.commonFun( $scope.equipent ).then( function(response){
            if( response.data.code == '200'){
               $scope.usersList = response.data.data;
            }else{
                
            }
        });
    } 	
    
    $scope.edit = function( val ){
		$scope.equipent.model = val.model_number;
		$scope.equipent.calibration = val.last_calibration_service_center;
		$scope.equipent.exp_date = new Date(val.expiry_date);
		$scope.equipent.least_count = val.least_count;
		$scope.equipent.owner = val.owner;
		editId = val.id;
		
        $("#add-role-modal").modal();
    }
	
	$scope.add = function(){
        $scope.equipent.action = "add";
        $scope.equipent.id = editId;
        equ.commonFun( $scope.equipent ).then( function(response){
            if( response.data.code == '200'){				
                $("#add-role-modal").modal('hide');
				$scope.listRole();
            }else{
				$scope.errorMessage = response.data.message;
            }
        });       
    } 
	
	
    $scope.delete = function( id ){
        $scope.changeStatus.action = "delete";
        $scope.changeStatus.id = id;
        
        var conf = confirm("Are you sure to delete?");
        if(conf){
           equ.commonFun( $scope.changeStatus ).then( function(response){
                if( response.data.code == '200'){
                    $scope.listRole();
                }
            });   
        }             
    }
    $scope.listRole();
});