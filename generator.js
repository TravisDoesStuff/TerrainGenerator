const DIMENSIONS = 99;

var seaLevel = 100;
var sandLevel = seaLevel+10;
const GREEN_LEVEL = 170;
const MOUNTAIN_LEVEL = 220;
const ICE_LEVEL = 256;

var bigMap = [];
var cood = [];

initialize(0,DIMENSIONS-1);
draw();


function generateTerrain() {
	clear();
	initialize();
	draw();
}

function clear() {
	for(var i=0; i<DIMENSIONS; i++){
		cood[i] = [];
		for(var j=0; j<DIMENSIONS; j++){
			cood[i][j] = -1;
		}
	}
}

function initialize(topLeft, bottomRight) {
	// set all cood to 0
	for(var i=0; i<DIMENSIONS; i++){
		cood[i] = [];
		for(var j=0; j<DIMENSIONS; j++){
			cood[i][j] = 0;
		}
	}

	let minX = minY = topLeft;
	let maxX = maxY = bottomRight;
	cood[minX][minY] = Math.floor(Math.random()*256); //top left
	cood[minX][maxY] = Math.floor(Math.random()*256); //bottom left
	cood[maxX][minY] = Math.floor(Math.random()*256); //top right
	cood[maxX][maxY] = Math.floor(Math.random()*256); //bottom right

	generate(minX,maxX,minY,maxY);
	bigMap.push(cood);
}

function generate(minX,maxX,minY,maxY) {
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

function diamond(lead, tail, middle) {
	var zAvg = Math.round((lead + tail + middle) / 3);

	var maximum = Math.max(lead,tail,middle);
	var minimum = Math.min(lead,tail,middle);
	var zRange = Math.abs(maximum-minimum);

	var deviation = Math.round(Math.random()*zRange);

	return Math.round(zAvg + (deviation - (zRange/2)));
}

function draw(showColor=true) {
  var map = document.getElementById('map01');
  var ctx = map.getContext("2d");

	ctx.clearRect(0, 0, map.width, map.height);

	for(var x=0; x<cood.length; x++){
		for(var y=0; y<cood.length; y++){
			var height = cood[x][y];
			
			let r = height;
			let g = height;
			let b = height;

			if(showColor) {
				if(height <= seaLevel) {
					r = 0;
					g = 50 + height;
					b = 80 + height;
				} else if(height > seaLevel && height <= sandLevel) {
					r = 130 + height;
					g = 100 + height;
					b = 30 + height;
				} else if(height > sandLevel && height <= GREEN_LEVEL) {
					r = height*1.2 - 100;
					g = height*1.2-30;
					b = height-50;
				} else if(height > GREEN_LEVEL && height <= MOUNTAIN_LEVEL) {
					r = height-100;
					g = height-120;
					b = height-130;
				}
			}

			color= "rgb("+r+","+g+","+b+")";

			if(cood[x][y] != 0){
				ctx.beginPath();
				ctx.fillRect(x,y,1,1);
				ctx.fillStyle=color;
				ctx.stroke();
			}
		}
  }
}

function toggleColor() {
	let isColor = document.getElementById('showColor').checked;
	draw(isColor);
}

function updateWaterLevel(waterLevel) {
	document.getElementById('seaLevelValue').innerHTML = waterLevel;
}

function globalWarming(waterLevel) {
	seaLevel = waterLevel;
	draw();
}
