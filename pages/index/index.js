//index.js
//获取应用实例
var app = getApp()
// 获取手指按下的坐标
var startX=0;
var startY=0;
// 手指移动
var moveX=0;
var moveY=0;
// 移动位置与开始位置的差值
var X=0;
var Y=0;
// 蛇头的坐标
var snakeHead={
  x:0,
  y:0,
  color:"#ff0000",
  w:20,
  h:20
}
// 身体对象
var snakeBodys=[];

// 食物对象
var foods=[];

// 窗口的尺寸
var windowWidth=0;
var windowHeight=0;

// 手指方向
var direction="";

// 用于判断是否删除
var collideBol=true;

// 蛇移动的方向
var snakeDirection="right";

Page({
  canvasStart:function(e){

    startX=e.touches[0].x;
    startY=e.touches[0].y;

  },
  canvasMove:function(e){

    moveX=e.touches[0].x;
    moveY=e.touches[0].y;
    X=moveX-startX;
    Y=moveY-startY;

    if(Math.abs(X)>Math.abs(Y)&&X>0){
      direction="right"
    }else if(Math.abs(X)>Math.abs(Y)&&X<0){
      direction="left"
    }else if(Math.abs(X)<Math.abs(Y)&&Y>0){
      direction="bottom"
    }else if(Math.abs(X)<Math.abs(Y)&&Y<0){
      direction="top"
    }
  },
  canvasEnd:function(){
    snakeDirection=direction;
  },
  onReady:function(){
    // 获取画布上下文
    var context=wx.createContext("snakeCanvas");
    var frameNum=0;

    function draw(obj){
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x,obj.y,obj.w,obj.h);
      context.closePath();
      context.fill();
    }

    // 碰撞函数
    function collide(obj1,obj2){
      var l1=obj1.x;
      var r1=l1+obj1.w;
      var t1=obj1.y;
      var b1=t1+obj1.h;

      var l2=obj2.x;
      var r2=l2+obj2.w;
      var t2=obj2.y;
      var b2=t2+obj2.h;

      if(r1>l2&&l1<r2&&b1>t2&&t1<b2){
        return true
      }else{
        return false
      }
    }
    
    function animate(){
      frameNum++;
      if(frameNum%20==0){

        // 每次向身体添加上一个位置数组对象
        snakeBodys.push({
          x:snakeHead.x,
          y:snakeHead.y,
          color:"#00ff55",
          w:20,
          h:20
        });

        switch(snakeDirection){
          case "left":
            snakeHead.x-=snakeHead.w;
            break;
          case "right":
            snakeHead.x+=snakeHead.w;
            break;
          case "bottom":
            snakeHead.y+=snakeHead.h;
            break;
          case "top":
            snakeHead.y-=snakeHead.h;
            break;
        }

        // 默认身体长度
        if(snakeBodys.length>4){
         if(collideBol){
            snakeBodys.shift();
         }else{
            collideBol=true
         }
        }
      }

      // 绘制蛇头
      draw(snakeHead);
      // 绘制蛇身
      for(var i=0;i<snakeBodys.length;i++){
        var snakeBody=snakeBodys[i];
        draw(snakeBody);
      }
      // 绘制食物
      for(var j=0;j<foods.length;j++){
        var foodObj=foods[j];
        draw(foodObj);

        if(collide(snakeHead,foodObj)){
          collideBol=false;
          foodObj.reset();
          console.log("撞上了")
        }

      }
      wx.drawCanvas({
        canvasId:"snakeCanvas",
        actions:context.getActions()
      })

      requestAnimationFrame(animate);
    }

    function rand(min,max){
      return parseInt(Math.random()*max+min)
    }

    // 构造食物对象
    function Food(){  
      this.x=rand(0,windowWidth);
      this.y=rand(0,windowHeight);
      var w=rand(10,20);
      this.w=w;
      this.h=w;
      this.color="rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
      this.reset=function(){
        this.x=rand(0,windowWidth);
        this.y=rand(0,windowHeight);
        this.color="rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
      }
    }

    // 获取窗口信息
    wx.getSystemInfo({
      success:function(res){
       windowWidth=res.windowWidth;
       windowHeight=res.windowHeight;

       for(var i=0;i<20;i++){
        var foodObj=new Food();
        foods.push(foodObj);
       }

       animate();
      }
    });
    
  }
})
