$(function(){

var tokendata;
var url = "http://api.goflight.us/index.php";

jQuery.extend(jQuery.mobile.datebox.prototype.options, {
    'overrideDateFormat': '%Y-%m-%d',
    'overrideHeaderFormat': '%Y-%m-%d'
});

$.ajax({
    	url: url+"?req=token",
    	dataType: 'json',
    	success: function(data) {
    		tokendata = data.token;
    	
	
	var op = "<option value=''>Choose..</option>";
	var cb = "";
	
	$.ajax({

			url: url+"?req=bandara&token="+tokendata,
			dataType: 'json',
			success: function(data) {

		var json = Array();
		
		$.each(data,function(k,v){
			json[k] = v;
		});
	
		$.each(json.all_airport.airport,function(k,v){
			op += "<option value="+this.airport_code+">"+this.location_name+" ("+this.airport_code+")"+"</option>";
		});
		
		$('.bandara').html(op);
		$.mobile.changePage($("#srcflight"));
		}
	});

} 
});

$('#tgl').change(function(){
	$('#tglkembali').val('');
    var dtt = $(this).val();
    var dt = new Date(dtt);
    var defaultPickerValue = [parseInt(dt.getFullYear()), parseInt(dt.getMonth()),parseInt(dt.getDate())];
	var presetDate = new Date(defaultPickerValue[0], defaultPickerValue[1], defaultPickerValue[2], 0, 0, 0, 0);
	var todaysDate = new Date();
	var lengthOfDay = 24 * 60 * 60 * 1000; 	
	var diff = parseInt((((presetDate.getTime() - todaysDate.getTime()) / lengthOfDay)+1)*-1,10);
	
	//tgl dipilih 26-06-2013 
	//tgl today 29-06-2013
	
	console.log(presetDate.getTime() - todaysDate.getTime());
	console.log(lengthOfDay);
	console.log((presetDate.getTime() - todaysDate.getTime())/lengthOfDay);
	console.log(((presetDate.getTime() - todaysDate.getTime())/lengthOfDay)+1);
	console.log((((presetDate.getTime() - todaysDate.getTime())/lengthOfDay)+1)*-1);
	console.log(diff);
	
	$('#tglkembali').datebox({'defaultValue': defaultPickerValue});
	$('#tglkembali').datebox({'minDays': diff});
});
 
function bersih(){
	var origin = $("select#origin");
		origin[0].selectedIndex = 0;
		origin.selectmenu("refresh");
	var to = $("select#to");
		to[0].selectedIndex = 0;
		to.selectmenu("refresh");
	$('#tgl').val('');
	$('#tglkembali').val('');
	var adult = $("select#adult");
		adult[0].selectedIndex = 0;
		adult.selectmenu("refresh");
	var child = $("select#child");
		child[0].selectedIndex = 0;
		child.selectmenu("refresh");
			
	var adt = 1;
	var inf = "";
	for(var i=0;i<=adt;i++)
	{
	    inf += '<option value='+i+'>'+i+'</option>';  
	} 
	$('select#inf').html(inf).selectmenu("refresh");
		
	$('#rd').hide();
	$('#srcflight').attr('tab','oneway');
} 

$('#dep_reset').click(function(){
	bersih();
	return true;
});
	
$('#arr_reset').click(function(){
	bersih();		
	$('#srcflight').attr('search','true');
	$("#srcflight").attr("back","true");
	var dep = $("select.fildep");
		dep[0].selectedIndex = 0;
	var ret = $("select.filret");
		ret[0].selectedIndex = 0;
	
	dep.selectmenu("refresh");
	ret.selectmenu("refresh");
	return true;
});

$('#rd').hide();
	
$('#radio-one').click(function(){
	$('#tglkembali').val('');
	$('#rd').hide();
	$('#srcflight').attr('tab','oneway');
	return true;
});
	
$('#radio-return').click(function(){
	$('#rd').show();
	$('#srcflight').attr('tab','return');
	return true;
});

$('#adult').change(function(){
	var adult = $(this).val();
	var infl = $('#srcflight').attr('inf');
	var ifl = $('select#inf').val();
	var fl = $('#srcflight').attr('fl');
	if(fl > adult){
		var inf = "";
		for(var i=0;i<=adult;i++)
	    {
	        inf += '<option value='+i+'>'+i+'</option>';  
	    } 
		
			$('select#inf').html(inf).selectmenu("refresh");
		
		$('#srcflight').attr('inf',adult);
	}
	else{
		var min = parseInt(adult) - parseInt(infl);
		var inf = "";
		for(var i=parseInt(infl)+1;i<=adult;i++)
	    {
	        inf += '<option value='+i+'>'+i+'</option>';  
	    } 
		$('select#inf').append(inf);
		$('#srcflight').attr('inf',adult);
	}
	$('#srcflight').attr('fl',adult);
});
  
$('.tampiltiket').click(function(){
	if($('#origin').val() == "")
	{
		alert("Please select a departure location");
		$('#origin').focus();
		return false;
	}
	else if($('#to').val() == "")
	{
		alert("Please select an arrival location");
		$('#to').focus();
		return false;
	}
	else if($('#tgl').val() == "" )
	{
		alert("Please enter a valid departure date");
		$('#tgl').focus();
		return false;
	}
	else if($('#tglkembali').val() == "" && $('#srcflight').attr('tab') == "return")
	{
		alert("Please enter a valid return date");
		$('#tglkembali').focus();
		return false;
	}
	else 
	{
		tiket_proc(url,tokendata,"priceasc");	
	}
});

$('.fildep').change(function(){
if($("#srcflight").attr("filter") == "false"){
				$(this).selectmenu("refresh");
			} 
	var fil = {"priceasc":0,"departureasc":1};
	var val = $(this).val();
	
	var to = $("select.filret");
	to.each(function(){
			$(this)[0].selectedIndex = fil[val];
			if($("#srcflight").attr("filter") == "true"){
				$(this).selectmenu("refresh");
			} 
	});

	tiket_proc(url,tokendata,$(this).val());
});

$('.filret').change(function(){
	var fil = {"priceasc":0,"departureasc":1};
	var val = $(this).val();
	
	var to = $("select.fildep");
	to.each(function(){
			$(this)[0].selectedIndex = fil[val];
			$(this).selectmenu("refresh");
			
	});
	
	tiket_proc(url,tokendata,$(this).val());
	 
});

$(".back").click(function(){
	$('#srcflight').attr('search','true');
	$('#srcflight').attr('back','true');
	var dep = $("select.fildep");
		dep[0].selectedIndex = 0;
	var ret = $("select.filret");
		ret[0].selectedIndex = 0;
	
	dep.selectmenu("refresh");
	ret.selectmenu("refresh");
});

$('#fl_return').click(function(){
	$("#srcflight").attr("filter","true");
	$(".filret").selectmenu("refresh");
});

$('#origin').change(function(){
	if($(this).val() == $('#to').val()){
		alert("Should not be same Origin and Destination");
		var origin = $("select#origin");
			origin[0].selectedIndex = 0;
			origin.selectmenu("refresh");
	}
});

$('#to').change(function(){
	if($(this).val() == $('#origin').val()){
		alert("Should not be same Origin and Destination");
		var to = $("select#to");
			to[0].selectedIndex = 0;
			to.selectmenu("refresh");
	}
});

$("#fl-return").click(function(){
	$("#srcflight").attr("filter","true");
});

});



