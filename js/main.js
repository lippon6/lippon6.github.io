
window.onload = function () {
    var keyCode = {"left": "37", "right": "39", "up": "38", "down": "40"};
    var keyBuf = {};
    var myHeight = 600, myWidth = 400;
    var globalInf = {
        times: 0,
        timeAdd: Math.PI/60,
        score: 0,
        tip: true,

        init: function(){
        	globalInf.times = 0;
       		globalInf.score = 0;
        	globalInf.tip = true;	
        },

        fill_tip: function(){
       		if(globalInf.tip == true){
                envir.font = "20pt Microsoft JhengHei";
       			envir.fillText("press!", myWidth/2 - 30, myHeight/2);
       		}	        	
        }
    };

    //玩家控制体
    var plane = {
        x: myWidth / 2,
        y: myHeight * 3/4,
        width:50,
        height:50,
        timeAdd: 0.05,
        score: 0,
        tip: true,
    };

    var plane = {
        x: myWidth / 2,
        y: myHeight * 3 / 4,
        width: 50,
        height: 50,
        speedX: 0,
        speedY: 0,
        speedMax: 150,
        accelerationX: 0,
        accelerationY: 0,
        accControl: 0.5,
        friction: 0.05,
        direction: false,

        draw: function(){
	        envir.translate(plane.x, plane.y);
	        var gradient3 = envir.createRadialGradient(0, 0, 10, 0, 0, 30);      
	      	gradient3.addColorStop(0, 'black');
	      	gradient3.addColorStop(1, 'white');
	      	envir.fillStyle = gradient3;
	        if(plane.speedX != 0){
	            envir.rotate(2 * Math.atan(plane.speedY/plane.speedX));
	            envir.fillRect(-plane.width/2, -plane.height/2, plane.width, plane.height);
	            envir.rotate(-2 * Math.atan(plane.speedY/plane.speedX));
	        }else{
	            envir.fillRect(-plane.width/2, -plane.height/2, plane.width, plane.height);
	        }
	        envir.translate(-plane.x, -plane.y);	        	
        },

        init: function(){
 			plane.accelerationX = 0;
	        plane.accelerationY = 0;
	        plane.speedY = 0;
	        plane.x = myWidth / 2;
	        plane.y = myHeight * 3/4;       	
        },

        move: function(){
            if(plane.direction){
                globalInf.times += globalInf.timeAdd;
            }else{
                globalInf.times -= globalInf.timeAdd;
            }

            if(globalInf.times > Math.PI){
                plane.direction = false;
                globalInf.times = Math.PI;
            }else if(globalInf.times < 0){
                plane.direction = true;
                globalInf.times = 0;
            }


        	plane.speedX = plane.speedMax * Math.cos(globalInf.times);
            plane.x = myWidth/2 - plane.speedX;

            plane.speedY += plane.accelerationY;
            plane.speedY *= (1 - plane.friction);
        },
    };

	//障碍物
    function obstacle(x, y, speedX, speedY, width, height, beginPos){
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = width;
        this.height = height;
        this.beginPos = beginPos;
    }


    var obstacle1 = new obstacle(
        0,
        0,
        0,
        1,
        150,
        30,
        -800
    );

    var obstacle2 = new obstacle(
        300,
        -500,
        0,
        1,
        150,
        30,
        -800
    );

	//排行榜
	var rankingList = {

		rowSpace:40,
		colSpace:230,
		nameSpace:170,
		scoreSpace:80,
		quantity:3,

		color:"green",

		head:["1st:", "2nd:" , "3rd:"],
		name:["lippon", "***", "***"],
		score:["999", "***", "***"],

		draw: function(){
			envir.fillStyle = rankingList.color;
			for(var i = 0; i < rankingList.quantity; i++)
			{
				envir.fillText(rankingList.head[i], myWidth - rankingList.colSpace, (i+1) * rankingList.rowSpace);
				envir.fillText(rankingList.name[i], myWidth - rankingList.nameSpace, (i+1) * rankingList.rowSpace);
				envir.fillText(rankingList.score[i], myWidth - rankingList.scoreSpace, (i+1) * rankingList.rowSpace);
			}
		}
	}

	function fill_obstacle(){
		envir.fillStyle = "green";	
        envir.fillRect(obstacle1.x, obstacle1.y, obstacle1.width, obstacle1.height);
        envir.fillRect(obstacle2.x, obstacle2.y, obstacle2.width, obstacle2.height);
        envir.fillText("score:", 30, 40);
        envir.fillText(globalInf.score, 120, 40);
	}

	function obstacle_init(){
		do{
			obstacle1.y = Math.random() * obstacle1.beginPos;
		    obstacle2.y = Math.random() * obstacle2.beginPos;			
		}
		while(Math.abs(obstacle1.y - obstacle2.y) <　100);
	}

	function obstacle_move(){
        obstacle1.speedY = plane.speedY;
        obstacle1.y += obstacle1.speedY; 

        obstacle2.speedY = plane.speedY;
        obstacle2.y += obstacle1.speedY; 

        if(obstacle1.y >myHeight){
        	do{
        		obstacle1.y = Math.random() * obstacle1.beginPos;
        	}
        	while(Math.abs(obstacle1.y - obstacle2.y) <　100);
            globalInf.score += 1;
        }
        if(obstacle2.y >myHeight){
            do{
        		obstacle2.y = Math.random() * obstacle1.beginPos;
        	}
        	while(Math.abs(obstacle1.y - obstacle2.y) <　100);
            globalInf.score += 1;
        }		
	}


	function fill_envir(){
        envir.clearRect(0, 0, myWidth, myHeight);
        envir.lineWidth = 5;
        envir.strokeRect(0, 0, myWidth, myHeight);
        	
	}

    function game_init(){
        delete keyBuf[keyCode.up];
        plane.init();
        globalInf.init();
        obstacle_init();

    }

    function game_over(){
       	window.alert("game over!\n 你的得分：" + String(globalInf.score) + "\n低于" + String((1000 - globalInf.score)/10-1) + "%的人");
   		game_init();
    }

    function update(){
        (function sys_init(){
            plane.accelerationX = 0;
            plane.accelerationY = 0;
        }());

        (function event_trigger(){
            if(keyBuf[keyCode.left]){
                plane.accelerationX = plane.accControl;
            }
            if(keyBuf[keyCode.right]){
                plane.accelerationX = -plane.accControl;
            }
            if(keyBuf[keyCode.up]){

                plane.accelerationY = plane.accControl*(1 + 0.1*globalInf.score);
            }
            if(keyBuf[keyCode.down]){
                plane.accelerationY = -plane.accControl;
            }
        }());

        (function step(){
            plane.move();
            obstacle_move();
        }());

        (function hit_check(){
            if((plane.x-obstacle1.x) < (obstacle1.width +　plane.width/2)){
                if((obstacle1.y-plane.y) < 0 && (plane.y-obstacle1.y) < (obstacle1.height + plane.height/2)){
                    game_over();
                }else if((obstacle1.y-plane.y) > 0 && (obstacle1.y-plane.y) < (plane.height/2)){
                    game_over();
                }
            }

            if((obstacle2.x-plane.x) < 0 && (plane.x-obstacle2.x) < (obstacle2.width +　plane.width/2)){
                if((obstacle2.y-plane.y) < 0 && (plane.y-obstacle2.y) < (obstacle2.height + plane.height/2)){
                    game_over();
                }else if((obstacle2.y-plane.y) > 0 && (obstacle2.y-plane.y) < (plane.height/2)){
                    game_over();
                }
            }
        }());
    };
    
    var c=document.getElementById("myCanvas");

    document.getElementById("myCanvas").addEventListener("mousedown",function(){
        keyBuf[keyCode.up] = true;
        globalInf.tip = false;
    });

    document.getElementById("myCanvas").addEventListener("mouseup",function(){
        keyBuf[keyCode.up] = false;
    });

    document.getElementById("myCanvas").addEventListener("touchstart",function(){
        keyBuf[keyCode.up] = true;
        globalInf.tip = false;
    });

    document.getElementById("myCanvas").addEventListener("touchend",function(){
        keyBuf[keyCode.up] = false;
    });


    addEventListener("keydown", function(e){
        keyBuf[e.keyCode] = true;
        globalInf.tip = false;
    },false);
    addEventListener("keyup", function(e){
        delete keyBuf[e.keyCode];
    },false);

    var myCanvas = window.document.getElementById("myCanvas");
    myCanvas.setAttribute("width", myWidth);
    myCanvas.setAttribute("height", myHeight);
    var envir = myCanvas.getContext("2d");

    (function draw(){
        (function draw_init(){
        	update();
        	requestAnimationFrame(draw);
        	fill_envir();
        	fill_obstacle();
        	plane.draw();
            rankingList.draw();
            globalInf.fill_tip();
        }());
    }());
}