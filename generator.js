const DIMENSIONS = 500;

var cood = [];
for(var i=0; i<DIMENSIONS; i++){
  cood[i] = [];
  for(var j=0; j<DIMENSIONS; j++){
    cood[i][j] = 0;
  }
}

initialize();
draw();

function initialize(){
	var minX = minY = 0;
	var maxX = maxY = DIMENSIONS-1;
	cood[minX][minY] = Math.floor(Math.random()*256);
	cood[minX][maxY] = Math.floor(Math.random()*256);
	cood[maxX][minY] = Math.floor(Math.random()*256);
	cood[maxX][maxY] = Math.floor(Math.random()*256);

	generate(minX,maxX,minY,maxY);
}

function generate(minX,maxX,minY,maxY){
	var midX = Math.floor((maxX+minX) / 2);
	var midY = Math.floor((maxY+minY) / 2);

	if(minX==midX && minY==midY) return;

	// Square
	var zAvg = Math.round((cood[minX][minY] + cood[minX][maxY] + cood[maxX][minY] + cood[maxX][maxY]) / 4);

	var maximum = Math.max(cood[minX][minY], cood[minX][maxY], cood[maxX][minY], cood[maxX][maxY]);
	var minimum = Math.min(cood[minX][minY], cood[minX][maxY], cood[maxX][minY], cood[maxX][maxY]);
	var zRange = Math.abs(maximum-minimum);

	var deviation = Math.round(Math.random()*zRange);

	cood[midX][midY] = Math.round(zAvg + (deviation - (zRange/2)));

	// Diamond
	if(cood[midX][minY]==0){
		cood[midX][minY] = diamond(cood[minX][minY], cood[maxX][minY], cood[midX][midY]); //north
	}
	if(cood[maxX][midY]==0){
		cood[maxX][midY] = diamond(cood[maxX][minY], cood[maxX][maxY], cood[midX][midY]); //east
	}
	if(cood[midX][maxY]==0){
		cood[midX][maxY] = diamond(cood[maxX][maxY], cood[minX][maxY], cood[midX][midY]); //south
	}
	if(cood[minX][midY]==0){
		cood[minX][midY] = diamond(cood[minX][maxY], cood[minX][minY], cood[midX][midY]); //west
	}

	generate(minX,midX,minY,midY);
	generate(midX,maxX,minY,midY);
	generate(minX,midX,midY,maxY);
	generate(midX,maxX,midY,maxY);
}

function diamond(lead, tail, middle){
	var zAvg = Math.round((lead + tail + middle) / 3);

	var maximum = Math.max(lead,tail,middle);
	var minimum = Math.min(lead,tail,middle);
	var zRange = Math.abs(maximum-minimum);

	var deviation = Math.round(Math.random()*zRange);

	return Math.round(zAvg + (deviation - (zRange/2)));
}

function draw(){
    var map = document.getElementById('map');
    var ctx = map.getContext("2d");

    for(var x=0; x<cood.length; x++){
        for(var y=0; y<cood.length; y++){
            var height = cood[x][y];

            var color = "rgb("+height+","+height+","+height+")";
            if(height <= 100) { // water
                let r = 0;
                let g = 50 + height;
                let b = 80 + height;
                color= "rgb("+r+","+g+","+b+")";
            } else if(height > 100 && height <= 110) { // sand
                let r = 130 + height;
                let g = 100 + height;
                let b = 30 + height;
                color= "rgb("+r+","+g+","+b+")";
            } else if(height > 110 && height <= 170) { // forest
                let r = 256 - height*1.5;
                let g = 256 - height;
                let b = 256 - height*1.5;
                color= "rgb("+r+","+g+","+b+")";
            } else if(height > 170 && height <= 220) { // mountain
                let r = height-100;
                let g = height-120;
                let b = height-130;
                color= "rgb("+r+","+g+","+b+")";
            }

            if(cood[x][y] != 0){
                ctx.beginPath();
                ctx.fillRect(x,y,1,1);
                ctx.fillStyle=color;
                ctx.stroke();
            }
        }
    }
}
