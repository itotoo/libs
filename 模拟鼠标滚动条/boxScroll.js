
"use strict";

//function Obj(o){
//    function F(){};
//    F.prototype = o;
//    return new F();
//}
//var a = Obj(obj);
//a.run =function (){}

//...首先要了解这个对象
//...绑定事件
//...方法：滚动，拖放，点击
var Scroll = function (id){
    this.obj = document.getElementById(id);
    this.scrollMoveObj = null;//...状态
    this.init();
}

Scroll.prototype = {
    constructer : Scroll,
    init : function (){
        //...绑定事件
        var that = this;
        var box = this.obj;//...这个this 有严重的指向问题，所以为了唯一指向性（所以一开始就指向box）

        that.addEvent(this.obj,'mousewheel',function (event){
            that.scrollMove.call(box,event,that);
        })
        that.addEvent(this.obj,'DOMMouseScroll',function (event){
            that.scrollMove.call(box,event,that);
        })
        var scroll_bar = document.getElementById('scroll_bar');
        that.addEvent(scroll_bar,'mousedown',function (event){
            that.onmousedown.call(box,event,that);
        })



    },
    //...跨浏览器添加事件
    addEvent : function (obj,type,fn){
        if (obj.addEventListener)//W3C
        {
            obj.addEventListener(type,fn,false);
        }
        else if (obj.attachEvent)//IE
        {
            obj.attachEvent('on'+type,fn);
        }
    },
    //...鼠标滚动值
    wheelDelta : function (evt){
        var e = evt||window.event;
        if(e.wheelDelta){//ie
            return e.wheelDelta/120;
        }else if(e.detail){//ff
            return -e.detail*40/120;
        };
    },
    //阻止默认行为兼容IE和W3C
    preventDefault : function (evt){
        var e = evt||window.event;
        if (e.preventDefault)
        {
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
    },
    //...鼠标滚动
    scrollMove : function (event,that){
        //console.log(this)//...这个this是当前box,ie8 指向window（所以一开始就指向box）
        //alert(that)//...
        if(  this.clientHeight >= this.scrollHeight) {return true};
        var event= event || window.event;

        //...不用说也要阻止默认事件
        that.preventDefault(event);
        var step = 5;//...滚动偏移量
        if(that.wheelDelta(event)< 0) {//...判断向上或向下
            if(this.scrollTop >= (this.scrollHeight - this.clientHeight)) return true;
            this.scrollTop += step;
        } else {
            if(this.scrollTop == 0) return true;
            this.scrollTop -= step;
        }

        that.setScrollPosition(this);//...

        return false;
    },
    //...鼠标点击
    onmousedown : function(event,that){
        var event= event || window.event;
        var scrollClientY = event.clientY;
        var scrollTop = that.obj.scrollTop;
        that.scrollMoveObj = true;
        document.body.onselectstart = function(){return false};//...禁止选择文本
        //...进一步绑定事件
        document.onmousemove=function(event){
            that.onmousemove(event,that,scrollClientY,scrollTop)
        }
        document.onmouseup=function(){
            that.onmouseup(event,that)
        }
        return false;
    },
    // 鼠标移动
    onmousemove : function(event,that,scrollClientY,scrollTop){

        if(!that.scrollMoveObj)return;//...true代表滚动
        var event= event || window.event;

        //...这是个比例倍数
        var per = (that.obj.scrollHeight - that.obj.clientHeight) / (that.obj.clientHeight - 20)
        //...这是坐标偏移量
        that.obj.scrollTop = scrollTop - (scrollClientY - event.clientY) * per;
        that.setScrollPosition(that.obj);//...设置滚动条的位置

    },
    // 鼠标抬起
    onmouseup : function(event,that){
        //...还原一切
        document.onmousemove = null;
        document.onmouseup = null;
        document.body.onselectstart = function(){return true};
    },
    //...设置滚动条的位置
    setScrollPosition : function  (o) {
        var obj = document.getElementById("scroll_bar");
        obj.style.top = (o.clientHeight - 20) * o.scrollTop / (o.scrollHeight - o.clientHeight) + 'px';
    }
}





var scr = new Scroll("box");














































