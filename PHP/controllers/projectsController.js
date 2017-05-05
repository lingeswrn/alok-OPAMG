app.controller("projectsController", function( $scope, project , $location, measurements, $compile, layers, equ, fileUpload, $http){
    $scope.projectData = {};
	$scope.projectId = '';
	$scope.measure = {};
    $scope.previousData = {};
    $scope.mappingLayer = {};
    $scope.equipent = {};
    $scope.summary = {};
	$scope.numbers = ["1"];
	
	$scope.switchForm1 = true;
	$scope.switchForm2 = false;
	$scope.addMeasurementHolder = false;
	$scope.addMeasurementListHolder = true;
	$scope.showMeasurements = false;
		
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
	
	$scope.choices = [{id: 'choice1'}];
  
	  $scope.addNewChoice = function() {
		var newItemNo = $scope.choices.length+1;
		$scope.choices.push({'id':'choice'+newItemNo});
	  };
		
	  $scope.removeChoice = function() {
		var lastItem = $scope.choices.length-1;
		$scope.choices.splice(lastItem);
	  };
	
	$scope.addSectionByChainage = function(){		
		$scope.cookieCheck = getCookie( $scope.project_id );
		if( $scope.cookieCheck != "" )
			$scope.choices = JSON.parse($scope.cookieCheck);
		else
			$scope.choices = [{id: 'choice1'}];
		$scope.switchForm1 = false;
		$scope.switchForm2 = false;
		$scope.switchForm3 = true;
	};
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	$scope.cancelCH = function(){
		$scope.switchForm1 = true;
		$scope.switchForm2 = true;
		$scope.switchForm3 = false;
	};
	
    function initialize_map() {
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
				//center: new google.maps.LatLng(23.366301, 85.304773),
				mapTypeId: 'satellite',
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.TOP_CENTER
				},
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				scaleControl: true,
				streetViewControl: true,
				streetViewControlOptions: {
					position: google.maps.ControlPosition.LEFT_TOP
				},
				fullscreenControl: true
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
			window.setTimeout(function() {
				map.panTo(marker.getPosition());
			  }, 1000);
			//map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
			map.setZoom(19); 
		  }, function() {
				alert("Not getting location. Make sure you turn on your location.");
				var pos = {
			  lat: 23.366301,
			  lng: 85.304773
			};
			marker.setPosition(pos);
			window.setTimeout(function() {
				map.panTo(marker.getPosition());
			  }, 1000);
			//map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
			map.setZoom(19); 
		  });
		
    
		  // intercept map and marker movements
		google.maps.event.addListener(map, "idle", function( res ) {
			//marker.setPosition(map.getCenter());
			//getCoOrdinates(map);
			google.maps.event.trigger(map, "resize");
		});
		google.maps.event.addListener(marker, "dragend", function(mapEvent) {	
			getCoOrdinates(mapEvent);
			map.panTo(mapEvent.latLng);
		}); 
				google.maps.event.addListener(
                    marker,
                    'click', (function(marker, $scope) {
                        return function( res ) {
							
							getCoOrdinates(res);
							
							if( $scope.previousDataLength != 0 )
								$scope.first = true;
							
							$scope.switchForm1 = false;
							$scope.switchForm2 = true;
							$scope.measure.number = 1;
							document.webkitCancelFullScreen();
							$scope.$apply();
							
                        };
                    })(marker, $scope)
                );
				
		} else {
		  // Browser doesn't support Geolocation
		  //handleLocationError(false, infoWindow, map.getCenter());
		}
	}    
    
	$scope.moveNext = function(){
		var marker = new google.maps.Marker({
				position: map.getCenter(),
				draggable: true,
				map: map
			});	
		console.log(marker.getPosition());
		var response = {};
		console.log(marker.getPosition().lat())
		response.latLng = marker.getPosition();
		getCoOrdinates(response);
							
		if( $scope.previousDataLength != 0 )
			$scope.first = true;
		
		$scope.switchForm1 = false;
		$scope.switchForm2 = true;
		$scope.switchForm3 = false;
		$scope.measure.number = 1;
		document.webkitCancelFullScreen();
	}
	function getCoOrdinates(res){
		var latitude = res.latLng.lat();
		var longitude = res.latLng.lng();	

		$scope.value = GeogToUTM(res.latLng);
		$scope.measure.latitude = latitude;
		$scope.measure.longitude = longitude
		$scope.measure.latitudeDMS = $scope.value.latitude.D +", "+ $scope.value.latitude.M +", "+$scope.value.latitude.S;
		$scope.measure.longitudeDMS = $scope.value.longitude.D +", "+ $scope.value.longitude.M +", "+$scope.value.longitude.S;
		$scope.measure.easting = $scope.value.easting;
		$scope.measure.northing = $scope.value.northing;
		$scope.measure.zone = $scope.value.zone;
		
                if( $scope.previousDataLength != 0 ){
		$scope.measure.n_offset = $scope.calNOffset( $scope.measure.northing, $scope.previousData.utm_northing );
		$scope.measure.e_offset = $scope.calEOffset( $scope.measure.easting, $scope.previousData.utm_easting );
		$scope.measure.gps_offset_length = $scope.calGPSOffsetLength( $scope.measure.northing, $scope.measure.easting, $scope.previousData.utm_northing, $scope.previousData.utm_easting, $scope.measure.n_offset, $scope.measure.e_offset);				
		$scope.measure.ch = $scope.calMappingCh( $scope.measure.n_offset, $scope.measure.gps_offset_length, $scope.previousData.mapping_ch );
		
                }else{
                   $scope.measure.n_offset = 0;
$scope.measure.e_offset =0;
$scope.measure.gps_offset_length =0;
$scope.measure.ch = 0;
                 }
	};
	
	$scope.addBasic = function( id ){
		
		$scope.switchForm1 = true;
		$scope.switchForm2 = false;
		
		$scope.project_id = id;
		
		$scope.addMeasurementHolder = true;
		$scope.addMeasurementListHolder = false;
		$scope.showMeasurements = true;
		$scope.cookieCheck = getCookie( id );
		$scope.loadMeasurements( id );
        getGeolocation();
	}
	
	$scope.calNOffset = function( currentNorthing, previousNorthing ){
		var returnData;
		
		if( currentNorthing > 0 ){
			returnData = parseFloat(currentNorthing) - parseFloat(previousNorthing);
		}else{
			returnData = 0;
		}
		return returnData.toFixed(3);
	};
	
	$scope.calEOffset = function( currentEasting, previousEasting ){
		var returnData;
		
		if( currentEasting > 0 ){
			returnData = parseFloat(currentEasting) - parseFloat(previousEasting);
		}else{
			returnData = 0;
		}
		return returnData.toFixed(3);
	};
	
	$scope.calGPSOffsetLength = function( currentNorthing, currentEasting, previousNorthing, previousEasting, currentNOffset, currentEOffset ){
		var returnData;
		
		if( currentNorthing != 0 || currentEasting != 0){
			returnData = Math.pow(Math.pow(( parseFloat(currentEasting) - parseFloat(previousEasting)),2) + Math.pow((parseFloat(currentNorthing) - parseFloat(previousNorthing)),2),0.5);
		}else{
			returnData = 0;
		}
		return returnData.toFixed(3);
	};
	
	$scope.calMappingCh = function( currentNOffset, currentGPSOffset, previousCH ){
		var returnData;
		//if( currentNOffset > 0 ){
			returnData = parseFloat(currentGPSOffset) + parseFloat(previousCH);
		//}else{
		//	returnData = 0;
		//}
		return returnData.toFixed(3);
	};
	
    $scope.loadMeasurements = function( id ){
		
        $scope.measure.action = "listMeasurement";
        $scope.measure.id = id;
        measurements.commonFun( $scope.measure ).then( function( response ){
            if( response.data.data.previous == null ){
                $scope.measure.ch = 0;
                $scope.measure.measurement_ch = 0;
                $scope.measure.gps_offset_length = 0;
                $scope.measure.n_offset = 0;
                $scope.measure.e_offset = 0;
				$scope.measure.angleRedians = 0.000;
				$scope.previousDataLength = 0;
            }else{
				
                $scope.previousData = response.data.data.previous;				
                $scope.measurementList = response.data.data.list;
				$scope.first = true;
				$scope.previousEquipment = $scope.previousData.equipement_id;
				$scope.readEquipment($scope.previousEquipment);				
				$scope.addMarker( $scope.measurementList );
				var keys = Object.keys($scope.previousData);
				$scope.previousDataLength = keys.length
            }
        });
    };
    
    $scope.addMarker = function( list ){	
		marker = [];
        for( i = 0; i < list.length; i++ ) {
            var position = new google.maps.LatLng(list[i]['lattitude'], list[i]['longitude']);
            marker[i] = new google.maps.Marker({
                position: position,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+ (i + 1) +'|'+list[i]['symble'],
                map: map,
				animation: google.maps.Animation.DROP,
				id: list[i]['id']
            });
			//icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|'+list[i]['symble'],
			(function (i) {
				google.maps.event.addListener(marker[i], 'click', function () {
					$scope.detailPopup(marker[i]['id']);
				});
			})(i);
        }
    }
    
	$scope.detailPopup = function( id ){
		$scope.summary.id = id;
		$scope.summary.action = 'measureData';
		measurements.commonFun( $scope.summary ).then( function( response ){
			$scope.measureDataResponse = response.data.data.measureData;
			$scope.GPSDataResponse = response.data.data.gpsReadings;
			$scope.GPSDataResponseLat = $scope.GPSDataResponse[0];
			$scope.GPSDataResponseLng = $scope.GPSDataResponse[1];
			$("#show-measurements-modal").modal();
		});
	};
	
	$scope.calSiteOffset = function( dataInput ){
		var returnVal;
		//if( $scope.previousData == null ){
		if( $scope.previousDataLength == 0 ){
			if( dataInput.length > 1 ){
				if( dataInput[0] > 0 && dataInput[2] > 0){
					returnVal = (( dataInput[0] - dataInput[2] )*100)
				}else{
					returnVal = 0;
				}
			}else{
				returnVal = dataInput[0];
			}
		}else{
			if( dataInput.length > 1 ){
				returnVal = (( dataInput[0] - dataInput[2] )*100);
			}else{
				returnVal = dataInput[0];
			}
		}
		return isNaN(Math.round(returnVal)) ? 0 : Math.round(returnVal);
	};
	
	$scope.calSiteOffsetSumMean = function( dataInput ){
		var sum = 0, mean = 0;
		if( dataInput.length > 1 ){
			for( j=0; j < dataInput.length; j++ ){
				sum += dataInput[j];
			}			
			mean = sum/dataInput.length;
		}else{
			sum = dataInput[0];
			mean = dataInput[0];
		}
		sum = isNaN( sum ) ? 0 : sum;
		mean = isNaN( mean ) ? 0 : mean;
		
		return {'sum': sum.toFixed(3), 'mean': mean.toFixed(3)};
	};
	
	$scope.calRiseFall = function( bsMean, fsMean ){
		var rise, fall;
		// Calculate Rise Plus
		if( bsMean > fsMean ){
			rise = bsMean - fsMean;
		}else{
			rise = 0;
		}
		
		// Calculate Fall Minus
		if( bsMean < fsMean ){
			fall = fsMean - bsMean;
		}else{
			fall = 0;
		}
		
		return {'rise': rise.toFixed(3), 'fall': fall.toFixed(3) };
	};
	$scope.calCheckedReduceLevel = function( previousHightOfInstrument, currentISMean, currentFSMean ){
		var returnVal = ($scope.measure.tbm_rl == undefined) ? 0.000 : parseFloat($scope.measure.tbm_rl);
		
		if( $scope.previousDataLength == 0 ){			
			return parseFloat(returnVal).toFixed(3);
		}else{
			if( returnVal > 0 ){
				return parseFloat(returnVal).toFixed(3);
			}else{
				return parseFloat(previousHightOfInstrument) - ( parseFloat(currentISMean) + parseFloat(currentFSMean) );
			}
		}
	};
	
	$scope.calReduceLevel = function( previousHightOfInstrument, currentISMean, currentFSMean ){
		if( $scope.previousDataLength == 0 ){
			return $scope.measure.checkedReduceLevel;
		}else{
			return parseFloat(previousHightOfInstrument) - ( parseFloat(currentISMean) + parseFloat(currentFSMean) );
		}
	};
	
	$scope.calheightOfInstrument = function( checkedReduceLevel, bsOffsetMean, isOffsetMean ){
		var returnData;
		returnData = parseFloat(checkedReduceLevel) + ( parseFloat(bsOffsetMean) + parseFloat(isOffsetMean) );
		return isNaN(returnData.toFixed(3)) ? 0.000 : returnData.toFixed(3);
	};
	
	$scope.calAdjustmentError = function( tbm_rl, reduceLevel){
		var returnData;
		if( tbm_rl > 0 ){
			returnData = parseFloat(reduceLevel) - parseFloat(tbm_rl);
		}else{
			returnData = 0.000;
		}		
		return returnData.toFixed(3);
	};
	
	$scope.calChByAutoLevel = function( previousCHAutoLevel, currentBS, currentFS){
		if( $scope.previousDataLength == 0 ){
			return "0";
		}else{
			return parseFloat(previousCHAutoLevel) + parseFloat(currentBS) + parseFloat(currentFS);
		}
	};
	
	$scope.calMeasurementCH = function(){
		$scope.measure.xSection = ($scope.measure.xSection == undefined) ? 0.000 : parseFloat($scope.measure.xSection);
		$scope.measure.lSection = ($scope.measure.lSection == undefined) ? 0.000 : parseFloat($scope.measure.lSection);
		if( $scope.previousDataLength != 0 ){
			if( $scope.measure.xSection > 0 ){
				$scope.measure.measurement_ch = parseFloat($scope.previousData.measurment_ch);
			}else{
				$scope.measure.measurement_ch = parseFloat($scope.previousData.measurment_ch) + parseFloat($scope.measure.lSection)
			}
		}
	};
	$scope.calCoreCal = function(){
		$scope.measure.backSite = [];
		$scope.measure.intermediateSite = [];
		$scope.measure.foreSite = [];
		
		for( var j = 1; j <= $scope.measure.number; j++ ){
			$scope.measure.backSite.push( parseFloat($("#back_site_"+ j).val()) );
			$scope.measure.intermediateSite.push( parseFloat($("#intermediate_site_"+ j).val()) );
			$scope.measure.foreSite.push( parseFloat($("#fore_site_"+ j).val()) );
		}
		
		$scope.measure.bsOffset = $scope.calSiteOffset( $scope.measure.backSite );
		$scope.measure.isOffset = $scope.calSiteOffset( $scope.measure.intermediateSite );
		$scope.measure.fsOffset = $scope.calSiteOffset( $scope.measure.foreSite );
		
		var bsSumMean = $scope.calSiteOffsetSumMean( $scope.measure.backSite );
		var isSumMean = $scope.calSiteOffsetSumMean( $scope.measure.intermediateSite );
		var fsSumMean = $scope.calSiteOffsetSumMean( $scope.measure.foreSite );		
		$scope.measure.bsOffsetSum = bsSumMean.sum;
		$scope.measure.bsOffsetMean = bsSumMean.mean;
		$scope.measure.isOffsetSum = isSumMean.sum;
		$scope.measure.isOffsetMean = isSumMean.mean;
		$scope.measure.fsOffsetSum = fsSumMean.sum;
		$scope.measure.fsOffsetMean = fsSumMean.mean;
		
		var bsRiseFall = $scope.calRiseFall( $scope.measure.bsOffsetMean, $scope.measure.fsOffsetMean );		
		$scope.measure.risePlus = bsRiseFall.rise;
		$scope.measure.fallMinus = bsRiseFall.fall;
		
		$scope.measure.chByAutoLevel = $scope.calChByAutoLevel( $scope.previousData.ch_by_auto_level, $scope.measure.bsOffset, $scope.measure.fsOffset );
		$scope.measure.checkedReduceLevel = $scope.calCheckedReduceLevel( $scope.previousData.hight_of_instrument, $scope.measure.isOffsetMean, $scope.measure.fsOffsetMean );
		$scope.measure.reduceLevel = $scope.calReduceLevel( $scope.previousData.hight_of_instrument, $scope.measure.isOffsetMean, $scope.measure.fsOffsetMean);
		$scope.measure.heightOfInstrument = $scope.calheightOfInstrument( $scope.measure.checkedReduceLevel, $scope.measure.bsOffsetMean, $scope.measure.isOffsetMean);
		$scope.measure.avgHeightOfInstrument = $scope.measure.heightOfInstrument - $scope.measure.checkedReduceLevel;
		$scope.measure.adjustmentError = $scope.calAdjustmentError( $scope.measure.tbm_rl, $scope.measure.reduceLevel );
	}
	var count = 0;
	$scope.calManualEntry = function( manual ){
		
		$scope.tempMeasure = manual;
		$scope.tempMeasure.number 	= 1;
		$scope.tempMeasure.bsOffset = 0.000;
		$scope.tempMeasure.isOffset = $scope.calSiteOffset( $scope.tempMeasure.intermediateSite );
		$scope.tempMeasure.fsOffset = 0.000;
		
		var isRead = parseFloat($scope.tempMeasure.intermediateSite[0]);
		
		var bsSumMean = {'sum': 0.000, 'mean': 0.000};
		var isSumMean = {'sum': parseFloat(isRead.toFixed(3)), 'mean': parseFloat(isRead.toFixed(3))};
		var fsSumMean = {'sum': 0.000, 'mean': 0.000};		
		
		$scope.tempMeasure.bsOffsetSum = bsSumMean.sum;
		$scope.tempMeasure.bsOffsetMean = bsSumMean.mean;
		$scope.tempMeasure.isOffsetSum = isSumMean.sum;
		$scope.tempMeasure.isOffsetMean = isSumMean.mean;
		$scope.tempMeasure.fsOffsetSum = fsSumMean.sum;
		$scope.tempMeasure.fsOffsetMean = fsSumMean.mean;
		
		var bsRiseFall = $scope.calRiseFall( $scope.tempMeasure.bsOffsetMean, $scope.tempMeasure.fsOffsetMean );		
		$scope.tempMeasure.risePlus = bsRiseFall.rise;
		$scope.tempMeasure.fallMinus = bsRiseFall.fall;
		
		$scope.tempMeasure.chByAutoLevel = $scope.calChByAutoLevel( $scope.previousData.ch_by_auto_level, $scope.tempMeasure.bsOffset, $scope.tempMeasure.fsOffset );
		$scope.tempMeasure.checkedReduceLevel = $scope.calCheckedReduceLevel( $scope.previousData.hight_of_instrument, $scope.tempMeasure.isOffsetMean, $scope.tempMeasure.fsOffsetMean );
		$scope.tempMeasure.reduceLevel = $scope.calReduceLevel( $scope.previousData.hight_of_instrument, $scope.tempMeasure.isOffsetMean, $scope.tempMeasure.fsOffsetMean);
		$scope.tempMeasure.heightOfInstrument = $scope.calheightOfInstrument( $scope.tempMeasure.checkedReduceLevel, $scope.tempMeasure.bsOffsetMean, $scope.tempMeasure.isOffsetMean);
		$scope.tempMeasure.avgHeightOfInstrument = $scope.tempMeasure.heightOfInstrument - $scope.tempMeasure.checkedReduceLevel;
		$scope.tempMeasure.adjustmentError = $scope.calAdjustmentError( $scope.tempMeasure.tbm_rl, $scope.tempMeasure.reduceLevel ); 
		
		$scope.tempMeasure.n_offset = $scope.calNOffset( $scope.tempMeasure.cs_offset_northing, $scope.previousData.utm_northing );
		$scope.tempMeasure.e_offset = $scope.calEOffset( $scope.tempMeasure.cs_offset_easting, $scope.previousData.utm_easting );
		$scope.tempMeasure.gps_offset_length = $scope.calGPSOffsetLength( $scope.tempMeasure.cs_offset_northing, $scope.tempMeasure.cs_offset_easting, $scope.previousData.utm_northing, $scope.previousData.utm_easting, $scope.tempMeasure.n_offset, $scope.tempMeasure.e_offset);				
		$scope.tempMeasure.ch = $scope.calMappingCh( $scope.tempMeasure.n_offset, $scope.tempMeasure.gps_offset_length, $scope.previousData.mapping_ch );
			if( $scope.tempMeasure.xSection > 0 ){
				$scope.tempMeasure.measurement_ch = parseFloat($scope.previousData.measurment_ch);
			}else{
				$scope.tempMeasure.measurement_ch = parseFloat($scope.previousData.measurment_ch) + parseFloat($scope.tempMeasure.lSection)
			}
		console.log($scope.tempMeasure);
		measurements.commonFun( $scope.tempMeasure ).then( function( response ){});
		count++;
		if( count == $scope.cookieData.length ){
			document.cookie = $scope.project_id + '=;expires=';
			count = 0;
			$scope.confirmMeasurement();
		}
	}
	$scope.confirmMeasurement = function(){
		$scope.cookieCheck = getCookie( $scope.project_id );
		var layerSplit = $scope.layerString.title.split("--");
		$scope.measure.layer = layerSplit[0];
		$scope.measure.id = $scope.project_id;
		$scope.calCoreCal();
        var uploadUrl = "server/uploadImage.php";
		if( $scope.closeMyFile != undefined ){
			fileUpload.uploadFileToUrl($scope.closeMyFile, uploadUrl).then( function( response ){
				$scope.measure.close_photograph = response.data;
			});
		}
		if( $scope.LocationMyFile != undefined ){
			fileUpload.uploadFileToUrl($scope.LocationMyFile, uploadUrl).then( function( response ){
				$scope.measure.location_photograph = response.data;
			});
		}
		if( $scope.ScreenMyFile != undefined ){
			fileUpload.uploadFileToUrl($scope.ScreenMyFile, uploadUrl).then( function( response ){
				$scope.measure.screen_shot = response.data;
			});
		}
		if( $scope.OtherMyFile != undefined ){
			fileUpload.uploadFileToUrl($scope.OtherMyFile, uploadUrl).then( function( response ){
				$scope.measure.other_photograph = response.data;
			});
		}
        $scope.measure.action = "add";
        
        $scope.measure.updatedDate = new Date();
		//$scope.tempMeasure = $scope.measure;
		if( $scope.cookieCheck == "" ){
			if( $scope.measure.easting > 0 && $scope.measure.northing > 0){
				$scope.measure.angleRedians = Math.atan(( parseFloat($scope.measure.northing) - parseFloat($scope.previousData.utm_northing) ) / ( parseFloat($scope.measure.easting) - parseFloat($scope.previousData.utm_easting) ))
			}
			$scope.measure.cs_offset_easting = $scope.measure.easting;
			$scope.measure.cs_offset_northing = $scope.measure.northing;
			
			setTimeout( function(){
				measurements.commonFun( $scope.measure ).then( function( response ){				
					$scope.measure = {};
					$scope.loadMeasurements( $scope.project_id );
					$scope.switchForm1 = true;
					$scope.switchForm2 = false;
					$scope.addMeasurementHolder = true;
					$scope.addMeasurementListHolder = false;
					getGeolocation();
					$scope.project_list();
				});
			}, 1000);
		}else{
			$scope.cookieData = JSON.parse($scope.cookieCheck);
			
			var manualLastEasting = (($scope.measure.easting * ($scope.cookieData[$scope.cookieData.length - 1].chainage - $scope.previousData.mapping_ch)) + (($scope.measure.ch - $scope.cookieData[$scope.cookieData.length - 1].chainage) * $scope.previousData.utm_easting))/( $scope.measure.ch - $scope.previousData.mapping_ch);
			var manualLastNorthing = (($scope.measure.northing * ($scope.cookieData[$scope.cookieData.length - 1].chainage - $scope.previousData.mapping_ch)) + (($scope.measure.ch - $scope.cookieData[$scope.cookieData.length - 1].chainage) * $scope.previousData.utm_northing))/( $scope.measure.ch - $scope.previousData.mapping_ch);
			
			if( $scope.measure.easting > 0 && $scope.measure.northing > 0){
				$scope.measure.angleRedians = Math.atan(( parseFloat($scope.measure.northing) - parseFloat(manualLastNorthing) ) / ( parseFloat($scope.measure.easting) - parseFloat(manualLastEasting) ))
			}
			
			for( i=0; i< $scope.cookieData.length;i++){
				var intgrate = [];
				
				$scope.min = {};
				console.log($scope.measure)
				var tempEasting = (($scope.measure.easting * ($scope.cookieData[i].chainage - $scope.previousData.mapping_ch)) + (($scope.measure.ch - $scope.cookieData[i].chainage) * $scope.previousData.utm_easting))/( $scope.measure.ch - $scope.previousData.mapping_ch);
				var tempNorthing = (($scope.measure.northing * ($scope.cookieData[i].chainage - $scope.previousData.mapping_ch)) + (($scope.measure.ch - $scope.cookieData[i].chainage) * $scope.previousData.utm_northing))/( $scope.measure.ch - $scope.previousData.mapping_ch);
				
				intgrate.push($scope.cookieData[i].is_reading);
				
				// Easting
				if( $scope.measure.angleRedians > 0 ){
					$scope.min.cs_offset_easting = ( tempEasting + Math.sin($scope.measure.angleRedians) * $scope.cookieData[i].offset );
				}else{
					$scope.min.cs_offset_easting = ( tempEasting - Math.sin($scope.measure.angleRedians) * $scope.cookieData[i].offset );
				}
				
				// Northing
				if( $scope.measure.angleRedians > 0 ){
					$scope.min.cs_offset_northing = ( tempNorthing - Math.cos($scope.measure.angleRedians) * $scope.cookieData[i].offset );
				}else{
					$scope.min.cs_offset_northing = ( tempNorthing + Math.cos($scope.measure.angleRedians) * $scope.cookieData[i].offset );
				}
				
				// Angle Redians
				$scope.min.action = "add";
				$scope.min.angleRedians = $scope.measure.angleRedians;
				$scope.min.lSection = $scope.cookieData[i].chainage;
				$scope.min.xSection = $scope.cookieData[i].offset;
				$scope.min.remarks = $scope.cookieData[i].remarks;
				$scope.min.intermediateSite = intgrate;
				$scope.min.equipmentId = $scope.previousData.equipement_id;
				$scope.min.layer = $scope.cookieData[i].layers;
				$scope.min.id = $scope.project_id;
				console.log($scope.min.remarks);
				$scope.calManualEntry( $scope.min );				
				
			}
			/* console.log($scope.previousData)
			console.log($scope.measure)
			console.log(JSON.parse($scope.cookieCheck)); */
		}
	};
    $scope.addMeasurement = function(){
		
		if( $scope.layerString != undefined && $scope.measure.equipmentId != undefined ){
			if( $scope.measure.tbm_rl == undefined ){
				var conf = confirm("TBM RL is Empty. Would you like to continue?");
				if( conf ){
					$scope.confirmMeasurement();
				}
			}else{
				$scope.confirmMeasurement();
			}
		}else{
			alert("Please choose layers and Equipment");
		}
    };
	
	$scope.cancelMeasurement = function(){
		$scope.switchForm1 = false;
		$scope.switchForm2 = true;
		$scope.switchForm3 = false;
		$scope.addMeasurementHolder = false;
		$scope.addMeasurementListHolder = true;
		$scope.showMeasurements = false;		
	};
	$scope.switchProject = function(){
		$scope.switchForm1 = false;
		$scope.switchForm2 = true;
	}
    
	$scope.exportToCSV = function(){
		$("#projects").tableToCSV();
	}
	
	$scope.listEquipment = function(){ 		
        $scope.equipent.action = "list";
        equ.commonFun( $scope.equipent ).then( function(response){
            if( response.data.code == '200'){
               $scope.equipmentList = response.data.data;
            }else{
                
            }
        });
    } 
	
	$scope.readEquipment = function( val ){
		$scope.equipment = {};
		$scope.getEquipment = {};
		
		$scope.getEquipment.action = 'singleEquipment';
		$scope.getEquipment.id = val;
		measurements.commonFun( $scope.getEquipment ).then( function(response){
            if( response.data.code == '200'){
				var equipmentData = response.data.data.equipements;			   
				$scope.measure.equipmentId = equipmentData.id;
				$scope.equipment.model_number = equipmentData.model_number;
				$scope.equipment.last_calibration_service_center = equipmentData.last_calibration_service_center;
				$scope.equipment.least_count = equipmentData.least_count;
				$scope.equipment.expiry_date = equipmentData.expiry_date;
				$scope.equipment.owner = equipmentData.owner;
            }
        });
	}
	
	$("#map_toggler").click(function() {
	 // $("#map_canvas").toggleClass("fullscreen")
	  var elem = document.getElementById("map_canvas");
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
		  elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
		  elem.webkitRequestFullscreen();
		}
	});
	
	$scope.addtoLocal = function(){
		var count = 0;
		console.log($scope.choices);
		for( i=0; i< $scope.choices.length; i++){
			if( $scope.choices[i]['chainage'] != undefined && $scope.choices[i]['offset'] != undefined && $scope.choices[i]['is_reading'] != undefined ){
				var splitLayers = $scope.choices[i]['layersTitle']['title'].split("--");
				$scope.choices[i]['layers'] = splitLayers[0];
				count++;
			}
		}
		if( count == $scope.choices.length ){
			var a = new Date();
			a = new Date(a.getTime() +1000*60*60*24*7);
			document.cookie = $scope.project_id+"="+ JSON.stringify($scope.choices) +'; expires='+a.toGMTString()+';';
			$scope.switchForm1 = true;
			$scope.switchForm2 = false;
			$scope.switchForm3 = false;
			getGeolocation();
		}else
			alert("Fill all the Fields");
	};
	
	function DDtoDMS(){
	//Input= xd(long) and yd(lat)
	//Output = xdd xm xs (long) and ydd ym ys (lat)
	ydd = Math.floor(Math.abs(yd));
	ym = Math.floor(60*(Math.abs(yd) - ydd));
	ys = 3600*(Math.abs(yd)-ydd - ym/60);
	if (yd<0){ydd=-ydd;}
	xdd = Math.floor(Math.abs(xd));
	xm = Math.floor(60*(Math.abs(xd) - xdd));
	xs = 3600*(Math.abs(xd)-xdd - xm/60);
	if (xd<0){xdd=-xdd;}
	}//End DDtoDMS

	
	function Declarations(){
//Symbols as used in USGS PP 1395: Map Projections - A Working Manual
	DatumEqRad = [6378137.0,6378137.0,6378137.0,6378135.0,6378160.0,6378245.0,6378206.4,
	6378388.0,6378388.0,6378249.1,6378206.4,6377563.4,6377397.2,6377276.3];	
	DatumFlat = [298.2572236, 298.2572236, 298.2572215,	298.2597208, 298.2497323, 298.2997381, 294.9786982,
	296.9993621, 296.9993621, 293.4660167, 294.9786982, 299.3247788, 299.1527052, 300.8021499]; 
	Item = 0;//Default
	k0 = 0.9996;//scale on central meridian
	a = DatumEqRad[Item];//equatorial radius, meters. 
	f = 1/DatumFlat[Item];//polar flattening.
	b = a*(1-f);//polar axis.
	e = Math.sqrt(1 - b*b/a*a);//eccentricity
	drad = Math.PI/180;//Convert degrees to radians)
	latd = 0;//latitude in degrees
	phi = 0;//latitude (north +, south -), but uses phi in reference
	e0 = e/Math.sqrt(1 - e*e);//e prime in reference
	N = a/Math.sqrt(1-Math.pow(e*Math.sin(phi)),2);
	T = Math.pow(Math.tan(phi),2);
	C = Math.pow(e*Math.cos(phi),2);
	lng = 0;//Longitude (e = +, w = -) - can't use long - reserved word
	lng0 = 0;//longitude of central meridian
	lngd = 0;//longitude in degrees
	M = 0;//M requires calculation
	x = 0;//x coordinate
	y = 0;//y coordinate
	k = 1;//local scale
	utmz = 30;//utm zone
	zcm = 0;//zone central meridian
	DigraphLetrsE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	DigraphLetrsN = "ABCDEFGHJKLMNPQRSTUV";
	/* document.getElementById("EqRadBox").value = a;
	document.getElementById("PolRadBox").value = b;
	document.getElementById("FlatBox").value = f;
	document.getElementById("RecipBox").value = 1/f; */
	OOZok = false;
	}//Close declarations

	
	function GeogToUTM(latlng){
	//Convert Latitude and Longitude to UTM
	Declarations();
	k0 = 0.9996;//scale on central meridian
	b = a*(1-f);//polar axis.
	//alert(a+"   "+b);
	//alert(1-(b/a)*(b/a));
	e = Math.sqrt(1 - (b/a)*(b/a));//eccentricity
	//alert(e);
	//Input Geographic Coordinates
	//Decimal Degree Option
    latd0 = parseFloat(latlng.lat());
	lngd0 = parseFloat(latlng.lng());
	
	/* latd1 = Math.abs(parseFloat(document.getElementById("DLatBox0").value));
	latd1 = latd1 + parseFloat(document.getElementById("MLatBox0").value)/60;
	latd1 = latd1 + parseFloat(document.getElementById("SLatBox0").value)/3600;
	if (parseFloat(document.getElementById("DLatBox0").value)<0){latd1=-latd1;}
	lngd1 = Math.abs(parseFloat(document.getElementById("DLonBox0").value));
	lngd1 = lngd1 + parseFloat(document.getElementById("MLonBox0").value)/60;
	lngd1 = lngd1 + parseFloat(document.getElementById("SLonBox0").value)/3600;
	if (parseFloat(document.getElementById("DLonBox0").value)<0){lngd1=-lngd1;} */

	lngd=lngd0;
	latd=latd0;
	/* if(isNaN(latd)){
	latd = latd1;
	document.getElementById("DDLatBox0").value = Math.floor(1000000*latd)/1000000;
	lngd=lngd1;
	document.getElementById("DDLonBox0").value = Math.floor(1000000*lngd)/1000000;
	} */
	
	if(isNaN(lngd)){lngd = latd1;}
		if(isNaN(latd)|| isNaN(lngd)){
		alert("Non-Numeric Input Value");
		}
	if(latd <-90 || latd> 90){
		alert("Latitude must be between -90 and 90");
		}
	if(lngd <-180 || lngd > 180){
		alert("Latitude must be between -180 and 180");
		}

	xd = lngd;
	yd = latd;
	DDtoDMS();
	//Read Input from DMS Boxes
	/* document.getElementById("DLatBox0").value = Math.floor(ydd);
	document.getElementById("MLatBox0").value = ym;
	document.getElementById("SLatBox0").value = Math.floor(1000*ys)/1000;
	
	document.getElementById("DLonBox0").value = Math.floor(xdd);
	document.getElementById("MLonBox0").value = xm;
	document.getElementById("SLonBox0").value = Math.floor(1000*xs)/1000; */

	
	phi = latd*drad;//Convert latitude to radians
	lng = lngd*drad;//Convert longitude to radians
	utmz = 1 + Math.floor((lngd+180)/6);//calculate utm zone
	latz = 0;//Latitude zone: A-B S of -80, C-W -80 to +72, X 72-84, Y,Z N of 84
	if (latd > -80 && latd < 72){latz = Math.floor((latd + 80)/8)+2;}
	if (latd > 72 && latd < 84){latz = 21;}
	if (latd > 84){latz = 23;}
		
	zcm = 3 + 6*(utmz-1) - 180;//Central meridian of zone
	//alert(utmz + "   " + zcm);
	//Calculate Intermediate Terms
	e0 = e/Math.sqrt(1 - e*e);//Called e prime in reference
	esq = (1 - (b/a)*(b/a));//e squared for use in expansions
	e0sq = e*e/(1-e*e);// e0 squared - always even powers
	//alert(esq+"   "+e0sq)
	N = a/Math.sqrt(1-Math.pow(e*Math.sin(phi),2));
	//alert(1-Math.pow(e*Math.sin(phi),2));
	//alert("N=  "+N);
	T = Math.pow(Math.tan(phi),2);
	//alert("T=  "+T);
	C = e0sq*Math.pow(Math.cos(phi),2);
	//alert("C=  "+C);
	A = (lngd-zcm)*drad*Math.cos(phi);
	//alert("A=  "+A);
	//Calculate M
	M = phi*(1 - esq*(1/4 + esq*(3/64 + 5*esq/256)));
	M = M - Math.sin(2*phi)*(esq*(3/8 + esq*(3/32 + 45*esq/1024)));
	M = M + Math.sin(4*phi)*(esq*esq*(15/256 + esq*45/1024));
	M = M - Math.sin(6*phi)*(esq*esq*esq*(35/3072));
	M = M*a;//Arc length along standard meridian
	
	M0 = 0;//M0 is M for some origin latitude other than zero. Not needed for standard UTM
	//alert("M    ="+M);
	//Calculate UTM Values
	x = k0*N*A*(1 + A*A*((1-T+C)/6 + A*A*(5 - 18*T + T*T + 72*C -58*e0sq)/120));//Easting relative to CM
	x=x+500000;//Easting standard 
	y = k0*(M - M0 + N*Math.tan(phi)*(A*A*(1/2 + A*A*((5 - T + 9*C + 4*C*C)/24 + A*A*(61 - 58*T + T*T + 600*C - 330*e0sq)/720))));//Northing from equator
	yg = y + 10000000;//yg = y global, from S. Pole
	if (y < 0){y = 10000000+y;}
	
	//Output into UTM Boxes
	//document.getElementById("UTMzBox1").value = utmz;
	//document.getElementById("UTMeBox1").value = Math.round(10*(x))/10;
	//document.getElementById("UTMnBox1").value = Math.round(10*y)/10;
	
	return {'northing': (10*(y)/10).toFixed(3), 'easting': (10*(x)/10).toFixed(3), 'zone': utmz, 'latitude':{'D': Math.floor(ydd), 'M': ym, 'S': Math.floor(1000*ys)/1000} , 'longitude':{'D': Math.floor(xdd), 'M': xm, 'S': Math.floor(1000*xs)/1000} };
	
				
}//close Geog to UTM


	$http.get('server/getSession.php').then( function( response ){
		if( response.data.data.USER_NAME == 'Admin' ){
			$scope.admin = true;
		}else{
			$scope.admin = false;
		}
		
	});
	
    $scope.project_list();
	$scope.listLayers();
	$scope.listEquipment();
    getGeolocation();
});

