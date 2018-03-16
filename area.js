"use strict";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
noise.seed(Math.floor(Math.random() * 1000));

var Area = {
	tiles: [],
	water: [],
	cover: [],
	height: 0,
	waterLevel: 0,
  
  	draw: function() {
  		if (this.height != 0) {
  			context.fillStyle = '#000000';
  		}
  		else {
  			for (var i = 0; i < canvas.height; i++) {
  				var background = context.createLinearGradient(0, 0, 0, canvas.height);
  				background.addColorStop(0,'#9090ff');
				  background.addColorStop(1,"white");
				  context.fillStyle = background;
			  }
  		}

  		context.fillRect(0, 0, canvas.width, canvas.height);

	  	for (var x = this.tiles.length - 1; x >= 0; x--) {
			  for (var z = this.tiles[0].length - 1; z >= 0; z--) {
			    if (this.tiles[x][z].top >= 0.25 && 
				      Camera.occlusionCull(this.tiles[x][z]) == false) {
				    this.drawTile(this.tiles[x][z]);
			    }
				  
				  if (this.water[x][z] != null && 
				      Camera.occlusionCull(this.water[x][z]) == false) {
				    this.drawWater(this.water[x][z]);
				  }
			  }
		  }
  	},
  
  	drawTile: function(_tile) {
  		var x = _tile.x;
  		var z = _tile.z;
  		var top = _tile.top;
  		var bottom = _tile.bottom;
  		var color = _tile.color;

  		context.globalAlpha = 1;

  		if (this.height != 0 && top == this.height) {
  			context.fillStyle = '#000000';
  		}
  		else if (this.cover[x][z] != null) {
  		  context.fillStyle = this.cover[x][z].color;
  		}
  		else {
  			context.fillStyle = color;
  		}
  		
  		context.beginPath();
  		context.moveTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  		context.lineTo(Camera.worldToCameraX(x + 0.5, z - 0.5), Camera.worldToCameraY(x + 0.5, top, z - 0.5));
  		context.lineTo(Camera.worldToCameraX(x + 0.5, z + 0.5), Camera.worldToCameraY(x + 0.5, top, z + 0.5));
  		context.lineTo(Camera.worldToCameraX(x - 0.5, z + 0.5), Camera.worldToCameraY(x - 0.5, top, z + 0.5));
  		context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  		context.closePath();
  		context.fill();
  
  		if (z == 0 || this.tiles[x][z-1].top < top) {
  			context.fillStyle = chroma(color).darken(2);
  			context.beginPath();
  			context.moveTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x + 0.5, z - 0.5), Camera.worldToCameraY(x + 0.5, bottom, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x + 0.5, z - 0.5), Camera.worldToCameraY(x + 0.5, top, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.closePath();
  			context.fill();
  		}
  
  		if (x == 0 || this.tiles[x-1][z].top < top) {
  			context.fillStyle = chroma(color).darken(1);
  			context.beginPath();
  			context.moveTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z + 0.5), Camera.worldToCameraY(x - 0.5, bottom, z + 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z + 0.5), Camera.worldToCameraY(x - 0.5, top, z + 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.closePath();
  			context.fill();
  		}
  	},

  	drawWater: function(_tile) {
  		var x = _tile.x;
  		var z = _tile.z;
  		var top = _tile.top;
  		var bottom = _tile.bottom;
  		var color = _tile.color;

  		context.globalAlpha = 0.85;

	  	context.fillStyle = color;
  		context.beginPath();
  		context.moveTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  		context.lineTo(Camera.worldToCameraX(x + 0.5, z - 0.5), Camera.worldToCameraY(x + 0.5, top, z - 0.5));
  		context.lineTo(Camera.worldToCameraX(x + 0.5, z + 0.5), Camera.worldToCameraY(x + 0.5, top, z + 0.5));
  		context.lineTo(Camera.worldToCameraX(x - 0.5, z + 0.5), Camera.worldToCameraY(x - 0.5, top, z + 0.5));
  		context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  		context.closePath();
  		context.fill();
  
  		if (z == 0 || this.tiles[x][z-1].top < 0.25) {
  			context.fillStyle = chroma(color).darken(2);
  			context.beginPath();
  			context.moveTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x + 0.5, z - 0.5), Camera.worldToCameraY(x + 0.5, bottom, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x + 0.5, z - 0.5), Camera.worldToCameraY(x + 0.5, top, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.closePath();
  			context.fill();
  		}
  
  		if (x == 0 || this.tiles[x-1][z].top < 0.25) {
  			context.fillStyle = chroma(color).darken(1);
  			context.beginPath();
  			context.moveTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z + 0.5), Camera.worldToCameraY(x - 0.5, bottom, z + 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z + 0.5), Camera.worldToCameraY(x - 0.5, top, z + 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, top, z - 0.5));
  			context.lineTo(Camera.worldToCameraX(x - 0.5, z - 0.5), Camera.worldToCameraY(x - 0.5, bottom, z - 0.5));
  			context.closePath();
  			context.fill();
  		}
  	},

  	generateTilemap: function(_width, _length, _allowEmpty) {
		var tempTiles = [];

		for (var x = 0; x < _width; x++) {
			var row = [];
			for (var z = 0; z < _length; z++) {
				var coarse = noise.perlin2(x / 10000, z / 10000) * 1000;
				var coarse = noise.perlin2(x / 1000, z / 1000) * 250;
				var fine = noise.perlin2(x / 10, z / 10) * 10;
				var top = (coarse + fine) - (coarse + fine) % 0.25;

				if (top <= 0.25) {
					if (this.height != 0) {
						top = this.height;
					}
					else if (_allowEmpty == false) {
						top = 0.25;
					}
				}
				if (this.height > 0 && top > this.height)
				{
					top = this.height;
				}

				row.push(new Tile(x, z, '#c08000', top, 0));
			}
			tempTiles.push(row);
		}
		this.tiles = tempTiles;
  	},

  	fillWater: function (_waterLevel) {
  		this.waterLevel = _waterLevel;

  		if (this.height != 0 && this.waterLevel > this.height)
  		{
  			this.waterLevel = this.height;
  		}

  		var tempWater = [];
  		for (var x = 0; x < this.tiles.length; x++){
  			var row = [];
			for (var z = 0; z < this.tiles[0].length; z++){
				if (this.tiles[x][z].top >= 0.25 && this.waterLevel > this.tiles[x][z].top) {
					row.push(new Tile(x, z, '#0000ff', this.waterLevel, this.tiles[x][z].top));
				}
				else {
					row.push(null);
				}
			}
			tempWater.push(row);
		}
		this.water = tempWater;
  	},

  	generateCover: function() {
		var tempCover = [];

		for (var x = 0; x < this.tiles.length; x++) {
			var row = [];
			for (var z = 0; z < this.tiles[0].length; z++) {
				var top = this.tiles[x][z].top;
				var height = (1 + noise.perlin2(x / 5, z / 5)) / 4;

				if (top > this.waterLevel + 0.25 && height > 0.2 && (this.height == 0 || top + height < this.height)) {
					if (height < 0.3) {
						row.push(new Tile(x, z, '#00a000', top + height, top));
					}
				}
				else {
					row.push(null);
				}
			}
			tempCover.push(row);
		}
		this.cover = tempCover;
  	}
};

function Tile(_x, _z, _color, _top, _bottom) {
   this.x = _x,
   this.z = _z,
   this.color = _color;
   this.top = _top;
   this.bottom = _bottom;
}