/*
 * 名称：模拟滚动条控件/shineonScroll
 * 作者：djl
 * 邮箱：474569696@qq.com
 * 日期：2016/4/14
 */
$.fn.shineonScroll = function(options,fn) 
	{
		var _this=this;
		_this.fn=fn;
		var defaults = {
			"father":"scrollfather1",//当前区域id
			"soncontent":"scrollson",//当前区域子元素样式表
			"scroll_y":"scroll_y",//模拟滚动条y轴背景样式
			"scroll_ymove":"scroll_ymove",//模拟滚动条y轴滚动条背景样式
			"scroll_x":"scroll_x",//模拟滚动条y轴背景样式
			"scroll_xmove":"scroll_xmove",//模拟滚动条x轴滚动条背景样式
			"deloradd":"",//添加元素，删除元素参数del/add
			"wheelxory":"wheely",//滚动类型wheelx轴，wheely轴
			"wheelval":0,//滑轮上下滚动的值，1位向下，-1位向上
			"marginstep":10,//步长,请使用数字
			"getfatherid":"whichscroll",//获取当前滚动区域模块id的隐藏域id
			"scrolltop":"top",
			"resetinit":0//0代表不做处理，1代表重置
		};
		
		var settings = $.extend({},defaults,options);
		if(screen.width>=1600){
			settings.marginstep=10;
		}
		if(screen.width==1280){
			settings.marginstep=15;
		}
		else
		{
			settings.marginstep=5;
		}
		this.sets=settings;
		this.clickfatherid="";
		//y轴的高度计算:父元素高度-父元素的高度除以子元素总高；
		
		//var marginstep=15;//步长
		var hei_father,//父元素（y轴）
			hei_f_offhei,//父元素距离顶部高度（y轴）hei_father_offheight
			hei_f_offleft,//父元素距离顶部高度（y轴）hei_fatheroffleft
		    hei_soncontent,//子元素（y轴）
		    hei_scrolly,//滚动条Y（y轴）
		    hei_nowposition_y,//当前点击位置（y轴）
		    hei_nowposition_y_up,//（y轴）
		    hei_scrolltop_y,//滚动条距离顶部位置（y轴）
		    hei_click_top,//点击位置距离滚动条滑块顶部的高度（y轴）
		    hei_scroll_y_height,//模拟滚动条top值（y轴）
		    hei_e_s_y_hei,//除滑块以外的高度值（y轴）hei_exceptscrollyheight
		    hei_scrollheight,//滑块每移动一像素，代表的实际margin-top距离（y轴）
		    hei_c_hei,//添加或删除元素后的变化的滑块高度（y轴）hei_changeheight
		    hei_c_top,//添加或删除元素后的变化的滑块top值（y轴）hei_changetop
		//x轴的宽度计算:父元素width-父元素的宽度除以子元素总宽；
		    wid_father,//父元素（x轴）
			wid_f_offwid,//父元素距离左侧宽度（x轴）wid_fatheroffwidth
		    wid_soncontent,//子元素（x轴）
		    wid_scrollx,//滚动条X（x轴）
		    wid_nowposition_x,//当前点击位置（x轴）
		    wid_np_x_left,//（x轴）wid_nowposition_x_left
		    wid_scrollleft_x,//滚动条距离左侧位置（x轴）
		    wid_click_left,//点击位置距离滚动条滑块左侧的宽度（x轴）
		    wid_scroll_x_width,//模拟滚动条left值（x轴）
		    wid_e_s_wid,//除滑块以外的宽度值（x轴）wid_exceptscrollxwidth
		    wid_scrollwidth,//滑块每移动一像素，代表的实际margin-left距离（x轴）
		    wid_c_wid,//添加或删除元素后的变化的滑块width（x轴）wid_changewidth
		    wid_c_left,//添加或删除元素后的变化的滑块left值（x轴）wid_changeleft
		    sf      = settings.father,
		    sonc    = settings.soncontent,
		    ssymove = settings.scroll_ymove,
		    ssy     = settings.scroll_y,
		    ssxmove = settings.scroll_xmove,
		    ssx     = settings.scroll_x,
		    sms     = settings.marginstep;
		    if(settings["resetinit"])
		    {
		    	if(settings["wheelxory"]=="wheely")
		    	{
		    		$("#"+settings["father"]+" ."+settings["soncontent"]).css("margin-top","0");
					$("#"+settings["father"]+" ."+settings["scroll_y"]).css("top","0");
		    	}
		    	else if(settings["wheelxory"]=="wheelx")
		    	{
		    		$("#"+settings["father"]+" ."+settings["soncontent"]).css("margin-left","0");
					$("#"+settings["father"]+" ."+settings["scroll_x"]).css("left","0");
		    	}
		    	return;
		    }
		this.scrollings=function(settings)
		{
			var idval="";//获取当前鼠标指向元素的id也就是settings['father']
			$("."+settings["soncontent"]).mouseover(function(){
				$("#"+settings["getfatherid"]).val($(this).parents(".scrollfather").attr("id"));
				idval=$("#"+settings["getfatherid"]).val();
			});
			if($("#"+sf).offset()!=undefined)
			{
				//y轴
				hei_f_offhei    = $("#"+sf).offset()['top'];
				
				hei_father		= $("#"+sf).height();
				hei_soncontent	= $("#"+sf+" ."+sonc).height();
				//x轴
				wid_f_offwid    = $("#"+sf).offset()['left'];
				wid_father		= $("#"+sf).width();
				wid_soncontent	= $("#"+sf+" ."+sonc).width();
				
				//y轴
				if(hei_father<=hei_soncontent){
					$("#"+sf+" ."+ssy).show();
					$("#"+sf+" ."+ssymove).show();
					hei_scrolly	= hei_father*(hei_father/hei_soncontent);
					$("#"+sf+" ."+ssy).height(hei_scrolly);
				}else{
					$("#"+sf+" ."+ssy).hide();
					$("#"+sf+" ."+ssymove).hide();
				}
				//x轴
				if(wid_father<wid_soncontent)
				{
					$("#"+sf+" ."+ssx).show();
					$("#"+sf+" ."+ssxmove).show();
					wid_scrollx		=	wid_father*(wid_father/wid_soncontent);
					$("#"+sf+" ."+ssx).width(wid_scrollx);
				}
				else
				{
					$("#"+sf+" ."+ssx).hide();
					$("#"+sf+" ."+ssxmove).hide();
					
				}
				if (!(navigator.userAgent.match(/(iPhone|Android|iPad)/i)))
				{
					//鼠标事件添加
					//y轴
					$("#"+sf+" ."+ssy).mousedown(function(e){
						e.preventDefault();
						var sf            = $(this).parents(".scrollfather").attr("id");
						$("#"+settings["getfatherid"]).val(sf);
						hei_nowposition_y = e.pageY;//获取当前点击点的位置
						//ie、chrome当top为0时，值为auto,需做处理
						if($("#"+sf+" ."+ssy).css("top")=="auto"){
							$("#"+sf+" ."+ssy).css("top","0");
						}
						hei_scroll_y_height=parseInt($("#"+sf+" ."+ssy).css("top"));
						//前点击点距离顶部的位置
						hei_click_top=hei_nowposition_y-hei_f_offhei-hei_scroll_y_height;
						$("#"+sf+" ."+ssy).attr("unorbind","bind");

					});
					//x轴
					$("#"+sf+" ."+ssx).mousedown(function(e){
						e.preventDefault();
						var sf            = $(this).parents(".scrollfather").attr("id");
						$("#"+settings["getfatherid"]).val(sf);
						wid_nowposition_x=e.pageX;//获取当前点击点的位置
						//ie、chrome当left为0时，值为auto,需做处理
						if($("#"+sf+" ."+ssx).css("left")=="auto")
						{
							$("#"+sf+" ."+ssx).css("left","0");
						}
						wid_scroll_x_width=parseInt($("#"+sf+" ."+ssx).css("left"));
						//前点击点距离顶部的位置
						wid_click_left=wid_nowposition_x-wid_f_offwid-wid_scroll_x_width;
						$("#"+sf+" ."+ssx).attr("unorbind","bind");
					});
					$(document).mouseup(function(e){
						var sf            = $("#"+settings["getfatherid"]).val();;
						$("#"+sf+" ."+ssy).attr("unorbind","unbind");
						$("#"+sf+" ."+ssx).attr("unorbind","unbind");
						//alert(sf)
						$("#"+settings["getfatherid"]).val(sf);
					});
					$(document).mousemove(function(e){
						//e.preventDefault();
						var sf=$("#"+settings["getfatherid"]).val();
						//y轴
						hei_scroll_y_height=parseInt($("#"+sf+" ."+ssy).css("top"));
						hei_nowposition_y_up=e.pageY;//获取移动点的坐标
						hei_scrolltop_y=hei_nowposition_y_up-hei_f_offhei-hei_click_top;
						hei_e_s_y_hei=hei_father-hei_scrolly;
						//计算滚动位置，子元素移动多长距离
						hei_scrollheight=hei_scroll_y_height*((hei_soncontent-hei_father)/hei_e_s_y_hei);
						if($("#"+sf+" ."+ssy).attr("unorbind")=="bind")
						{
							if(hei_scrolltop_y<=0)
							{
								$("#"+sf+" ."+ssy).css("top",0+"px");
							}
							else if(hei_scrolltop_y>=hei_e_s_y_hei)
							{
								$("#"+sf+" ."+ssy).css("top",hei_e_s_y_hei+"px");
							}
							else
							{
								$("#"+sf+" ."+ssy).css("top",hei_scrolltop_y+"px");
							}
							$("#"+sf+" ."+sonc).css("margin-top",-hei_scrollheight+"px");
						}
						else
						{
					
						}
						//x轴
						wid_scroll_x_width = parseInt($("#"+sf+" ."+ssx).css("left"));
						wid_np_x_left      = e.pageX;//获取移动点的坐标
						wid_scrollleft_x   = wid_np_x_left-wid_f_offwid-wid_click_left;
						wid_e_s_wid        = wid_father-wid_scrollx;
						//计算滚动位置，子元素移动多长距离
						wid_scrollwidth    = wid_scroll_x_width*((wid_soncontent-wid_father)/wid_e_s_wid);
						if($("#"+sf+" ."+ssx).attr("unorbind")=="bind")
						{
							if(wid_scrollleft_x<=0)
							{
								$("#"+sf+" ."+ssx).css("left",0+"px");
							}
							else if(wid_scrollleft_x>=wid_e_s_wid)
							{
								$("#"+sf+" ."+ssx).css("left",wid_e_s_wid+"px");
							}
							else
							{
								$("#"+sf+" ."+ssx).css("left",wid_scrollleft_x+"px");
							}
							$("#"+sf+" ."+sonc).css("margin-left",-wid_scrollwidth+"px");
						}
						else
						{
					
						}
					})
				};
				if(settings.deloradd=="del")
				{//需要获取子元素总的高度；重新计算滚动条每像素代表的实际margin距离和滚动条高度增加后，重新赋值
					hei_c_hei = parseInt($("#"+sf+" ."+ssy).css("height"));
					hei_c_top = parseInt($("#"+sf+" ."+ssy).css("top"));
					if((hei_c_hei+hei_c_top)>=hei_father)
					{
						$("#"+sf+" ."+ssy).css("top",(hei_father-hei_c_hei)+"px");
					}
					else
					{
						
					}
					hei_scroll_y_height = parseInt($("#"+sf+" ."+ssy).css("top"));
					hei_e_s_y_hei       = hei_father-hei_scrolly;
					//计算滚动位置，子元素移动多长距离
					hei_scrollheight    = hei_scroll_y_height*((hei_soncontent-hei_father)/hei_e_s_y_hei);
					$("#"+sf+" ."+sonc).css("margin-top",-hei_scrollheight+"px");
					
				}
				else if(settings.deloradd=="add")
				{//需要获取子元素总的高度；重新计算滚动条每像素代表的实际margin距离和滚动条高度增加后，重新赋值
					hei_c_hei=parseInt($("#"+sf+" ."+ssy).css("height"));
					hei_c_top=parseInt($("#"+sf+" ."+ssy).css("top"));
					if((hei_c_hei+hei_c_top)<=hei_father)
					{
						$("#"+sf+" ."+ssy).css("top",(hei_father-hei_c_hei)+"px");
					}else{}
					//$("."+scroll_y).css("top",(hei_father-hei_c_top)+"px");
					hei_scroll_y_height = parseInt($("#"+sf+" ."+ssy).css("top"));
					hei_e_s_y_hei       = hei_father-hei_scrolly;
					//计算滚动位置，子元素移动多长距离
					hei_scrollheight    = hei_scroll_y_height*((hei_soncontent-hei_father)/hei_e_s_y_hei);
					$("#"+sf+" ."+sonc).css("margin-top",-hei_scrollheight+"px");
				}else{}
				if(settings.wheelxory=="wheely")
				{
					//执行一次mousemove事件
					//ie、chrome当top为0时，值为auto,需做处理
					if($("#"+sf+" ."+ssy).css("top")=="auto")
					{
						$("#"+sf+" ."+ssy).css("top","0");
					}
					hei_scroll_y_height = parseInt($("#"+sf+" ."+ssy).css("top"));
					hei_e_s_y_hei       = parseInt(hei_father-hei_scrolly);
					//计算滚动位置，子元素移动多长距离
					hei_scrollheight    = hei_scroll_y_height*((hei_soncontent-hei_father)/hei_e_s_y_hei);
					if(settings["wheelval"]>=0)
					{
						if(hei_scroll_y_height==hei_e_s_y_hei)
						{
							$("#"+sf+" ."+ssy).css("top",hei_e_s_y_hei+"px");
							$("#"+sf+" ."+sonc).css("margin-top",(-hei_soncontent+hei_father)+"px");
						}
						else if(hei_scroll_y_height>hei_e_s_y_hei)
						{
							$("#"+sf+" ."+sonc).css("margin-top",(-hei_soncontent+hei_father)+"px");
						}
						else
						{
							//点击添加元素，滑轮滚动，出现滚动到底部有空白
							//alert((parseInt($("."+scroll_y).css("top"))+parseInt($("."+scroll_y).css("height"))))
							if((parseInt($("#"+sf+" ."+ssy).css("top"))+parseInt($("#"+sf+" ."+ssy).css("height")))>=(parseInt(hei_father)-sms))
							{
								//alert("a")
								$("#"+sf+" ."+ssy).css("top",hei_e_s_y_hei+"px");
								$("#"+sf+" ."+sonc).css("margin-top",(-hei_soncontent+hei_father)+"px");
							}
							else
							{
								$("#"+sf+" ."+ssy).css("top",(hei_scroll_y_height+sms/((hei_soncontent-hei_father)/hei_e_s_y_hei))+"px");
								$("#"+sf+" ."+sonc).css("margin-top",(-hei_scrollheight-sms)+"px");
							}
						}	
					}
					else if(settings["wheelval"]<0)
					{
						if(hei_scroll_y_height<=0)
						{
							$("#"+sf+" ."+ssy).css("top","0px");
							$("#"+sf+" ."+sonc).css("margin-top","0px");
						}
						else
						{
							if((hei_scroll_y_height-sms/((hei_soncontent-hei_father)/hei_e_s_y_hei))<=0)
							{
								$("#"+sf+" ."+ssy).css("top","0px");
								$("#"+sf+" ."+sonc).css("margin-top","0px");
							}
							else
							{
								$("#"+sf+" ."+ssy).css("top",(hei_scroll_y_height-sms/((hei_soncontent-hei_father)/hei_e_s_y_hei))+"px");
						  		$("#"+sf+" ."+sonc).css("margin-top",(-hei_scrollheight+sms)+"px");
							}
						}
					}
				}
				else if(settings.wheelxory=="wheelx")
				{
					//执行一次mousemove事件
					//ie、chrome当left为0时，值为auto,需做处理
					if($("#"+sf+" ."+ssx).css("left")=="auto")
					{
						$("#"+sf+" ."+ssx).css("left","0");
					}
					wid_scroll_x_width = parseInt($("#"+sf+" ."+ssx).css("left"));
					wid_e_s_wid        = wid_father-wid_scrollx;
					//计算滚动位置，子元素移动多长距离
					wid_scrollwidth    = wid_scroll_x_width*((wid_soncontent-wid_father)/wid_e_s_wid);
					
					if(settings["wheelval"]>=0)
					{
						
						if(wid_scroll_x_width==wid_e_s_wid)
						{
							$("#"+sf+" ."+ssx).css("left",wid_e_s_wid+"px");
							$("#"+sf+" ."+sonc).css("margin-left",(-wid_soncontent+wid_father)+"px");
						}
						else if(wid_scroll_x_width>wid_e_s_wid)
						{
							$("#"+sf+" ."+sonc).css("margin-left",(-wid_soncontent+wid_father)+"px");
		//					$("."+scroll_x).css("left",wid_e_s_wid+"px");
						}
						else
						{
							if((wid_scroll_x_width+parseInt($("#"+sf+" ."+ssx).css("width")))>=(wid_father-sms))
							{
								$("#"+sf+" ."+ssx).css("left",wid_e_s_wid+"px");
								$("#"+sf+" ."+sonc).css("margin-left",(-wid_soncontent+wid_father)+"px");
							}
							else
							{
								$("#"+sf+" ."+ssx).css("left",(wid_scroll_x_width+sms/(wid_e_s_wid/wid_e_s_wid))+"px");
								$("#"+sf+" ."+sonc).css("margin-left",(-wid_scrollwidth-sms)+"px");
							}			
						}	
					}
					else if(settings["wheelval"]<0)
					{
						if(wid_scroll_x_width<=0)
						{
							$("#"+sf+" ."+ssx).css("left","0px");
							$("#"+sf+" ."+sonc).css("margin-left","0px");
						}
						else
						{
							if((wid_scroll_x_width-sms/(wid_e_s_wid/wid_e_s_wid))<=0)
							{
								$("#"+sf+" ."+ssx).css("left","0px");
								$("#"+sf+" ."+sonc).css("margin-left","0px");
							}
							else
							{
								$("#"+sf+" ."+ssx).css("left",(wid_scroll_x_width-sms/(wid_e_s_wid/wid_e_s_wid))+"px");
						   		 $("#"+sf+" ."+sonc).css("margin-left",(-wid_scrollwidth+sms)+"px");
							}
						}
					}
					
				}
			}
			
		};
		this.scrollFunc=function(e)
			{
				
				var idval="";
				var ev       = window.event || e;
				var settings = _this.sets,
				funx,funy,fatherx,fathery;
			    funx         = ev.pageX;
			    funy         = ev.pageY;
			    
			    $("."+settings["soncontent"]).mouseover(function(e){
					$("#"+settings["getfatherid"]).val($(this).parents(".scrollfather").attr("id"));
					funx         = e.pageX;
			   		 funy        = e.pageY;
				});
				sf=$("#"+settings["getfatherid"]).val();
			    if($("#"+sf).height()<$("#"+sf).children("div").eq(0).height()||$("#"+sf).width()<$("#"+sf).children("div").eq(0).width())
				{
					if(document.getElementById(sf).offsetTop!=undefined)
					{
						fathery      = $("#"+sf).offset()['top'];
					    fatherx      = $("#"+sf).offset()['left'];
					    if(funx==undefined){
					    	funx=fatherx;
					    }
					    if(funy==undefined){
					    	funy=fathery;
					    }
					    if(funx>=fatherx&&funx<=(fatherx+$("#"+sf).width())&&funy>=fathery&&funy<=(fathery+$("#"+sf).height()))
					    {		    	
						    if(ev.wheelDelta)
						    {//IE/Opera/Chrome
						    	var thisvalue = parseInt(ev.wheelDelta);
						    	settings["father"]=sf;
								if(thisvalue>=0)
								{
									
									settings["wheelval"]=-1;
								}
								else
								{
									settings["wheelval"]=1;
								}
								_this.scrollings(settings);
						    }
						    else if(ev.detail)
						    {//Firefox
						    	var thisvalue=parseInt(ev.detail);
						    	settings["father"]=sf;
								if(thisvalue>=0)
								{
									settings["wheelval"]=1;
								}
								else
								{
									settings["wheelval"]=-1;	
								}
								_this.scrollings(settings)
						    }
					   }
					}
				}
			    
			   
			};
			//移动端监听
			this.touchStart=function(e) 
			{
				var ev    = window.event || e;
				//阻止网页默认动作（即网页滚动）
			    ev.preventDefault();
			    var touch = ev.touches[0], //获取第一个触点
			    x         = Number(touch.pageX), //页面触点X坐标
			    y         = Number(touch.pageY); //页面触点Y坐标
			    //记录触点初始位置
			    startX = x;
			    startY = y;			
			};
			this.touchMove=function(e) 
			{
				var ev    = window.event || e;
			    //ev.preventDefault();
			     var father = $("#"+settings["getfatherid"]).val(),
			     touch      = ev.touches[0], //获取第一个触点
			     x          = Number(touch.pageX), //页面触点X坐标
			     y          = Number(touch.pageY), //页面触点Y坐标
			     thisval,ylength,xlength;
			     ylength    = y-startY;
			     xlength    = x-startX;
			     if(Math.abs(ylength)>Math.abs(xlength))
			     {
			     	if(ylength>=0){
				     	 settings["wheelval"]=1;
				    }
			     	else
			     	{
				     	 settings["wheelval"]=-1;
				    }
					_this.scrollings(settings);
			     }
			     else
			     {
			     	if(xlength>=0)
			     	{
				     	 settings["wheelval"]=1;
				    }
			     	else
			     	{
				     	 settings["wheelval"]=-1;
				    }
				    _this.scrollings(settings);
			     }
			
			};
			this.touchEnd=function(e) 
			{
				var ev    = window.event || e;
			    ev.preventDefault();
			};
			this.init=function(settings)
			{
				if($("body").find("."+settings.getfatherid).length<1)
				{
					$("body").append("<input type=\"hidden\" class=\""+settings.getfatherid+"\" id=\""+settings.getfatherid+"\" value=\""+sf+"\">");
				}
				$("#"+settings.getfatherid).val(sf);
				this.scrollings(settings);
				this.scrollFunc(window);
				if ((navigator.userAgent.match(/(iPhone|Android|iPad)/i)))
				{
					var listenid=document.getElementById(sf);
					listenid.addEventListener("touchstart",this.touchStart, false);
					listenid.addEventListener("touchmove",this.touchMove, false);
					listenid.addEventListener("touchend",this.touchEnd, false);
					
				}
				else
				{
					/*注册事件web端*/
					if(document.addEventListener)
					{//W3C
						if(navigator.userAgent.toLowerCase().match(/firefox/) != null)
						{
							document.addEventListener('DOMMouseScroll',this.scrollFunc,false);
						}
					    else
					    {
					    	if (navigator.userAgent.toLowerCase().match(/.(msie)/)!=null) 
					    	{
					    		
					    		if(!scrollflag)//避免鼠标或者手势滑动的同事执行滚轮事件
					    		{
					    			window.onmousewheel=document.onmousewheel=this.scrollFunc;//IE/Opera/Chrome/Safari
					    		}
							    var scrollflag=false;
							    var startx=0;
							    var starty=0;
								document.getElementById(sf).onmousedown=function(e){
									document.onselectstart=function (){return false;};
									scrollflag=true;
									startx=e.pageX;
									starty=e.pageY;
								}
								document.getElementById(sf).onmouseup=function(e){
									if(scrollflag)
									{	
										var xlength=e.pageX-startx;
										var ylength=e.pageY-starty;
										if(Math.abs(xlength)-Math.abs(ylength)>0){
											if(settings.wheelxory=="wheelx")
											{
												//x方向
												if(xlength>=0)
										     	{//右
											     	 settings["wheelval"]=1;
											    }
										     	else
										     	{//左
											     	 settings["wheelval"]=-1;
											    }
											    _this.scrollings(settings);				
											}							
										}
										else
										{
											if(settings.wheelxory=="wheely")
											{
												//y方向
												if(ylength>0){//下
											     	 settings["wheelval"]=1;
											    }
										     	else
										     	{//上
											     	 settings["wheelval"]=-1;
											    }
												_this.scrollings(settings);
											}
											
										}
									}
									scrollflag=false;
									document.onselectstart=null;
								}
						    }
					    	else
					    	{
					    		window.onmousewheel=document.onmousewheel=this.scrollFunc;//IE/Opera/Chrome/Safari
					    	}
					    	
						}
					}
				};
				
				if(settings["scrolltop"]=="top")
				{
					$("#"+settings["father"]+" ."+settings["soncontent"]).css("margin-top","0");
					$("#"+settings["father"]+" ."+settings["scroll_y"]).css("top","0");
				}
				else if(settings["scrolltop"]=="bottom"&&$("#"+settings["father"]).height()<=$("#"+settings["father"]+" ."+settings["soncontent"]).height())
				{
					var scrolltop=$("#"+settings["father"]).height()-$("#"+settings["father"]+" ."+settings["scroll_y"]).height();
					var margintop=$("#"+settings["father"]+" ."+settings["soncontent"]).height()-$("#"+settings["father"]).height();
					$("#"+settings["father"]+" ."+settings["soncontent"]).css("margin-top",-margintop+"px");
					$("#"+settings["father"]+" ."+settings["scroll_y"]).css("top",scrolltop+"px");
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