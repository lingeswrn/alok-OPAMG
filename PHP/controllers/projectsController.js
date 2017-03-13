app.controller("projectsController", function( $scope, project , $location, measurements, $compile, layers){
    $scope.projectData = {};
	$scope.projectId = '';
	$scope.measure = {};
    $scope.previousData = {};
    $scope.mappingLayer = {};
    
	$scope.switchForm1 = true;
	$scope.switchForm2 = false;
		
    $scope.measure.back_site = 0;
    $scope.measure.intermediate_site = 0;
    $scope.measure.fore_site = 0;
    $scope.measure.adj = 0;
    $scope.measure.adj_rl = 0;
    $scope.measure.reduce_level = 0;
    $scope.measure.northing = 0;
    $scope.measure.easting = 0;
    
		
    //$scope.layerNames = ['ELECTRICAL POLE 220 V', 'ELECTRICAL POLE 440 V', 'ELECTRICAL POLE 11 KV', 'ELECTRICAL POLE 33 KV', 'ELECTRICAL POLE 110 KV', 'ELECTRICAL POLE 220 KV', 'TRANSFERMER', 'N…..NO OF SAVE DATA IN LIST'];	
    $scope.listLayers = function(){ 
        $scope.mappingLayer.action = "list";
        layers.commonFun( $scope.mappingLayer ).then( function(response){
            if( response.data.code == '200'){
               $scope.layerNames = response.data.data;
            }else{
                
            }
        });
    } 
		
    $scope.project_list = function(){
        $scope.projectData.action = "list";
        project.commonFun( $scope.projectData ).then( function( response ){
            $scope.projectsList = response.data.data;
        });
    }
    
    $scope.addProject = function( id ){
        $scope.projectData.action = "addProject";
        project.commonFun( $scope.projectData ).then( function( response ){
            if( response.data.code == '200' ){
                $('#add-project-modal').modal('hide');
                $scope.projectData = {};
                $scope.message = "";
                $scope.project_list();                
            }else{
                $scope.class = "error";
                $scope.message = "Project Name Already Registered!";
            }
        });
    }
    
    $scope.delete = function( id ){
        var conf = confirm("Are you sure to delete the Project?");
        if( conf ){
            $scope.projectData.action = "deleteProject";
            $scope.projectData.id = id;
            project.commonFun( $scope.projectData ).then( function( response ){
                $scope.project_list();            
            });
        }
    }
    
    $scope.edit = function( data ){
       $("#add-project-modal").modal();
       $scope.projectData.pro_company_name = data.project_name;
       $scope.projectData.pro_name = data.project_name;
       $scope.projectData.pro_date = data.date;
       $scope.projectData.pro_from = data._from;
       $scope.projectData.pro_to = data._to;
       $scope.projectData.pro_id = data.id;
       $scope.projectData.work_order_number = data.work_order_number;
       $scope.projectData.scope_of_wrk_id = data.scope_wrk;
       $scope.projectData.remarks = data.remarks;
       $scope.projectData.client_id = data.client_id;
    }
	
	
	
    function initialize_map() {
		alert()
		//geocoder = new google.maps.Geocoder();
		var myOptions = {
		   zoom: 10,
		   center: new google.maps.LatLng(23.366301, 85.304773),
		   mapTypeId: google.maps.MapTypeId.ROADMAP
		};
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		var marker = new google.maps.Marker({
			position: map.getCenter(),
			draggable: true,
			map: map
		});	
		
		
    }   
	function moveToLocation(lat, lng){
		var center = new google.maps.LatLng(lat, lng);
		// using global variable:
		map.panTo(center);
	}
	
	function getGeolocation(){
		if (navigator.geolocation) {
			var myOptions = {
			   zoom: 13,
			   center: new google.maps.LatLng(23.366301, 85.304773),
			   mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
			var marker = new google.maps.Marker({
				position: map.getCenter(),
				draggable: true,
				map: map
			});	
		  navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
			  lat: position.coords.latitude,
			  lng: position.coords.longitude
			};
			marker.setPosition(pos);
			map.panTo(pos);
		  }, function() {
			//handleLocationError(true, infoWindow, map.getCenter());
		  });
		
    
		  // intercept map and marker movements
		google.maps.event.addListener(map, "idle", function() {
			//marker.setPosition(map.getCenter());
			var latitude = map.getCenter().lat().toFixed(6);
			var longitude = map.getCenter().lng().toFixed(6);
			$scope.value = $scope.project(map.getCenter());
			$scope.measure.latitude = latitude;
			$scope.measure.longitude = longitude;
			$scope.measure.easting = $scope.value.x;
			$scope.measure.northing = $scope.value.y;
			$scope.$apply();
			google.maps.event.trigger(map, "resize");
		});
		google.maps.event.addListener(marker, "dragend", function(mapEvent) {
			$scope.value = $scope.project(mapEvent.latLng);
			$scope.measure.easting = $scope.value.x;
			$scope.measure.northing = $scope.value.y;
			$scope.$apply();
			map.panTo(mapEvent.latLng);
		});
                
				$scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];
                //var contentString = "<div><div class='form-group'> <label>Layer Library</label> <select class='form-control' id='layer'><option value='ELECTRICAL POLE 220 V' >ELECTRICAL POLE 220 V</option><option  value='ELECTRICAL POLE 440 V' >ELECTRICAL POLE 440 V</option><option  value='ELECTRICAL POLE 11 KV' >ELECTRICAL POLE 11 KV</option><option  value='ELECTRICAL POLE 33 KV' >ELECTRICAL POLE 33 KV</option><option  value='ELECTRICAL POLE 110 KV' >ELECTRICAL POLE 110 KV</option><option  value='ELECTRICAL POLE 220 KV' >ELECTRICAL POLE 220 KV</option><option  value='TRANSFERMER' >TRANSFERMER</option><option  value='N…..NO OF SAVE DATA IN LIST' >N…..NO OF SAVE DATA IN LIST</option></select> </div><div class='form-group col-sm-4'> <label>Back Site</label> <input class='form-control' type='text' placeholder='Back Site' id='back_site' value='0' ></div><div class='form-group col-sm-4'> <label>Intermediate Site</label> <input class='form-control' type='text' placeholder='Intermediate Site' id='intermediate_site' value='0'> </div><div class='form-group col-sm-4'> <label>Fore Site</label> <input class='form-control' type='text' placeholder='Fore Site' id='fore_site' value='0' ></div><button class='btn btn-primary waves-effect waves-light' ng-click='switchProject()'>Next</button></div>";
                var contentString = "<form name='opamgForm'><div class='form-group'><angucomplete-alt id='members'placeholder='Search Layers'pause='400'selected-object='testObj'remote-url='http://localhost/alok/PHP/server/getLayers.php?s='remote-url-data-field='data'title-field='code'description-field='description'minlength='1'input-class='form-control form-control-small' ng-model='measure.layer_name'/></div><div class='form-group col-sm-4'><label>Back Site</label><input autocomplete=off class=form-control name=back_site ng-blur=calHight(); ng-model='measure.back_site' placeholder='Back Site' required></div><div class='form-group col-sm-4'><label>Intermediate Site</label><input autocomplete='off' class='form-control' name='intermediate_site' ng-blur='calReduceLevel();calHight();' ng-model='measure.intermediate_site' placeholder='Intermediate Site' required></div><div class='form-group col-sm-4'><label>Fore Site</label><input autocomplete='off' class='form-control' name='fore_site' ng-blur='calReduceLevel()' ng-model='measure.fore_site' placeholder='Fore Site' required></div><button class='btn btn-primary waves-effect waves-light' ng-click='switchProject()' ng-disabled='opamgForm.$invalid'>Next</button></form>";

                    var infowindow = new google.maps.InfoWindow();
                     /*marker.addListener('click', function() {
                    infowindow.open(map, marker);
                  }); */
				  
				google.maps.event.addListener(
                    marker,
                    'click', (function(marker, $scope) {
                        return function() {
                            var compiled = $compile(contentString)($scope);
                            $scope.$apply();
							infowindow.setContent(compiled[0]);
                            infowindow.open(map, marker);
                        };
                    })(marker, $scope)
                );
				
		} else {
		  // Browser doesn't support Geolocation
		  //handleLocationError(false, infoWindow, map.getCenter());
		}
	}
	$scope.project = function (latLng) {
        var siny = Math.sin(latLng.lat() * Math.PI / 180);

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        return new google.maps.Point(
            256 * (0.5 + latLng.lng() / 360),
            256 * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
    }
    
    
	$scope.addBasic = function( id ){
		$scope.measure.back_site = 0;
		$scope.measure.intermediate_site = 0;
		$scope.measure.fore_site = 0;
		$scope.measure.adj = 0;
		$scope.measure.adj_rl = 0;
		$scope.measure.reduce_level = 0;
		$scope.measure.northing = 0;
		$scope.measure.easting = 0;
	
		$scope.switchForm1 = true;
		$scope.switchForm2 = false;
		
		$scope.project_id = id;
		$('#add-basic-modal').modal();
		$scope.loadMeasurements( id );
        getGeolocation()    
	}
	
	
    $scope.loadMeasurements = function( id ){
		
        $scope.measure.action = "listMeasurement";
        $scope.measure.id = id;
        measurements.commonFun( $scope.measure ).then( function( response ){            
            if( response.data.data.previous == null ){
                $scope.previousData.hight_of_instrument = 0;
                $scope.previousData.reduce_level = 0;
                $scope.previousData.northing = 0;
                $scope.previousData.easting = 0;
                $scope.previousData.ch = 0;
            }else{
                $scope.previousData = response.data.data.previous;
                $scope.measurementList = response.data.data.list;
				$scope.addMarker( $scope.measurementList );
            }
        });
    };
    
    $scope.addMarker = function( list ){
        for( i = 0; i < list.length; i++ ) {
            var position = new google.maps.LatLng(list[i]['lattitude'], list[i]['longitude']);
            marker = new google.maps.Marker({
                position: position,
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                map: map
            });
        }
    }
    $scope.calReduceLevel = function(){ 
        console.log($scope.measure)
        $scope.measure.reduce_level = ( $scope.previousData.hight_of_instrument - ( parseFloat($scope.measure.intermediate_site) + parseFloat($scope.measure.fore_site) ) + ( parseFloat($scope.measure.adj) ) );
        
    };
    
    
    $scope.calHight = function(){
		console.log($scope.measure)
        if( $scope.previousData.reduce_level == 0 ){
            $scope.measure.hight_of_instrument = ( parseFloat($scope.measure.reduce_level) + ( parseFloat($scope.measure.intermediate_site) + parseFloat($scope.measure.back_site) ) );

        }else{
           $scope.measure.hight_of_instrument = ( parseFloat($scope.measure.reduce_level) + ( parseFloat($scope.measure.intermediate_site) + parseFloat($scope.measure.back_site) ) );
        }
    };
    
    $scope.calOffset = function(){
        if( $scope.previousData.reduce_level == 0 ){
            $scope.measure.offset_length = 0;
            $scope.calCH();
        }else{
            $scope.measure.offset_length = Math.sqrt( Math.pow(( $scope.previousData.northing - $scope.measure.northing ),2) + Math.pow( ( $scope.previousData.easting - $scope.measure.easting ) , 2)).toFixed(3);
            $scope.calCH(); 
        }
    };
    
    $scope.calCH = function(){
        $scope.measure.ch =  (parseFloat($scope.previousData.ch) + parseFloat($scope.measure.offset_length)).toFixed(3);
    };
    
    $scope.addMeasurement = function(){
        $scope.measure.action = "add";
        $scope.measure.id = $scope.project_id;
        $scope.measure.updatedDate = new Date();
        measurements.commonFun( $scope.measure ).then( function( response ){
			if( $scope.measure.intermediate_site != 0 ){
				$scope.measure = {};
				$scope.switchForm1 = true;
				$scope.switchForm2 = false;
				$scope.loadMeasurements( $scope.project_id );
			}else{
				$scope.measure = {};
				$('#add-basic-modal').modal('hide');
				$scope.loadMeasurements( $scope.project_id );
			}
            $scope.project_list();
        });
    };
	$scope.switchProject = function(){
		/* $scope.measure.layer_name = $('#layer').val();
		$scope.measure.back_site = $('#back_site').val();
		$scope.measure.intermediate_site = $('#intermediate_site').val();
		$scope.measure.fore_site = $('#fore_site').val(); */
		console.log($scope.measure)
		$scope.switchForm1 = false;
		$scope.switchForm2 = true;
	}
    
	$scope.exportToCSV = function(){
		$("#projects").tableToCSV();
	}
    $scope.project_list();
	$scope.listLayers();
    getGeolocation();
});

