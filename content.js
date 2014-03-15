/*console.debug($("td:nth-child(3)"));*/
/*
console.debug($("#dropDownBox #pet").clone());
console.debug($("table").eq(9));
$("table").eq(9).after($("#dropDownBox #pet").clone().html());
$("table").eq(10).find("td:nth-child(3) a").filter(function(index) { return ($(this).attr("href") != "pets/752"); }).closest("tr").hide()
*/

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
			
			console.debug( index );
			console.debug( v );

			if ( index < 1 ) return true;

			var row = $(this);

			for ( var i = team_mate[0]; i <= team_mate[1]; i++ ) {
				member = row.find("td:nth-child(" + i + ") a");
				console.debug( member );
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
		tooltip();
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

this.tooltip = function(){	
	/* CONFIG */		
		xOffset = 10;
		yOffset = 20;		
		// these 2 variable determine popup's distance from the cursor
		// you might want to adjust to get the right result		
	/* END CONFIG */		
	$("a.tooltip").hover(function(e){											  
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