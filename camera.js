"use strict";

var Camera = {
	x: 0,
	z: 0,
	angle: -Math.PI / 4,
	scale: 50,

	worldToCameraX: function (_x, _z) {
		var origin = canvas.width / 2;
		return origin + ((_z - this.z) - (_x - this.x)) * this.scale;
	},

	worldToCameraY: function (_x, _y, _z) {
		var origin = canvas.height / 2;
		return origin - (_x - this.x + _z - this.z) * -Math.sin(this.angle) * this.scale + (_y - Area.tiles[this.x][this.z].top) * -Math.sin(Math.PI / 2 - this.angle) * this.scale;
	},
	
	occlusionCull: function (_tile) {
	  var x = this.worldToCameraX(_tile.x, _tile.z);
	  var topY = this.worldToCameraY(_tile.x, _tile.top, _tile.z);
	  var bottomY = this.worldToCameraY(_tile.x, _tile.bottom, _tile.z);
	  
	  if (x > -this.scale && x < canvas.width + this.scale &&
			 ((topY > -this.scale && topY < canvas.height + this.scale) || (bottomY > -this.scale && bottomY < canvas.height + this.scale))) {
			return false;
		}
		else {
		  return true;
		}
	},

	shiftUp: function(_amount) {
		if (this.x < Area.tiles.length - 1) {
			this.x += _amount;
		}
		if (this.z < Area.tiles[0].length - 1) {
			this.z += _amount;		
		}
	},

	shiftLeft: function(_amount) {
		if (this.x < Area.tiles.length - 1) {
			this.x += _amount;
		}
		if (this.z > 0) {
			this.z -= _amount;
		}
	},

	shiftDown: function(_amount) {
		if (this.x > 0) {
			this.x -= _amount;
		}
		if (this.z > 0) {
			this.z -= _amount;
		}
	},

	shiftRight: function(_amount) {
		if (this.x > 0) {
			this.x -= _amount;
		}
		if (this.z < Area.tiles[0].length - 1) {
			this.z += _amount;
		}
	},

	tilt: function(_amount) {
		this.angle += _amount / 100;

		if (this.angle < -Math.PI / 2)
		{
			this.angle = -Math.PI / 2;
		}
		else if (this.angle > 0)
		{
			this.angle = 0;
		}
	}
};