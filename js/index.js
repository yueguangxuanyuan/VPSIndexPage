	
;( function( $, window, undefined ) {

	'use strict';
	$.SwitchImageController = function(element){
		this.$el = element;
		this._init();
	}
	
	$.SwitchImageController.prototype = {
		$el : 'undefined',
		$el_front : 'undefined',
		$el_back: 'undefined',
		$el_router : 'undefined',
		$size : -1 ,
		$index : -1,
		//实现dot激活状态修改
		changeDotStatus:function (index){
			var dot_list = this.$el_router.children('span');
			if(dot_list && dot_list.length>0&&index >= 0 && index < dot_list.length){
				for(var i =0 ; i < dot_list.length; i++){
					if( i != index){
						$(dot_list[i]).removeClass('current');
					}else{
						
						$(dot_list[i]).addClass('current');
					}
				}
			}
			
		},
		
		checkImageFrontBackStatus:function(index){
			if(index == 0){
				this.$el_back.addClass('disable');
			}else{
				this.$el_back.removeClass('disable');
			}
		
			if(index == (this.$size-1)){
				this.$el_front.addClass('disable');
			}else{
				this.$el_front.removeClass('disable');
			}
			
		},
		
		//实现跳转到指定的偏移
		moveImageLayer:function(index){
			this.$el.css('transition','transform 1500ms ease');
			this.$el.css('transform','translate3d('+index/this.$size*100*-1+'%,0px,0px)');
			
		},
		
		//实现统一的跳转
		imageSwitch:function(index){
			if(index >= 0 && index < this.$size){
				if(this.$el_router){
					this.changeDotStatus(index);
				}
				if(this.$el_front && this.$el_back){
					this.checkImageFrontBackStatus(index);
				}
				if(this.$el){
					this.moveImageLayer(index);
				}
				this.$index = index;
			}			
		},
		
		//实现点击dot的跳转
		jump:function(index){
			this.imageSwitch(index);
		},
		//前进
		jumpNext:function(){
			this.imageSwitch(this.$index+1);
		},
		
		//后退
		jumpPrev:function(){
			this.imageSwitch(this.$index-1);
		},
		
		_init:function(){
			var self = this;
			var li_list =  this.$el.children('li');
			var size = this.$size = li_list.length;
			
			size =  size > 0 ? size : 1;
			//动态计算元素的宽度来实现撑满父级元素
			li_list.each(
				function(){
					$(this).css('width',1/size*100+"%");
				}
			);
			this.$el.css('width',size*100 +'%');	
			
			if( li_list.length > 0 ){
				//在底部添加子标签
				var router = $('<div class="image-router"> </div>');
				//$('<span class="current"></span>').appendTo(router);
				for(var i = 0 ; i < size ; i++){
					$('<span ></span>').appendTo(router);
				}
				this.$el.after(router);
				
				//添加前进后退监听
				this.$el_router = this.$el.next('.image-router')
				if(this.$el_router.length > 0){
					this.$el_router = $(this.$el_router);
					var span_list = this.$el_router.children('span');
					for(var i = 0 ; i < span_list.length ;i++){
						$(span_list[i]).on('click',function(event){
							self.jump($(this).index());
						});						
					}
				}
				
				//在侧面添加前进后退标签
				this.$el.after($('<span class="imaga-prev-next image-back" >&lt</span>'));
				this.$el_back = this.$el.next('.image-back');
				if(this.$el_back.length > 0){
					//this.$el_back =$(this.$el_back);
					this.$el_back.on(
						'click',function(event){
							self.jumpPrev();
						}
					);
				}
				this.$el.after($('<span class="imaga-prev-next image-front">&gt</span>'));
				this.$el_front = this.$el.next('.image-front');
				if(this.$el_front.length > 0){
					this.$el_front.on(
						'click',function(event){
							self.jumpNext();
						}
					);
					//this.$el_front = $(this.$el_front);
				}
				
				this.imageSwitch(0);
			}
			
		}
	}
	
	//初始化界面元素
	$('.hero-image-div').each(
		function(){
			//针对一个hero-image-div下只有一个轮转图片的时候才会生效
			$(this).children('ul').each(
				function(){
					var instance = $.data(this,'SwitchImage');
					if(instance){
						instance._init();
					}else{
						instance = $.data(this,'SwitchImage',new $.SwitchImageController($(this)));
					}
				}
			);	
			$(this).on(
				'mouseenter',function(event){
					$(this).find('span.image-front').addClass('arise');
					$(this).find('span.image-back').addClass('arise');
				}
			);
			
			$(this).on(
				'mouseleave',function(event){
					$(this).find('span.image-front').removeClass('arise');
					$(this).find('span.image-back').removeClass('arise');
				}
			);
			
		}
	);
} )( jQuery, window );