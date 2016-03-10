//弹性运动
(function($){
    var left=0;
    var iSpeed=0;
    var timer=null;
    $.fn.emove=function(iTarget){
        this.each(function(){
            var obj=$(this);
            clearInterval(timer);
            timer=setInterval(function(){
                iSpeed+=(iTarget-left)/6;
                iSpeed*=0.7;
                left+=iSpeed;
                obj.css('left',Math.round(left));
                //取整 保证正好达到目标值
                if(Math.round(iSpeed)==0 && Math.round(left)==iTarget){
                    clearInterval(timer);
                }
            },30);
        })
    }
})(jQuery);
//轮播图插件
$.fn.play=function(){
    this.each(function(){
        var obj=$(this);
        var oL=obj.find('#left');
        var oR=obj.find('#right');
        var oUl=obj.find('#picplay');
        var l=oUl.children().length;
        var oLi=$('<li></li>');
        oLi.html(oUl.children('.first').html());
        //var oLi=$('<li>\
        //    <img src="../images/html.jpg" alt="html">\
        //    <div>\
        //    <p>I will start fresh,be someone new</p>\
        //</div>\
        //</li>');
        oLi.appendTo(oUl);
        var w=oUl.children().eq(0).width();
        var aLi=oUl.children();
        oUl.css('width',aLi.length*w+'px');
        var on=false;
        var n=0;
        var oBtnbox=$('.btnbox');
        var aBtn=oBtnbox.children();

        //向左
        oL.click(

            function(){
                if(on){return}
                on=true;
                if(n<=0){
                    n=l;
                    oUl.css('left',-l*w+'px');
                }

                n--;
                aBtn.removeClass('active');
                aBtn.eq(n).addClass('active');
                oUl.stop().animate({
                   left:-n*w
                },{
                    complete:function(){
                        on=false;

                    }
                })
            }
        );
        //向右
        oR.click(
            function(){
                move();

            }
        );
        function move(){
            if(on) return;
            n++;
            aBtn.removeClass('active');
            if(n==1){
                aBtn.eq(1).addClass('active');
            }
            else{
                aBtn.eq(n).addClass('active');
            }
            on=true;
            oUl.stop().animate({
                left:-n*w
            },{
                complete:function(){
                    on=false;
                    if(n==l){
                        oUl.css('left',0);
                        n=0;
                        aBtn.eq(0).addClass('active');
                    }
                }
            })
        }
        var timer=null;
        var bFlag=false;
        //移入移出
        obj.hover(function(){
            clearInterval(timer);
        },function(){
            timer=setInterval(function(){
                move();
            },2000);
        });
        //按钮
        aBtn.each(function(index){
            aBtn.eq(index).click(function(){
                n=index-1;
                move();
            });
        });
        //自动播放  看不到停止动作
        $(window).scroll(
            function(){
                if(oUl.offset().top+oUl.height()<$(window).scrollTop()){
                    clearInterval(timer);
                    bFlag=false;
                }
                else{
                    if(bFlag){return}
                    bFlag=true;
                    timer=setInterval(function(){
                        move();
                    },2000);
                }
            }
        );
    });
};
//延迟加载
$.fn.picLoad=function(){
    this.each(function(){
        var obj=$(this);
        show();

        $(window).scroll(show).resize(show);
        function show(){
            var scrollTop=$(document).scrollTop();
            var clientHeight=$(window).height();
            var clientBottom=scrollTop+clientHeight;
                var top=obj.offset().top;
                if(clientBottom+20>top){
                    var _src=obj.attr('_src');
                    obj.attr('src', _src);
                }
        }
    })
};
//拖拽+碰撞运动
$.fn.dragHit=function(){
    this.each(function(){
        var obj=$(this);
        var iSpeedX=0;
        var iSpeedY=0;

        var lastX=0;
        var lastY=0;
        var timer=null;
        var down=false;

        pMove();
        function pMove(){
            clearInterval(timer);
            timer=setInterval(function(){
                iSpeedY+=3;
                var l=obj.offset().left+iSpeedX;
                var t=obj.offset().top+iSpeedY;

                if(t>$(window).height()+$(document).scrollTop()-obj.height()){
                    t=$(window).height()+$(document).scrollTop()-obj.height();
                    iSpeedY*=-0.8;
                    iSpeedX*=0.8;
                }
                if(l>=$(window).width()-obj.width()){
                    l=$(window).width()-obj.width();
                    iSpeedX*=-0.8;
                    iSpeedY*=0.8;
                }
                if(t<=0){
                    t=0;
                    iSpeedY*=-0.8;
                    iSpeedX*=0.8;
                }
                if(l<=0){
                    l=0;
                    iSpeedX*=-0.8;
                    iSpeedY*=0.8;
                }

                obj.css('left',l+'px');
                obj.css('top',t+'px');

                if(Math.abs(iSpeedX)<1)iSpeedX=0;
                if(Math.abs(iSpeedY)<1)iSpeedY=0;

                if(iSpeedX==0 && iSpeedY==0 && t==($(window).height()+$(document).scrollTop()-obj.height())){
                    clearInterval(obj.timer);
                    alert(1);
                    obj.css({position:'fixed',bottom:0,left:obj.offset().left+'px'})
                }
            },30);
        }
        //拖拽
        obj.mousedown(function (ev){
            var disX=ev.clientX-obj.offset().left;
            var disY=ev.clientY-obj.offset().top;
            clearInterval(timer);
            $(document).mousemove(move);
            $(document).mouseup(up);

            function move(ev)
            {
                var left=ev.clientX-disX;
                var top=ev.clientY-disY;

                obj.css({
                    left:left+'px',
                    top:top+'px'
                });
                iSpeedX=ev.clientX-lastX;
                iSpeedY=ev.clientY-lastY;

                lastX=ev.clientX;
                lastY=ev.clientY;
            }

            function up()
            {
                $(document).unbind('mousemove', move);
                $(document).unbind('mouseup', up);

                pMove();

                obj.releaseCapture && obj.releaseCapture();
            }

            obj.setCapture && obj.setCapture();
            return false;
        });
    })
};
//回到顶部
$.fn.goTop=function(target,time){
    var bFlag=false;
    var timer=null;
    this.each(function(){

        var obj=$(this);
        obj.click(function(){
            if(bFlag){
                return;
            }

            bFlag=true;
            var start=$(document).scrollTop();

            var dis=target-start;
            var n=0;
            var count=Math.floor(time/30);
            clearInterval(timer);
             timer=setInterval(function(){
                n++;
                var cur=start+dis*n/count;
                $(document).scrollTop(cur);
                if(n==count)
                {
                    clearInterval(timer);
                    bFlag=false;


                }

            },30)
        })
    })
};
$(function(){
    //延迟加载
    var aImg=$('img');
    aImg.picLoad();
    //头部弹性菜单
    (function($){
        var oUl=$('#navlist');
        var oMove=$('.move');
        var aLi=oUl.children();
        var iNow=0;
        for(var i=0;i<aLi.length-1;i++){
            aLi.eq(i).attr('index',i);
            aLi.eq(i).hover(function(){
                oMove.emove($(this).position().left);
            },function(){
                oMove.emove(iNow*aLi.eq(0).innerWidth());
            });
            aLi.eq(i).click(function(){
                iNow=$(this).attr('index');
            });
        }

    })(jQuery);
    //home轮播图
    (function($){
        var oBox=$('#bigbox');
        oBox.play();
    })(jQuery);
    //回到顶部 +拖拽碰撞
    (function($){

        var oTop=$('#gotop');
        var oBack=oTop.find('span');
        setTimeout(function(){
            if($(document).scrollTop()>=1400){
                oTop.css({top:($(document).scrollTop()-200)+'px'});
            }
            //oTop.show();
            oTop.stop().animate({
                opacity:1
            },300);
            oTop.css({left:1140+'px'});
            oTop.dragHit();
            oTop.hover(function(){
                oBack.show();
                oBack.goTop(0,100);
            },function(){
                oBack.hide();
            });
        },1500);

        $(window).scroll(function(){
            if($(document).scrollTop()==0){
                oTop.stop().animate({
                    opacity:0
                },300);
            }
            else if($(document).scrollTop()>=200){
                oTop.stop().animate({
                    opacity:1
                },150);
            }

        })
    })(jQuery);
    //导航滚动
    (function($){
        var oL=$('#navlist');
        var oTop=$('#gotop');
        var aLink=oL.children();
        var oHome=$('#home');
        var oAbout=$('#about');
        var oPro=$('#production');
        var oCon=$('#connect');
        aLink.eq(0).goTop(0,1000,oTop);
        aLink.eq(1).goTop(600,1000,oTop);
        aLink.eq(2).goTop(0,1000,oTop);
        aLink.eq(3).goTop(0,1000,oTop);
    })(jQuery);
    $(window).scroll(function(){
        console.log($(document).scrollTop());
    })
});