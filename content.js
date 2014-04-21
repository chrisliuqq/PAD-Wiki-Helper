/*console.debug($("td:nth-child(3)"));*/
/*
console.debug($("#dropDownBox #pet").clone());
console.debug($("table").eq(9));
$("table").eq(9).after($("#dropDownBox #pet").clone().html());
$("table").eq(10).find("td:nth-child(3) a").filter(function(index) { return ($(this).attr("href") != "pets/752"); }).closest("tr").hide()
*/

if (window.location.host == "pad.skyozora.com") {

/* ==========================================================================
   通關隊伍隊場篩選
   ========================================================================== */

	var stage_level = 3;
	var result_level = 4;
	var team_leader = 3;
	var team_mate = [4, 7];
	var team_friend = 8;
	var result_table;

	setTimeout(function() {
		result_table = $("table").eq(result_level);
		$("table").eq(stage_level).after('<div id="padhelper_stage_master" class="style1">隊長過濾：<select id="padhelper_stage_master_selector">' + $("#dropDownBox #pet").html() + '</select><button id="padhelper_stage_master_cancel">取消過濾</button><button id="padhelper_stage_calculate">統計</button></div>');
		$("#padhelper_stage_master_cancel").click(function(){
			result_table.find("tr").show();
			$("#padhelper_stage_stats").html( "" );
		});
		$("#padhelper_stage_calculate").click(function() {
			var stats = { members: {}, info: {}};
			var member = null;
			var html = "";
			var temp = "";
			var sorting_temp = [];
			result_table.find("tr:visible:not(:first-child)").each(function(index , v) {
				
				//console.debug( index );
				//console.debug( v );

				if ( index < 1 ) return true;

				var row = $(this);

				for ( var i = team_mate[0]; i <= team_mate[1]; i++ ) {
					member = row.find("td:nth-child(" + i + ") a");
					// console.debug( member );
					member_id = member.attr("href").replace("pets/", "");
					if ( typeof(stats["members"][member_id]) == "undefined" ) {
						stats["members"][member_id] = 0;
						stats["info"][member_id] = member.parent().html();
					}
					stats["members"][member_id]++;
				}
			});
			
			html = '<h5>隊友分佈</h5>';

			$.each(stats["members"], function(index, value) {
				sorting_temp.push({ key: index, count: value})
			});

			sorting_temp = sorting_temp.sort(function(a, b) {
	        	return (b["count"] > a["count"]) ? 1 : ((b["count"] < a["count"]) ? -1 : 0);
	        });

	        temp = "";

			$.each(sorting_temp, function(index, value) {
				temp += '<li>' + stats["info"][value["key"]] + '：' + value["count"] + '</li>';
			});


			html += '<ul>' + temp + '</ul>';

			$("#padhelper_stage_stats").html( html );
			tooltip_stats();
		});
		$("#padhelper_stage_master_selector").val("001");
		$("#padhelper_stage_master").after('<div id="padhelper_stage_stats"></div>');
		$("#padhelper_stage_master_selector").change(function() {
			var select_id = $(this).val();
			result_table.find("tr").show();
			result_table.find("tr:nth-child(2n)").hide();
			result_table.find("td:nth-child(" + team_leader + ") a").filter(function(index) {
				return !($(this).attr("href") == ("pets/" + select_id));
			}).closest("tr").hide();
			
			result_table.find("img").each(function() {
				$(this).attr("src", $(this).data("original"));
			});
		});
	}, 2000);

	this.tooltip_stats = function(){	

		xOffset = 10;
		yOffset = 20;		
	
		$("#padhelper_stage_stats a.tooltip").hover(function(e){											  
			this.t = this.title;
			this.title = "";									  
			$("body").append("<p id='tooltip'>"+ this.t +"</p>");
			$("#tooltip")
				.css("top",(e.pageY - xOffset) + "px")
				.css("left",(e.pageX + yOffset) + "px")
				.fadeIn("slow");		
	    },
		function(){
			this.title = this.t;		
			$("#tooltip").remove();
	    });	
		$("a.tooltip").mousemove(function(e){
			$("#tooltip")
				.css("top",(e.pageY - xOffset) + "px")
				.css("left",(e.pageX + yOffset) + "px");
		});	

	};

}

if (window.location.host == "zh.pad.wikia.com") {

/* ==========================================================================
   地下層預測開放
   ========================================================================== */

   var start_level = 2;
   var end_level = 3;
   var date_regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;

   var date_table = $("h2:contains('開放時間記錄')").next("table");
   if (date_table && date_table.length <= 0) throw new Error("can't find open time history");

   var start_date = "", end_date = "";
   var durings = [];
   var temp = "";
   var last_start = 0;
   date_table.find("tr:not(:first-child)").each(function() {
		var row = $(this);
		start_date = row.find("td:nth-child(" + start_level + ")").text();
		start_date = date_regex.exec(start_date);
		start_date = new Date((start_date[1]), (start_date[2]) - 1, (start_date[3]), 0, 0, 0).getTime();

		if (last_start > 0) {
			durings.push( (start_date - last_start)/1000/60/60/24 );
		}

		last_start = start_date;
   });
   
   var maxd = Math.max.apply(Math, durings);
   var mind = Math.min.apply(Math, durings);
   var avgd = Math.round( durings.reduce(function(a, b) { return a + b }) / durings.length );

   var max = new Date((last_start + maxd * 24 * 60 * 60 * 1000));
   var min = new Date((last_start + mind * 24 * 60 * 60 * 1000));
   var avg = new Date((last_start + avgd * 24 * 60 * 60 * 1000));

   date_table.append('<tr><td>*</td><td>預計下次開放時間</td><td colspan="2">' + 
   	'最快：' + mind + '天：' + min.getFullYear() + '年' + (min.getMonth() + 1) + '月' + min.getDate() + '日<br />' + 
   	'平均：' + avgd + '天：' + avg.getFullYear() + '年' + (avg.getMonth() + 1) + '月' + avg.getDate() + '日<br />' + 
   	'最慢：' + maxd + '天：' + max.getFullYear() + '年' + (max.getMonth() + 1) + '月' + max.getDate() + '日' + 
   	'</td></tr>');

}