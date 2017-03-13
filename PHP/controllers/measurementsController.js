app.controller("measurementsController", function( $scope, measurements, $routeParams, $rootScope, $timeout ){
    $scope.project_id = $routeParams.id;
    $scope.measure = {};
    $scope.previousData = {};
    
    $scope.measure.back_site = 0;
    $scope.measure.intermediate_site = 0;
    $scope.measure.fore_site = 0;
    $scope.measure.adj = 0;
    $scope.measure.adj_rl = 0;
    $scope.measure.reduce_level = 0;
    $scope.measure.northing = 0;
    $scope.measure.easting = 0;
    
		
    $scope.layerNames = ['ELECTRICAL POLE 220 V', 'ELECTRICAL POLE 440 V', 'ELECTRICAL POLE 11 KV', 'ELECTRICAL POLE 33 KV', 'ELECTRICAL POLE 110 KV', 'ELECTRICAL POLE 220 KV', 'TRANSFERMER', 'N…..NO OF SAVE DATA IN LIST'];
	
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
                $scope.project_data = response.data.data.project[0];
            }
        });
    };
    
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
        $scope.measure.project_id = $scope.project_id;
        measurements.commonFun( $scope.measure ).then( function( response ){
            $scope.measure = {};
            $scope.loadMeasurements( $scope.project_id );
        });
    };
    
    $scope.delete = function( id ){
        var conf = confirm("Are you sure to delete?");
        if( conf ){
            $scope.measure.action = "delete";
            $scope.measure.id = id;
            measurements.commonFun( $scope.measure ).then( function( response ){
                $scope.loadMeasurements( $scope.project_id );
            });
        }
    };
	
	$scope.write_to_excel = function() {
		$(".table2excel").table2excel({
					exclude: ".noExl",
					name: "OPAMG",
					filename: "OPAMG",
					fileext: ".xls",
					exclude_img: true,
					exclude_links: true,
					exclude_inputs: true
				});
	}

    $scope.loadMeasurements( $scope.project_id );
    
      
});