function tiket_proc(url,tokendata,asc){
var d = $('#origin').val();
var a = $('#to').val();
var date = $('#tgl').val();
var dateret = $('#tglkembali').val();
var adult = $('#adult').val();
var child = $('#child').val();
var inf = $('#inf').val();
var req;
var ret_date;
if(dateret == ""){
	req = "oneway";
  ret_date = "";
  $('.nav-showticket').hide();
}else {
	req = "return";
  ret_date = "&dateret="+dateret;
  $('.nav-showticket').show();
}

$.ajax({
    	url: url+"?req="+req+"&d="+d+"&a="+a+"&date="+date+""+ret_date+"&adult="+adult+"&child="+child+"&inf="+inf+"&v=2&output=json&asc="+asc+"&token="+tokendata,
    	dataType: 'json',
		beforeSend: function(){
		
				var $this = $('.tampiltiket'),
		        theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
		        msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
		        textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
		        textonly = !!$this.jqmData( "textonly" );
		        html = $this.jqmData( "html" ) || "";
		    $.mobile.loading( "show", {
		            text: msgText,
		            textVisible: textVisible,
		            theme: theme,
		            textonly: textonly,
		            html: html
		    });
		
		},
    	success: function(data) {
			$.mobile.loading( "hide" );
			var hasil = "";
			var kembali = "";					
			var hari = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			var currency = data.diagnostic.currency;
			var dep_formatted_date = data.go_det.formatted_date;
			var cdep = new Date(data.go_det.date);
			var dep_hari = hari[cdep.getDay()];

			if(dateret != ""){
				var ret_formatted_date = data.ret_det.formatted_date;
				var cret = new Date(data.ret_det.date);
				var ret_hari = hari[cret.getDay()];
			}
			var from = data.go_det.dep_airport.airport_code;
			var to = data.go_det.arr_airport.airport_code;

			
			var dep_location_name = data.go_det.dep_airport.location_name;
			var dep_business_name = data.go_det.dep_airport.business_name;
			var dep_country_name = data.go_det.dep_airport.country_name;
			
			
			var arr_location_name = data.go_det.arr_airport.location_name;
			var arr_business_name = data.go_det.arr_airport.business_name;
			var arr_country_name = data.go_det.arr_airport.country_name;
			
			
			search_dep = "<center><b><h6>"+from+" ("+dep_location_name+", "+dep_country_name+"), "+dep_business_name+" Airport to "+to+" ("+arr_location_name+", "+arr_country_name+"), "+arr_business_name+" Airport<p><h5>"+dep_hari+", "+dep_formatted_date+"</h5></p></h6></b></center>";
			$("#search_dep").html(search_dep);
			
			search_arr = "<center><b><h6>"+to+" ("+arr_location_name+", "+arr_country_name+"), "+arr_business_name+" Airport to "+from+" ("+dep_location_name+", "+dep_country_name+"), "+dep_business_name+" Airport<p><h5>"+ret_hari+", "+ret_formatted_date+"</h5></p></h6></b></center>";
			$("#search_arr").html(search_arr);
			

		if(data.departures.result !=""){

    	$.each(data.departures.result,function(){
		
				$('#ctrl').show();
				hasil += "<li data-role='list-divider' data-theme='b'>"+this.airlines_name+" "+this.flight_number+"</li>";
				hasil += "<li><a href='#dialog.html'  data-rel='dialog' onclick='detaillist(\""+this.flight_id+"\",\""+adult+"\",\""+child+"\",\""+inf+"\",\""+this.image+"\",\""+this.airlines_name+"\",\""+this.flight_number+"\",\""+dep_location_name+"\",\""+dep_business_name+"\",\""+from+"\",\""+arr_location_name+"\",\""+arr_business_name+"\",\""+to+"\",\""+dep_hari+"\",\""+dep_formatted_date+"\",\""+this.simple_departure_time+"\",\""+this.simple_arrival_time+"\",\""+this.price_adult+"\",\""+this.price_child+"\",\""+this.price_infant+"\",\""+this.price_value+"\",\""+dep_country_name+"\",\""+arr_country_name+"\",\""+this.duration+"\",\""+this.full_via+"\",\""+this.stop+"\",\""+currency+"\",\"depart\");' id='detail'><p><img src='"+this.image+"'></p>"+"<p><b>Depart   : "+this.simple_departure_time+"</p>";
				hasil += "<p>Arrival  : "+this.simple_arrival_time+"</p>";
				hasil += "<p>Transit  : "+this.stop+"</p>";
				hasil += "<p>Duration : "+this.duration+"</p>";
				hasil += "<p>Price    : "+currency+" "+this.price_adult+"</b></p></a></li>";	
				
			});
					$.mobile.changePage($("#show-ticket-depart"));
					$("#hasil").html(hasil).listview('refresh');

			
		}else{
			$('#ctrl').hide();
			hasil += "<li style='color:red;'>Flights are unavailable or sold out</li>";
					$.mobile.changePage($("#show-ticket-depart"));
					$("#hasil").html(hasil).listview('refresh');
			
		}	

		if(dateret != "" && data.returns){
			$.each(data.returns.result,function(){

				$('#alt').show();
				kembali += "<li data-role='list-divider' data-theme='b'>"+this.airlines_name+" "+this.flight_number+"</li>";
				kembali += "<li><a href='#dialog.html'  data-rel='dialog' onclick='detaillist(\""+this.flight_id+"\",\""+adult+"\",\""+child+"\",\""+inf+"\",\""+this.image+"\",\""+this.airlines_name+"\",\""+this.flight_number+"\",\""+dep_location_name+"\",\""+dep_business_name+"\",\""+from+"\",\""+arr_location_name+"\",\""+arr_business_name+"\",\""+to+"\",\""+ret_hari+"\",\""+ret_formatted_date+"\",\""+this.simple_departure_time+"\",\""+this.simple_arrival_time+"\",\""+this.price_adult+"\",\""+this.price_child+"\",\""+this.price_infant+"\",\""+this.price_value+"\",\""+dep_country_name+"\",\""+arr_country_name+"\",\""+this.duration+"\",\""+this.full_via+"\",\""+this.stop+"\",\""+currency+"\",\"return\");' id='detail'><p><img src='"+this.image+"'></p>"+"<p><b>Depart   : "+this.simple_departure_time+"</p>";
				kembali += "<p>Arrival  : "+this.simple_arrival_time+"</p>";
				kembali += "<p>Transit  : "+this.stop+"</p>";
				kembali += "<p>Duration : "+this.duration+"</p>";
				kembali += "<p>Price    : "+currency+" "+this.price_adult+"</b></p></a></li>";
				
			});
			
			if($('#srcflight').attr("search") == "true"){
				$("#kembali").html(kembali).listview('refresh');
			}else{
				$("#kembali").html(kembali);
				$('#srcflight').attr("search","true");
			}
		}
		else{
			$('#alt').hide();
			kembali += "<li style='color:red;'>Flights are unavailable or sold out</li>";
			if($('#srcflight').attr("search") == "true"){
				$("#kembali").html(kembali).listview('refresh');
			}else{
				$("#kembali").html(kembali);
				$('#srcflight').attr("search","true");
			}

		}

    	}
		
    });

}

