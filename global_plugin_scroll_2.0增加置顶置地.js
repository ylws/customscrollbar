/*
 * 名称：模拟滚动条控件/shineonScroll
 * 作者：djl
 * 邮箱：474569696@qq.com
 * 日期：2016/4/14
 */
$.fn.shineonScroll = function(options) {
	var _this = this;
	var defaults = {
		"father": "scrollfather1", //当前区域id
		"soncontent": "scrollson", //当前区域子元素样式表
		"scroll_y": "scroll_y", //模拟滚动条y轴背景样式
		"scroll_ymove": "scroll_ymove", //模拟滚动条y轴滚动条背景样式
		"scroll_x": "scroll_x", //模拟滚动条y轴背景样式
		"scroll_xmove": "scroll_xmove", //模拟滚动条x轴滚动条背景样式
		"deloradd": "", //添加元素，删除元素参数adddel
		"wheelxory": "wheely", //滚动类型wheelx轴，wheely轴
		"wheelval": 0, //滑轮上下滚动的值，1位向下，-1位向上
		"marginstep": 10, //步长,请使用数字，true为自动
		"marginstepbole": 8, //步长,请使用数字，true为自动
		"getfatherid": "whichscroll", //获取当前滚动区域模块id的隐藏域id
		"scrolltop": "top",
		"resetinit": 0, //0代表不做处理，1代表重置
		"scrolltarget": ".scrollfather", //鼠标滑动，标记父元素
		"smscrollfnprev": "phone_", //手机端滚动回调方法前缀
		"touchpreventDefault":false,//是否开启移动端禁用滚动条
		"boleonclick": false, //触屏设备在终端chrome浏览器,强制转到touch监听,并添加滚轮监听
		"scrollbottomfn": "topmax" //top值滚动到底部
		/*
			var count = 0;
			function topmax(scrollobj){
				var listlen = $("#scrollfather1 .scrollson .lists").length;
				if(listlen>=jsoncallback.length){
					count = 0;
					if($("#scrollfather1").attr("message")=="1"){
						return false;
					}
					$("#scrollfather1").attr("data-message","没有更多数据了...").attr("message","1");
					setTimeout(function(){
						$("#scrollfather1").attr("data-message","");
					},1500)
					return false;
				}
				count++;
				if(count <=1){
					if(listlen!=jsoncallback.length){
						if(scrollobj){
							detail(jsoncallback,listlen+pageval,scrollobj);
							count = 0;
						}else{
							detail(jsoncallback,listlen+pageval);
							count = 0;
						}	
					}
				}
			}
		 * */

	};

	var settings = $.extend({}, defaults, options);
	this.sets = settings;
	this.clickfatherid = "";
	//y轴的高度计算:父元素高度-父元素的高度除以子元素总高；

	//var marginstep=15;//步长
	var hei_father, //父元素（y轴）
		hei_f_offhei, //父元素距离顶部高度（y轴）hei_father_offheight
		hei_f_offleft, //父元素距离顶部高度（y轴）hei_fatheroffleft
		hei_soncontent, //子元素（y轴）
		hei_scrolly, //滚动条Y（y轴）
		hei_nowposition_y, //当前点击位置（y轴）
		hei_nowposition_y_up, //（y轴）
		hei_scrolltop_y, //滚动条距离顶部位置（y轴）
		hei_click_top, //点击位置距离滚动条滑块顶部的高度（y轴）
		hei_scroll_y_height, //模拟滚动条top值（y轴）
		hei_e_s_y_hei, //除滑块以外的高度值（y轴）hei_exceptscrollyheight
		hei_scrollheight, //滑块每移动一像素，代表的实际margin-top距离（y轴）
		hei_c_hei, //添加或删除元素后的变化的滑块高度（y轴）hei_changeheight
		hei_c_top, //添加或删除元素后的变化的滑块top值（y轴）hei_changetop
		//x轴的宽度计算:父元素width-父元素的宽度除以子元素总宽；
		wid_father, //父元素（x轴）
		wid_f_offwid, //父元素距离左侧宽度（x轴）wid_fatheroffwidth
		wid_soncontent, //子元素（x轴）
		wid_scrollx, //滚动条X（x轴）
		wid_nowposition_x, //当前点击位置（x轴）
		wid_np_x_left, //（x轴）wid_nowposition_x_left
		wid_scrollleft_x, //滚动条距离左侧位置（x轴）
		wid_click_left, //点击位置距离滚动条滑块左侧的宽度（x轴）
		wid_scroll_x_width, //模拟滚动条left值（x轴）
		wid_e_s_wid, //除滑块以外的宽度值（x轴）wid_exceptscrollxwidth
		wid_scrollwidth, //滑块每移动一像素，代表的实际margin-left距离（x轴）
		wid_c_wid, //添加或删除元素后的变化的滑块width（x轴）wid_changewidth
		wid_c_left, //添加或删除元素后的变化的滑块left值（x轴）wid_changeleft
		sf = settings.father,
		sonc = settings.soncontent,
		ssymove = settings.scroll_ymove,
		ssy = settings.scroll_y,
		ssxmove = settings.scroll_xmove,
		ssx = settings.scroll_x,
		sms = settings.marginstep,
		smsbole = settings.marginstepbole,
		smscrollfnprv = settings.smscrollfnprev,
		smscrollfn = smscrollfnprv + sf,
		smsboleonclick = settings.boleonclick,
		smsscrollbottomfn = settings.scrollbottomfn,
		touchpreventDefault= settings.touchpreventDefault,
		scrolltarget = settings.scrolltarget;
	if(sms == true || sms == "true") {
		sms = $("#" + sf + " ." + sonc).height() / $("#" + sf).height() * 5;
		if(sms <= 5) {
			sms = 5;
		}
	}
	if(smsboleonclick) { //终端为移动设备，嵌套浏览器touch
		sms = smsbole
	}
	if(settings["resetinit"]) {
		if(settings["wheelxory"] == "wheely") {
			$("#" + sf + " ." + sonc).css("margin-top", "0");
			$("#" + sf + " ." + ssy).css("top", "0");
		} else if(settings["wheelxory"] == "wheelx") {
			$("#" + sf + " ." + sonc).css("margin-left", "0");
			$("#" + sf + " ." + ssx).css("left", "0");
		}
		return;
	}
	if($("#" + sf).css("display")=="none"){//如果一开始为隐藏，则不再进行下面的操作
		return false;
	}
	if($("#" + sf).offset() != undefined) {
		//y轴
		hei_f_offhei = $("#" + sf).offset()['top'];

		hei_father = $("#" + sf).height();
		hei_soncontent = $("#" + sf + " ." + sonc).height();
		//x轴
		wid_f_offwid = $("#" + sf).offset()['left'];
		wid_father = $("#" + sf).width();
		wid_soncontent = $("#" + sf + " ." + sonc).width();
		$("#" + sf + " ." + ssymove).height($("#" + sf).height());
		$("#" + sf + " ." + ssxmove).width(parseInt($("#" + sf).width()));
		//y轴
		if(hei_father < hei_soncontent) {
			$("#" + sf + " ." + ssy).show();
			$("#" + sf + " ." + ssymove).show();
			hei_scrolly = hei_father * (hei_father / hei_soncontent);
			$("#" + sf + " ." + ssy).height(hei_scrolly);
		} else {
			$("#" + sf + " ." + ssy).hide();
			$("#" + sf + " ." + ssymove).hide();
		}
		//x轴
		if(wid_father < wid_soncontent) {
			$("#" + sf + " ." + ssx).show();
			$("#" + sf + " ." + ssxmove).show();
			wid_scrollx = wid_father * (wid_father / wid_soncontent);
			$("#" + sf + " ." + ssx).width(wid_scrollx);
		} else {
			$("#" + sf + " ." + ssx).hide();
			$("#" + sf + " ." + ssxmove).hide();

		}
	} else {
		//throw new Error("未能正确获取（" + sf + "）的offset()");
		return false;
	}
	this.scrollings = function(settings) {
		var idval = ""; //获取当前鼠标指向元素的id也就是settings['father']
		$("." + settings["soncontent"]).mouseover(function() {
			$("#" + settings["getfatherid"]).val($(this).parents(scrolltarget).attr("id"));
			idval = $("#" + settings["getfatherid"]).val();
			settings.wheelxory = $("#" + idval).attr("wheelxory");
			if(($("#" + idval).height() < $(this).height() && settings.wheelxory == "wheely") ||($("#" + idval).height() > $(this).height() && settings.wheelxory == "wheely" && top.location.href != location.href) || ($("#" + idval).width() < $(this).width() && settings.wheelxory == "wheelx")|| ($("#" + idval).width() > $(this).width() && settings.wheelxory == "wheelx" && top.location.href != location.href)) {
				document.body.onmousewheel = function() {
					return false
				};
			} else {
				document.body.onmousewheel = null;
			}
			smscrollfn = smscrollfnprv + idval;

		})
		if($("#" + sf).offset() != undefined) {
			//y轴
			hei_f_offhei = $("#" + sf).offset()['top'];

			hei_father = $("#" + sf).height();
			hei_soncontent = $("#" + sf + " ." + sonc).height();
			//x轴
			wid_f_offwid = $("#" + sf).offset()['left'];
			wid_father = $("#" + sf).width();
			wid_soncontent = $("#" + sf + " ." + sonc).width();
			$("#" + sf + " ." + ssymove).height($("#" + sf).height());
			$("#" + sf + " ." + ssxmove).width(parseInt($("#" + sf).width()));
			//y轴
			if(hei_father < hei_soncontent) {
				$("#" + sf + " ." + ssy).show();
				$("#" + sf + " ." + ssymove).show();
				hei_scrolly = hei_father * (hei_father / hei_soncontent);
				$("#" + sf + " ." + ssy).height(hei_scrolly);
			} else {
				$("#" + sf + " ." + ssy).hide();
				$("#" + sf + " ." + ssymove).hide();
			}
			//x轴
			if(wid_father < wid_soncontent) {
				$("#" + sf + " ." + ssx).show();
				$("#" + sf + " ." + ssxmove).show();
				wid_scrollx = wid_father * (wid_father / wid_soncontent);
				$("#" + sf + " ." + ssx).width(wid_scrollx);
			} else {
				$("#" + sf + " ." + ssx).hide();
				$("#" + sf + " ." + ssxmove).hide();
			}
		} else {
			throw new Error("未能正确获取（" + sf + "）的offset()");
		}
		if(settings.wheelxory == "wheely") {
			//执行一次mousemove事件
			//ie、chrome当top为0时，值为auto,需做处理
			if($("#" + sf + " ." + ssy).css("top") == "auto") {
				$("#" + sf + " ." + ssy).css("top", "0");
			}
			hei_scroll_y_height = parseFloat($("#" + sf + " ." + ssy).css("top"));

			hei_e_s_y_hei = parseInt(hei_father - hei_scrolly);
			//计算滚动位置，子元素移动多长距离
			var minstep = (hei_soncontent - hei_father) / hei_e_s_y_hei;
			hei_scrollheight = hei_scroll_y_height * minstep;

			if(settings["wheelval"] >= 0) {
				if(hei_scroll_y_height >= hei_e_s_y_hei) {
					$("#" + sf + " ." + ssy).css("top", hei_e_s_y_hei + "px");
					$("#" + sf + " ." + sonc).css("margin-top", (-hei_soncontent + hei_father) + "px");
					if(window[smsscrollbottomfn]) {
						settings.deloradd = "adddel";
						window[smsscrollbottomfn](_this);
					}
				} else {
					//点击添加元素，滑轮滚动，出现滚动到底部有空白
					if((parseFloat($("#" + sf + " ." + ssy).css("top")) + parseFloat($("#" + sf + " ." + ssy).css("height"))) >= (parseFloat(hei_father) - sms)) {
						$("#" + sf + " ." + ssy).css("top", hei_e_s_y_hei + "px");
						$("#" + sf + " ." + sonc).css("margin-top", (-hei_soncontent + hei_father) + "px");
					} else {
						$("#" + sf + " ." + ssy).css("top", ((hei_scrollheight + sms) / minstep) + "px");
						$("#" + sf + " ." + sonc).css("margin-top", (-hei_scrollheight - sms) + "px");
					}
				}
			} else if(settings["wheelval"] < 0) {
				if(hei_scroll_y_height <= 0) {
					$("#" + sf + " ." + ssy).css("top", "0px");
					$("#" + sf + " ." + sonc).css("margin-top", "0px");

				} else {
					if((hei_scroll_y_height - minstep / sms) <= 0) {
						$("#" + sf + " ." + ssy).css("top", "0px");
						$("#" + sf + " ." + sonc).css("margin-top", "0px");
					} else {
						$("#" + sf + " ." + ssy).css("top", ((hei_scrollheight - sms) / minstep) + "px");
						$("#" + sf + " ." + sonc).css("margin-top", (-hei_scrollheight + sms) + "px");
					}
				}
			}
		} else if(settings.wheelxory == "wheelx") {
			//执行一次mousemove事件
			//ie、chrome当left为0时，值为auto,需做处理
			if($("#" + sf + " ." + ssx).css("left") == "auto") {
				$("#" + sf + " ." + ssx).css("left", "0");
			}
			wid_scroll_x_width = parseInt($("#" + sf + " ." + ssx).css("left"));
			wid_e_s_wid = wid_father - wid_scrollx;
			//计算滚动位置，子元素移动多长距离
			var minstep = (wid_soncontent - wid_father) / wid_e_s_wid,
				wid_scrollwidth = wid_scroll_x_width * minstep;
			if(settings["wheelval"] >= 0) {
				if(wid_scroll_x_width >= wid_e_s_wid) {
					$("#" + sf + " ." + sonc).css("margin-left", (-wid_soncontent + wid_father) + "px");
					$("#" + sf + " ." + ssx).css("left", wid_e_s_wid + "px");
					if(window[smsscrollbottomfn]) {
						settings.deloradd = "adddel";
						window[smsscrollbottomfn](_this);
					}
				} else {
					if((wid_scroll_x_width + parseInt($("#" + sf + " ." + ssx).css("width"))) >= (wid_father - sms)) {
						$("#" + sf + " ." + ssx).css("left", wid_e_s_wid + "px");
						$("#" + sf + " ." + sonc).css("margin-left", (-wid_soncontent + wid_father) + "px");
					} else {
						$("#" + sf + " ." + ssx).css("left", ((wid_scrollwidth + sms) / minstep) + "px");
						$("#" + sf + " ." + sonc).css("margin-left", (-wid_scrollwidth - sms) + "px");
					}
				}
			} else if(settings["wheelval"] < 0) {
				if(wid_scroll_x_width <= 0) {
					$("#" + sf + " ." + ssx).css("left", "0px");
					$("#" + sf + " ." + sonc).css("margin-left", "0px");
				} else {
					if((wid_scroll_x_width - (wid_e_s_wid / wid_e_s_wid) / sms) <= 0) {
						$("#" + sf + " ." + ssx).css("left", "0px");
						$("#" + sf + " ." + sonc).css("margin-left", "0px");
					} else {
						$("#" + sf + " ." + ssx).css("left", ((wid_scrollwidth - sms) / minstep) + "px");
						$("#" + sf + " ." + sonc).css("margin-left", (-wid_scrollwidth + sms) + "px");
					}
				}
			}

		}
		if(window[smscrollfn]) {
			window[smscrollfn](sf, settings["wheelval"]);
		}
	};
	this.onmouseclick = function(settings) {
		if(!(navigator.userAgent.match(/(iPhone|Android|iPad)/i))) {
			//鼠标事件添加
			//y轴
			var sf, sfwid, sfhei, flag;
			sf = $("#" + settings["getfatherid"]).val(); //获取当前点击元素的父元素id
			sfwid = $("#" + sf).width(); //获取当前元素的宽度
			sfhei = $("#" + sf).height(); //获取当前元素的高度
			flag = false; //默认设置移动开关为关闭状态
			smscrollfn = smscrollfnprv + sf;

			$("#" + sf + " ." + ssy).mousedown(function(e) {
				e = window.event || e;
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				flag = true;
				$("#" + sf + " ." + ssy).attr("unorbind", "bind");
				hei_nowposition_y = (e.pageY || e.clientY); //获取当前点击点的位置
				//ie、chrome当top为0时，值为auto,需做处理
				if($("#" + sf + " ." + ssy).css("top") == "auto") {
					$("#" + sf + " ." + ssy).css("top", "0");
				}
				hei_scroll_y_height = parseInt($("#" + sf + " ." + ssy).css("top"));
				//前点击点距离顶部的位置
				hei_click_top = hei_nowposition_y - hei_f_offhei - hei_scroll_y_height;
				$(document).mouseup(function() {
					flag = false;
					$("#" + sf + " ." + ssy).attr("unorbind", "unbind");
					$("#" + sf + " ." + ssx).attr("unorbind", "unbind");
					$("#" + settings["getfatherid"]).val(sf);
					document.body.onmousewheel = null;
					if(window[smscrollfn]) {
						window[smscrollfn](sf, settings["wheelval"]);
					}
				});
				var sfleft, sftop, eleft, etop;
				if(flag) {
					$(document).mousemove(function(e) {
						e = window.event || e;
						if(e.preventDefault) {
							e.preventDefault();
							e.stopPropagation();
						} else {
							e.returnValue = false;
							e.cancelBubble = true;
						}
						
							if($("#" + sf + " ." + ssy).attr("unorbind") == "bind") {
								var hei_scrolly = $("#" + sf + " ." + ssy).height();
								//y轴
								hei_scroll_y_height = parseInt($("#" + sf + " ." + ssy).css("top"));
								hei_nowposition_y_up = e.pageY||e.clientY; //获取移动点的坐标
								hei_scrolltop_y = hei_nowposition_y_up - hei_f_offhei - hei_click_top;
								hei_e_s_y_hei = hei_father - hei_scrolly;
								hei_soncontent = $("#" + sf + " ." + sonc).height(); //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
								hei_father = $("#" + sf).height(); //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
								//计算滚动位置，子元素移动多长距离
								hei_scrollheight = hei_scroll_y_height * ((hei_soncontent - hei_father) / hei_e_s_y_hei);
								if(hei_scrolltop_y <= 0) {
									$("#" + sf + " ." + ssy).css("top", 0 + "px");
									$("#" + sf + " ." + sonc).css("margin-top", "0px");
								} else if(hei_scrolltop_y >= hei_e_s_y_hei) {
									$("#" + sf + " ." + ssy).css("top", hei_e_s_y_hei + "px");
									$("#" + sf + " ." + sonc).css("margin-top", -(hei_soncontent - hei_father) + "px");
									if(window[smsscrollbottomfn]) {
										settings.deloradd = "adddel";
										window[smsscrollbottomfn](_this);
									}
								} else {
									$("#" + sf + " ." + ssy).css("top", hei_scrolltop_y + "px");
									$("#" + sf + " ." + sonc).css("margin-top", -hei_scrollheight + "px");
								}
							}
						
	
					})
				} else {
						document.body.onmousewheel = null;
					}

			});

			//x轴
			$("#" + sf + " ." + ssx).mousedown(function(e) {
				e = window.event || e;
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				$("#" + sf + " ." + ssx).attr("unorbind", "bind");
				flag = true;
				wid_nowposition_x = (e.pageX || e.clientX); //获取当前点击点的位置
				//ie、chrome当left为0时，值为auto,需做处理
				if($("#" + sf + " ." + ssx).css("left") == "auto") {
					$("#" + sf + " ." + ssx).css("left", "0");
				}
				wid_scroll_x_width = parseInt($("#" + sf + " ." + ssx).css("left"));
				//前点击点距离顶部的位置
				wid_click_left = wid_nowposition_x - wid_f_offwid - wid_scroll_x_width;
				
				$(document).mouseup(function() {
					flag = false;
					$("#" + sf + " ." + ssy).attr("unorbind", "unbind");
					$("#" + sf + " ." + ssx).attr("unorbind", "unbind");
					$("#" + settings["getfatherid"]).val(sf);
					document.body.onmousewheel = null;
					if(window[smscrollfn]) {
						window[smscrollfn](sf, settings["wheelval"]);
					}
				});
				if(flag) {
					$(document).mousemove(function(e) {
						var e = window.event || e;
						if(e.preventDefault) {
							e.preventDefault();
							e.stopPropagation();
						} else {
							e.returnValue = false;
							e.cancelBubble = true;
						}
						
							if($("#" + sf + " ." + ssx).attr("unorbind") == "bind") {
								var wid_scrollx = $("#" + sf + " ." + ssx).width();
								//x轴
								wid_scroll_x_width = parseInt($("#" + sf + " ." + ssx).css("left"));
								wid_np_x_left = e.pageX|| e.clientX; //获取移动点的坐标
								wid_scrollleft_x = wid_np_x_left - wid_f_offwid - wid_click_left;
								wid_e_s_wid = wid_father - wid_scrollx;
								wid_soncontent = $("#" + sf + " ." + sonc).width(); //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
								wid_father = $("#" + sf).width(); //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
								//计算滚动位置，子元素移动多长距离
								wid_scrollwidth = wid_scroll_x_width * ((wid_soncontent - wid_father) / wid_e_s_wid);
								if($("#" + sf + " ." + ssx).attr("unorbind") == "bind") {
									if(wid_scrollleft_x <= 0) {
										$("#" + sf + " ." + ssx).css("left", 0 + "px");
										$("#" + sf + " ." + sonc).css("margin-left", "0px");
									} else if(wid_scrollleft_x >= wid_e_s_wid) {
										$("#" + sf + " ." + ssx).css("left", wid_e_s_wid + "px");
										$("#" + sf + " ." + sonc).css("margin-left", -(wid_soncontent - wid_father) + "px");
										if(window[smsscrollbottomfn]) {
											settings.deloradd = "adddel";
											window[smsscrollbottomfn](_this);
	
										}
									} else {
										$("#" + sf + " ." + ssx).css("left", wid_scrollleft_x + "px");
										$("#" + sf + " ." + sonc).css("margin-left", -wid_scrollwidth + "px");
									}
								}
							}
						
	
					});
				} else {
					document.body.onmousewheel = null;
				}
			});

		};
	};
	this.addElement = function() {
		if(settings.deloradd == "adddel") { //需要获取子元素总的高度；重新计算滚动条每像素代表的实际margin距离和滚动条高度增加后，重新赋值
			if(settings.wheelxory == "wheely") {
				var hei_soncontent = $("#" + sf + " ." + sonc).height();
				var hei_scrolly = hei_father * (hei_father / hei_soncontent);
				$("#" + sf + " ." + ssy).height(hei_scrolly);
				var hei_e_s_y_hei = parseInt(hei_father - hei_scrolly);
				//计算滚动位置，子元素移动多长距离
				var minstep = (hei_soncontent - hei_father) / hei_e_s_y_hei;

				var margintopval = Math.abs(parseFloat($("#" + sf + " ." + sonc).css("margin-top")));
				$("#" + sf + " ." + ssy).css("top", margintopval / minstep + "px");
			} else if(settings.wheelxory == "wheelx") {
				var wid_soncontent = $("#" + sf + " ." + sonc).width();
				var wid_scrollx = wid_father * (wid_father / wid_soncontent);
				$("#" + sf + " ." + ssx).width(wid_scrollx);
				var wid_e_s_x_wid = parseInt(wid_father - wid_scrollx);
				//计算滚动位置，子元素移动多长距离
				var minstep = (wid_soncontent - wid_father) / wid_e_s_x_wid;

				var marginleftval = Math.abs(parseFloat($("#" + sf + " ." + sonc).css("margin-left")));
				$("#" + sf + " ." + ssx).css("left", marginleftval / minstep + "px");
			}

		}
	}
	this.scrollFunc = function(e) {
		var idval = "";
		var ev = window.event || e;

		var settings = _this.sets,
			funx, funy, fatherx, fathery;
		funx = ev.pageX||ev.clientX;
		funy = ev.pageY||ev.clientY;

		$("." + settings["soncontent"]).mouseover(function(e) {
			$("#" + settings["getfatherid"]).val($(this).parents(scrolltarget).attr("id"));
			idval = $("#" + settings["getfatherid"]).val()
			settings.wheelxory = $("#" + idval).attr("wheelxory");
			funx = ev.pageX||ev.clientX;
			funy = ev.pageY||ev.clientY;
			if(($("#" + idval).height() < $(this).height() && settings.wheelxory == "wheely") ||($("#" + idval).height() > $(this).height() && settings.wheelxory == "wheely" && top.location.href != location.href) || ($("#" + idval).width() < $(this).width() && settings.wheelxory == "wheelx")|| ($("#" + idval).width() > $(this).width() && settings.wheelxory == "wheelx" && top.location.href != location.href)) {
				document.body.onmousewheel = function() {
					return false
				};
			} else {
				document.body.onmousewheel = null;
			}
			smscrollfn = smscrollfnprv + idval;
		});
		sf = $("#" + settings["getfatherid"]).val();
		if(($("#" + sf).height() < $("#" + sf + " ." + sonc).height() && settings.wheelxory == "wheely") ||($("#" + sf).height() > $("#" + sf + " ." + sonc).height() && settings.wheelxory == "wheely" && top.location.href != location.href) || ($("#" + sf).width() < $("#" + sf + " ." + sonc).width() && settings.wheelxory == "wheelx")||($("#" + sf).width() > $("#" + sf + " ." + sonc).width() && settings.wheelxory == "wheelx" && top.location.href != location.href)) {
			document.body.onmousewheel = function() {
				return false
			};
			if(document.getElementById(sf).offsetTop != undefined) {
				fathery = $("#" + sf).offset()['top'];
				fatherx = $("#" + sf).offset()['left'];
				if(funx == undefined) {
					funx = fatherx;
				}
				if(funy == undefined) {
					funy = fathery;
				}
				if(funx >= fatherx && funx <= (fatherx + $("#" + sf).width()) && funy >= fathery && funy <= (fathery + $("#" + sf).height())) {
					if(ev.wheelDelta) { //IE/Opera/Chrome
						var thisvalue = parseInt(ev.wheelDelta);
						settings["father"] = sf;
						if(thisvalue > 0) {

							settings["wheelval"] = -1;
						} else {
							settings["wheelval"] = 1;
						}
						_this.scrollings(settings);
					} else if(ev.detail) { //Firefox
						var thisvalue = parseInt(ev.detail);
						settings["father"] = sf;
						if(thisvalue >= 0) {
							settings["wheelval"] = 1;
						} else {
							settings["wheelval"] = -1;
						}
						_this.scrollings(settings)
					}
				} else {
					document.body.onmousewheel = null;
				}
			}
		} else {
			document.body.onmousewheel = null;
		}

	};
	//移动端监听
	this.touchStart = function(e) {
		var ev = window.event || e;
		//阻止网页默认动作（即网页滚动）
		if(touchpreventDefault){
			 $("body").bind("touchstart",function(e){
			 	var ev = window.event || e;
				 ev.preventDefault();
				 ev.stopPropagation();
			})
		}
		$("#" + settings["getfatherid"]).val($(this).attr("id"));
		settings.wheelxory = $(this).attr("wheelxory");
		settings.father = $(this).attr("id");
		var touch = ev.touches[0], //获取第一个触点
			x = Number(touch.pageX), //页面触点X坐标
			y = Number(touch.pageY); //页面触点Y坐标
		//记录触点初始位置
		startX = x;
		startY = y;
		lastX = x;
		lastY = y;
		
	};
	this.touchMove = function(e) {
		var ev = window.event || e;
		var father = $("#" + settings["getfatherid"]).val();
		if(($("#" + father).height() >= $("#" + father + " ." + sonc).height() && settings.wheelxory == "wheely") || ($("#" + father).width() > $("#" + father + " ." + sonc).width() && settings.wheelxory == "wheelx")) {
			return false;
		}
		if(touchpreventDefault){
			 $("body").bind("touchmove",function(e){
			 	var ev = window.event || e;
				 ev.preventDefault();
				 ev.stopPropagation();
			})
		}
		var touch = ev.touches[0], //获取第一个触点
			x = Number(touch.pageX), //页面触点X坐标
			y = Number(touch.pageY), //页面触点Y坐标
			thisval, ylength, xlength;
		ylength = y - startY;
		xlength = x - startX;
		lastX = x;
		lastY = y;
		if(Math.abs(ylength) > Math.abs(xlength)) { //垂直方向
			if(ylength >= 0) {
				settings["wheelval"] = 1;
			} else {
				settings["wheelval"] = -1;
			}
			_this.scrollings(settings);
		} else { //水平方向
			if(xlength >= 0) {
				settings["wheelval"] = 1;
			} else {
				settings["wheelval"] = -1;
			}
			_this.scrollings(settings);
		}
	};
	this.touchEnd = function(e) {
		
		var ev = window.event || e;
		var father = $("#" + settings["getfatherid"]).val();
		var touchpreventDefaultflag = true;
		
		if(Math.abs(lastY)-Math.abs(startY)>=5|| Math.abs(lastX)-Math.abs(startX)>=5){
			touchpreventDefaultflag = false;
		}
		$("body").unbind("touchstart")
		$("body").unbind("touchmove")
		if(window["scrollTouchPreventDefault"]&&touchpreventDefaultflag){
			window["scrollTouchPreventDefault"](father);
		}
	};
	this.init = function(settings) {
		if($("body").find("." + settings.getfatherid).length < 1) {
			$("body").append("<input type=\"hidden\" class=\"" + settings.getfatherid + "\" id=\"" + settings.getfatherid + "\" value=\"" + sf + "\">");
		}
		$("#" + sf).attr("wheelxory", settings.wheelxory);
		$("#" + settings.getfatherid).val(sf);
		this.scrollings(settings);
		this.addElement();
		this.onmouseclick(settings);
		this.scrollFunc(window);
		
		if((navigator.userAgent.match(/(iPhone|Android|iPad|Mobile|uc)/i)) || smsboleonclick) {
			var listenid = document.getElementById(sf);
			listenid.addEventListener("touchstart", this.touchStart, false);
			listenid.addEventListener("touchmove", this.touchMove, false);
			listenid.addEventListener("touchend", this.touchEnd, false);
			
			if(smsboleonclick){
				if(navigator.userAgent.toLowerCase().match(/firefox/) != null) {
					document.addEventListener('DOMMouseScroll', this.scrollFunc, false);
				} else {
					window.onmousewheel = document.onmousewheel = this.scrollFunc;
				}
			}
		} else {
			/*注册事件web端*/
			if(document.addEventListener) { //W3C
				if(navigator.userAgent.toLowerCase().match(/firefox/) != null) {
					document.addEventListener('DOMMouseScroll', this.scrollFunc, false);
				} else {
					if(navigator.userAgent.toLowerCase().match(/.(msie)/) != null) {
						if(!scrollflag) //避免鼠标或者手势滑动的同事执行滚轮事件
						{
							window.onmousewheel = document.onmousewheel = this.scrollFunc; //IE/Opera/Chrome/Safari

						}

						var scrollflag = false;
						var startx = 0;
						var starty = 0;

						document.getElementById(sf).onmousedown = function(e) {
							scrollflag = false;
							var e = window.event || e;
							//获取焦点ie9/10中，对于input,textarea点击失效，绑定获取焦点事件
							$("#"+sf+" input").click(function(){
								$(this).focus();
							})
							$("#"+sf+" textarea").click(function(){
								$(this).focus();
							})
							e.returnValue = false;
							$("#" + sf + " ." + sonc).css("transition", "none"); //soble
							document.getElementById(sf).onselectstart = function() {
								return false;
							};
							if(($("#" + sf).height() >= $("#" + sf + " ." + sonc).height() && settings.wheelxory == "wheely") || ($("#" + sf).width() > $("#" + sf + " ." + sonc).width() && settings.wheelxory == "wheelx")) {
								return false;
							}
							var sfhei = $("#" + sf).height();
							var sfwid = $("#" + sf).width();
							scrollflag = true;
							if(navigator.userAgent.toLowerCase().match(/.(msie)[\/: ]([9.]+)/) != null) {
								startx = e.clientX;
								starty = e.clientY
							} else {
								startx = e.pageX;
								starty = e.pageY;
							}
							document.onmouseup = function(e) {
								var e = window.event || e;
								scrollflag = false;
								document.onselectstart = null;
								if(window[smscrollfn]) {
									window[smscrollfn](sf, settings["wheelval"]);
								}
							}
							document.getElementById(sf).onmousemove = function(e) {
								var e = window.event || e;

								var sfleft = $("#" + sf).offset().left;
								var sftop = $("#" + sf).offset().top;
								if(scrollflag) {
									document.getElementById(sf).onselectstart = function() {
										return false;
									};
									if(e.clientX < (sfleft + sfwid) && e.clientX > sfleft && e.clientY > sftop && e.clientY < (sftop + sfhei)) {

										if(navigator.userAgent.toLowerCase().match(/.(msie)[\/: ]([9.]+)/) != null) {
											var xlength = e.clientX - startx;
											var ylength = e.clientY - starty;
										} else {
											var xlength = e.pageX - startx;
											var ylength = e.pageY - starty;
										}
										if(Math.abs(xlength) - Math.abs(ylength) > 0) {
											if(settings.wheelxory == "wheelx") {
												var wid_scroll_x_widthbole = parseFloat($("#" + sf + " ." + ssy).css("left")),
													wid_father = $("#" + sf).width();
												wid_scrollx = $("#" + sf + " ." + ssx).width(),
													wid_soncontent = $("#" + sf + " ." + sonc).width(),
													wid_e_s_widbole = parseInt(wid_father - wid_scrollx);
												var minstepbole = (wid_soncontent - wid_father) / wid_e_s_widbole;
												wid_scrollwidthbole = wid_scroll_x_widthbole * minstepbole;
												//x方向
												if(xlength >= 0) { //右
													settings["wheelval"] = 1;
													if(parseInt($("#" + sf + " ." + sonc).css("margin-left")) >= 0) {
														$("#" + sf + " ." + sonc).css("margin-left", "0px");
														$("#" + sf + " ." + ssy).css("left", "0px");
													} else {
														$("#" + sf + " ." + sonc).css("margin-left", (parseInt($("#" + sf + " ." + sonc).css("margin-left")) + smsbole) + "px");
														$("#" + sf + " ." + ssy).css("left", ((wid_scrollwidthbole - smsbole) / minstepbole) + "px");
													}
												} else { //左
													settings["wheelval"] = -1;
													if(Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-left"))) >= $("#" + sf + " ." + sonc).width() - $("#" + sf).width()) {
														$("#" + sf + " ." + sonc).css("margin-left", -($("#" + sf + " ." + sonc).width() - $("#" + sf).width()) + "px");
														$("#" + sf + " ." + ssy).css("left", ($("#" + sf + " ." + ssymove).width() - $("#" + sf + " ." + ssy).width()) + "px");
														if(window[smsscrollbottomfn]) {
															settings.deloradd = "adddel";
															window[smsscrollbottomfn](_this);
														}
													} else {
														$("#" + sf + " ." + sonc).css("margin-left", (-Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-left"))) - smsbole) + "px");
														$("#" + sf + " ." + ssy).css("left", ((wid_scrollwidthbole + smsbole) / minstepbole) + "px");
													}
												}
											}
										} else {
											var hei_scroll_y_heightbole = parseFloat($("#" + sf + " ." + ssy).css("top")),
												hei_father = $("#" + sf).height();
											hei_scrolly = $("#" + sf + " ." + ssy).height(),
												hei_soncontent = $("#" + sf + " ." + sonc).height(),
												hei_e_s_y_heibole = parseInt(hei_father - hei_scrolly), //father-scollyhei
												minstepbole = (hei_soncontent - hei_father) / hei_e_s_y_heibole,
												hei_scrollheightbole = hei_scroll_y_heightbole * minstepbole;
											if(settings.wheelxory == "wheely") {
												//y方向
												if(ylength > 0) { //下
													settings["wheelval"] = 1;
													if(Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-top"))) >= $("#" + sf + " ." + sonc).height() - $("#" + sf).height()) {
														$("#" + sf + " ." + sonc).css("margin-top", -($("#" + sf + " ." + sonc).height() - $("#" + sf).height()) + "px");
														$("#" + sf + " ." + ssy).css("top", ($("#" + sf + " ." + ssymove).height() - $("#" + sf + " ." + ssy).height()) + "px");
														if(window[smsscrollbottomfn]) {
															settings.deloradd = "adddel";
															window[smsscrollbottomfn](_this);
														}
													} else {
														var margintop = parseInt($("#" + sf + " ." + sonc).css("margin-top")) - smsbole;
														$("#" + sf + " ." + sonc).css("margin-top", margintop + "px");
														$("#" + sf + " ." + ssy).css("top", ((hei_scrollheightbole + smsbole) / minstepbole) + "px");
													}
												} else { //上
													settings["wheelval"] = -1;
													if(parseInt($("#" + sf + " ." + sonc).css("margin-top")) >= 0) {
														$("#" + sf + " ." + sonc).css("margin-top", "0px");
														$("#" + sf + " ." + ssy).css("top", "0px");
													} else {
														if((hei_scroll_y_heightbole - ((hei_soncontent - hei_father) / hei_e_s_y_heibole) / smsbole) <= 0) {
															$("#" + sf + " ." + ssy).css("top", "0px");
															$("#" + sf + " ." + sonc).css("margin-top", "0px");
														} else {
															var margintop = parseInt($("#" + sf + " ." + sonc).css("margin-top")) + smsbole;
															$("#" + sf + " ." + sonc).css("margin-top", margintop + "px");
															$("#" + sf + " ." + ssy).css("top", ((hei_scrollheightbole - smsbole) / minstepbole) + "px");
														}

													}
												}
											}
										}
									} else {
										scrollflag = false;
									}
								}
							}
						}

					} else {
						window.onmousewheel = document.onmousewheel = this.scrollFunc; //IE/Opera/Chrome/Safari
					}

				}
			} else {
				if(navigator.userAgent.toLowerCase().match(/.(msie)/) != null) {
					if(!scrollflag) //避免鼠标或者手势滑动的同事执行滚轮事件
					{
						window.onmousewheel = document.onmousewheel = this.scrollFunc; //IE/Opera/Chrome/Safari
					}
					var scrollflag = false;
					var startx = 0;
					var starty = 0;
					document.getElementById(sf).onmousedown = function(e) {
						var e = window.event || e;
						e.returnValue = false;
						$("#" + sf + " ." + sonc).css("transition", "none"); //soble
						document.getElementById(sf).onselectstart = function() {
							return false;
						};
						if(($("#" + sf).height() >= $("#" + sf + " ." + sonc).height() && settings.wheelxory == "wheely") || ($("#" + sf).width() > $("#" + sf + " ." + sonc).width() && settings.wheelxory == "wheelx")) {
							return false;
						}
						var sfhei = $("#" + sf).height();
						var sfwid = $("#" + sf).width();
						scrollflag = true;
						if(navigator.userAgent.toLowerCase().match(/.(msie)[\/: ]([(8).]+)/) != null) {
							startx = e.clientX;
							starty = e.clientY
						} else {
							startx = e.pageX;
							starty = e.pageY;
						}
						document.onmouseup = function(e) {
							var e = window.event || e;
							//(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
							e.returnValue = false;
							scrollflag = false;
							document.onselectstart = null;
							if(window[smscrollfn]) {
								window[smscrollfn](sf);
							}
						}
						document.getElementById(sf).onmousemove = function(e) {
							var e = window.event || e;
							//(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
							e.returnValue = false;
							if(($("#" + sf).height() >= $("#" + sf + " ." + sonc).height() && settings.wheelxory == "wheely") || ($("#" + sf).width() > $("#" + sf + " ." + sonc).width() && settings.wheelxory == "wheelx")) {
								return false;
							}
							var sfleft = $("#" + sf).offset().left;
							var sftop = $("#" + sf).offset().top;
							if(scrollflag) {
								document.getElementById(sf).onselectstart = function() {
									return false;
								};
								if(e.clientX < (sfleft + sfwid) && e.clientX > sfleft && e.clientY > sftop && e.clientY < (sftop + sfhei)) {

									if(navigator.userAgent.toLowerCase().match(/.(msie)[\/: ]([8.]+)/) != null) {
										var xlength = e.clientX - startx;
										var ylength = e.clientY - starty;
									} else {
										var xlength = e.pageX - startx;
										var ylength = e.pageY - starty;
									}

									if(Math.abs(xlength) - Math.abs(ylength) > 0) {
										if(settings.wheelxory == "wheelx") {
											var wid_scroll_x_widthbole = parseFloat($("#" + sf + " ." + ssy).css("left")),
												wid_father = $("#" + sf).width();
											wid_scrollx = $("#" + sf + " ." + ssx).width(),
												wid_soncontent = $("#" + sf + " ." + sonc).width(),
												wid_e_s_widbole = parseInt(wid_father - wid_scrollx);
											var minstepbole = (wid_soncontent - wid_father) / wid_e_s_widbole,
												hei_scrollwidbole = wid_scroll_x_widthbole * minstepbole;
											//x方向
											if(xlength >= 0) { //右
												settings["wheelval"] = 1;
												if(parseInt($("#" + sf + " ." + sonc).css("margin-left")) >= 0) {
													$("#" + sf + " ." + sonc).css("margin-left", "0px");
													$("#" + sf + " ." + ssy).css("left", "0px");
												} else {
													$("#" + sf + " ." + sonc).css("margin-left", (parseInt($("#" + sf + " ." + sonc).css("margin-left")) + sms) + "px");
													$("#" + sf + " ." + ssy).css("left", ((hei_scrollwidbole - sms) / minstepbole) + "px");
												}
											} else { //左
												settings["wheelval"] = -1;
												if(Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-left"))) >= $("#" + sf + " ." + sonc).width() - $("#" + sf).width()) {
													$("#" + sf + " ." + sonc).css("margin-left", -($("#" + sf + " ." + sonc).width() - $("#" + sf).width()) + "px");
													$("#" + sf + " ." + ssy).css("left", ($("#" + sf + " ." + ssymove).width() - $("#" + sf + " ." + ssy).width()) + "px");
													if(window[smsscrollbottomfn]) {
														settings.deloradd = "adddel";
														window[smsscrollbottomfn](_this);
													}
												} else {
													$("#" + sf + " ." + sonc).css("margin-left", (-Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-left"))) - sms) + "px");
													$("#" + sf + " ." + ssy).css("left", ((hei_scrollwidbole + sms) / minstepbole) + "px");
												}
											}
										}
									} else {
										var hei_scroll_y_heightbole = parseFloat($("#" + sf + " ." + ssy).css("top")),
											hei_father = $("#" + sf).height();
										hei_scrolly = $("#" + sf + " ." + ssy).height(),
											hei_soncontent = $("#" + sf + " ." + sonc).height(),
											hei_e_s_y_heibole = parseInt(hei_father - hei_scrolly);
										var minstepbole = (hei_soncontent - hei_father) / hei_e_s_y_heibole,
											hei_scrollheightbole = hei_scroll_y_heightbole * minstepbole;
										if(settings.wheelxory == "wheely") {
											//y方向
											if(ylength > 0) { //下

												settings["wheelval"] = 1;
												if(parseInt($("#" + sf + " ." + sonc).css("margin-top")) >= 0) {
													$("#" + sf + " ." + sonc).css("margin-top", "0px");
													$("#" + sf + " ." + ssy).css("top", "0px");
												} else {
													$("#" + sf + " ." + sonc).css("margin-top", (parseInt($("#" + sf + " ." + sonc).css("margin-top")) + sms) + "px");
													//滚动条处理
													//计算每1像素代表的实际距离   margintop/没1像素代表的实际距离（+-）步长
													$("#" + sf + " ." + ssy).css("top", ((hei_scrollheightbole - sms) / minstepbole) + "px");
												}
											} else { //上

												settings["wheelval"] = -1;
												if(Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-top"))) >= $("#" + sf + " ." + sonc).height() - $("#" + sf).height()) {
													$("#" + sf + " ." + sonc).css("margin-top", -($("#" + sf + " ." + sonc).height() - $("#" + sf).height()) + "px");
													$("#" + sf + " ." + ssy).css("top", ($("#" + sf + " ." + ssymove).height() - $("#" + sf + " ." + ssy).height()) + "px");
													if(window[smsscrollbottomfn]) {
														settings.deloradd = "adddel";
														window[smsscrollbottomfn](_this);
													}
												} else {
													$("#" + sf + " ." + sonc).css("margin-top", (-Math.abs(parseInt($("#" + sf + " ." + sonc).css("margin-top"))) - sms) + "px");
													$("#" + sf + " ." + ssy).css("top", ((hei_scrollheightbole + sms) / minstepbole) + "px");
												}

											}
										}
									}
								}
							}

						}

					}

					if(window.onmousewheel || document.onmousewheel) { //监听滚轮事件，如果ie有，则执行
						_this.scrollings(settings);
					}
				} else {
					window.onmousewheel = document.onmousewheel = this.scrollFunc; //IE/Opera/Chrome/Safari
				}
			}
		};

		if(settings["scrolltop"] == "top") {
			$("#" + settings["father"] + " ." + settings["soncontent"]).css("margin-top", "0");
			$("#" + settings["father"] + " ." + settings["scroll_y"]).css("top", "0");
		} else if(settings["scrolltop"] == "bottom" && $("#" + settings["father"]).height() <= $("#" + settings["father"] + " ." + settings["soncontent"]).height()) {
			var scrolltop = $("#" + settings["father"]).height() - $("#" + settings["father"] + " ." + settings["scroll_y"]).height();
			var margintop = $("#" + settings["father"] + " ." + settings["soncontent"]).height() - $("#" + settings["father"]).height();
			$("#" + settings["father"] + " ." + settings["soncontent"]).css("margin-top", -margintop + "px");
			$("#" + settings["father"] + " ." + settings["scroll_y"]).css("top", scrolltop + "px");
		}
	};
	this.init(settings);
}
	/*
 $().shineonScroll({"father":"scrollfather1"}); 
  #scrollfather1,#scrollfather2{
	background: rgba(230,230,230,0.5);
	float: left;
	height: 300px;
	position: relative;
	overflow: hidden;
	width: 348px;
}
.scrollson{
	float: left;
	width: 600px;
}
.scroll_y{
	background: #ff0;
	border-radius: 15px;
	position: absolute;
	right: 0;
	width: 15px;
}
.scroll_x{
	background: #ff0;
	border-radius: 15px;
	position: absolute;
	bottom: 0;
	height: 15px;
}
.scroll_ymove{
	background: rgba(0,0,0,0.2);
	border-radius: 15px;
	height: 300px;
	position: absolute;
	right: 0;
	width: 15px;
	z-index: 2;
}
.scroll_xmove{
	background: rgba(0,0,0,0.2);
	border-radius: 15px;
	height: 15px;
	position: absolute;
	bottom: 0;
	width: 100%;
	z-index: 1;
}
<div class="scrollfather" id="scrollfather2">
	<div class="scrollson">
		123123
	</div>
	<div class="scroll_ymove">
	<div class="scroll_y" unorbind="unbind"></div>
	</div>
	<div class="scroll_xmove">
	<div class="scroll_x" unorbind="unbind"></div>
	</div>
</div>
  */