app.controller("projectsController", function( $scope, project , $location, measurements, $compile, layers, equ){
    $scope.projectData = {};
	$scope.projectId = '';
	$scope.measure = {};
    $scope.previousData = {};
    $scope.mappingLayer = {};
    $scope.equipent = {};
	$scope.numbers = ["1"];
	
	$scope.switchForm1 = true;
	$scope.switchForm2 = false;
	$scope.addMeasurementHolder = false;
	$scope.addMeasurementListHolder = true;
		
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
			$scope.value = GeogToUTM(map.getCenter());
			console.log($scope.value)
			$scope.measure.latitude = $scope.value.latitude.D +", "+ $scope.value.latitude.M +", "+$scope.value.latitude.S;
			$scope.measure.longitude = $scope.value.longitude.D +", "+ $scope.value.longitude.M +", "+$scope.value.longitude.S;
			$scope.measure.easting = $scope.value.easting;
			$scope.measure.northing = $scope.value.northing;
			$scope.$apply();
			google.maps.event.trigger(map, "resize");
		});
		google.maps.event.addListener(marker, "dragend", function(mapEvent) {
			$scope.value = GeogToUTM(mapEvent.latLng);
			console.log($scope.value);
			$scope.measure.easting = $scope.value.easting;
			$scope.measure.northing = $scope.value.northing;
			$scope.$apply();
			map.panTo(mapEvent.latLng);
		}); 
				google.maps.event.addListener(
                    marker,
                    'click', (function(marker, $scope) {
                        return function() {
                            /* var compiled = $compile(contentString)($scope);
                            $scope.$apply();
							infowindow.setContent(compiled[0]);
                            infowindow.open(map, marker); */
							alert();
							$scope.switchForm1 = false;
							$scope.switchForm2 = true;
							$scope.$apply();
                        };
                    })(marker, $scope)
                );
				
		} else {
		  // Browser doesn't support Geolocation
		  //handleLocationError(false, infoWindow, map.getCenter());
		}
	}    
    
	$scope.addBasic = function( id ){
		
		$scope.switchForm1 = true;
		$scope.switchForm2 = false;
		
		$scope.project_id = id;
		
		$scope.addMeasurementHolder = true;
		$scope.addMeasurementListHolder = false;
		
		$scope.loadMeasurements( id );
        getGeolocation()    
	}
	
	
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
    
	$scope.calSiteOffset = function( dataInput ){
		var returnVal;
		if( $scope.previousData == null ){
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
	
    $scope.addMeasurement = function(){
		$scope.measure.layer = $scope.layerString.title;
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
		console.log($scope.measure)
		console.log($scope.previousData)
        /* $scope.measure.action = "add";
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
				$scope.addMeasurementHolder = false;
				$scope.addMeasurementListHolder = true;
				$scope.loadMeasurements( $scope.project_id );
			}
            $scope.project_list();
        }); */
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
		var data = angular.fromJson(val);
		$scope.equipment.model_number = data.model_number;
		$scope.equipment.last_calibration_service_center = data.last_calibration_service_center;
		$scope.equipment.least_count = data.least_count;
		$scope.equipment.expiry_date = data.expiry_date;
		$scope.equipment.owner = data.owner;
		console.log($scope.equipment)
	}
		
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
	
	return {'northing': (10*(x)/10).toFixed(3), 'easting': (10*(y)/10).toFixed(3), 'zone': utmz, 'latitude':{'D': Math.floor(ydd), 'M': ym, 'S': Math.floor(1000*ys)/1000} , 'longitude':{'D': Math.floor(xdd), 'M': xm, 'S': Math.floor(1000*xs)/1000} };
	
				
}//close Geog to UTM


	
	
    $scope.project_list();
	$scope.listLayers();
	$scope.listEquipment();
    getGeolocation();
});