function detaillist(flight_id,adult,child,infant,image,airlines_name,flight_number,dep_location_name,dep_business_name,from,arr_location_name,arr_business_name,to,day,formatted_date,simple_departure_time,simple_arrival_time,price_adult,price_child,price_infant,price_value,dep_country_name,arr_country_name,duration,full_via,stop,currency,position){
		var dtl = "";
		var ket = "";
		var labeladt = "";
		var labelchd = "";
		var labelinf = "";
		
		if(adult > "1"){
			labeladt = adult+" Adults x ";
			}
			else{
			labeladt = adult +" Adult x";
			}
		
		if(child > "1"){
			labelchd = child+" Children x ";
			}
			else if(child == "0"){
			labelchd = "Child ";
			}
			else{
			labelchd = child+" Child x ";
			}
		
		if(infant > "1"){
			labelinf = infant+" Infants x ";
			}
			else if(infant == "0"){
			labelinf = "Infant ";
			}
			else{
			labelinf = infant+" Infant x ";
			}
		
		if(position == "depart"){
		ket += "<center><h2>DEPARTURE FLIGHT</h2></center>";
		}
		else{
		ket += "<center><h2>RETURN FLIGHT</h2></center>";
		}
		
		$("#ket").html(ket);
		
		dtl += "<b><h4><img src='"+image+"'><br />"+airlines_name+" "+flight_number+"</h4></b>";
		
		if(position == "depart"){
			dtl += "<b><h6>"+dep_location_name+", "+dep_business_name+" Airport ("+from+")<br />Departs: "+simple_departure_time+"<br />";
			dtl += "<p>"+arr_location_name+", "+arr_business_name+" Airport ("+to+")<br />Arrives: "+simple_arrival_time+"<p>";
		}
		else{
			dtl += "<b><h6>"+arr_location_name+", "+arr_business_name+" Airport ("+to+")<br />Departs: "+simple_departure_time+"<br />";
			dtl += "<p>"+dep_location_name+", "+dep_business_name+" Airport ("+from+")<br />Arrives: "+simple_arrival_time+"</p>";
		}
		
		
		dtl += "<p>On: "+day+", "+formatted_date;
		
		if(stop != "Nonstop"){
			dtl += "<br />Transit: "+stop+" , "+full_via;
		}
		else{
			dtl += "";
		}
		
		dtl += "<br />Flight Duration: "+duration+"</p>";
		dtl += "<p>"+labeladt+" "+currency+" "+price_adult;
		dtl += "<br />"+labelchd+" "+currency+" "+price_child;
		dtl += "<br />"+labelinf+" "+currency+" "+price_infant+"</p></h6></b>";
		dtl += "<h4>Total Price: "+currency+" "+price_value+"</h4>";
		dtl += "";
		$("#detaillist").html(dtl);
		$(".bookingticket").attr('href',"http://www.tiket.com/click?business=19530509&position=sidebar&ref=http%3A%2F%2Fgoflight.us%2F&url_to=https%3A%2F%2Fwww.tiket.com%2Forder%2Fadd%2Fflight%3Fflight="+flight_id+"&twh=19530509&utm_source=widget&utm_medium=goflight.us&utm_content=flight");
		if(position == "depart"){
		var datatw = airlines_name+' '+dep_location_name+' ('+simple_departure_time+') to '+arr_location_name+' ('+simple_arrival_time+') on '+day+", "+formatted_date+' '+currency+" "+price_adult;
		}
		else{
		var datatw = airlines_name+' '+arr_location_name+' ('+simple_departure_time+') to '+dep_location_name+' ('+simple_arrival_time+') on '+day+", "+formatted_date+' '+currency+" "+price_adult;
		}
		var twhtml = '<a href="http://mobile.twitter.com/share" class="twitter-share-button" data-url="http://goflight.us" data-text="'+datatw+'" data-count="none" data-via="goflight_us">Tweet</a>'
		$('.twit').html(twhtml);
		$.getScript('http://platform.twitter.com/widgets.js');
}
