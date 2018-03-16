"use strict";

window.addEventListener('mouseup', function(event) { 
  Input.onMouseUp(event); 
}, false);

window.addEventListener('mousedown', function(event) {
  Input.onMouseDown(event); 
}, false);

window.addEventListener('mousemove', function(event) {
  Input.onMouseMove(event); 
}, false);

window.addEventListener("wheel", function(event) {
  Input.onMouseScroll(event); 
}, false);


var Input = {
  mouse: {
    left: 'up',
    right: 'up',
    wheel: 0,
    coordinates: {x: 0, y: 0}
  },

	onMouseDown: function(event) {
	  if (event.which === 1) {
	    if (this.mouse.left === 'up') {
	      this.mouse.left = 'clicked';
	    }
	    else {
	      this.mouse.left = 'held';
	    }
	  }
	  else if (event.which === 3) {
	    if (this.mouse.right === 'up') {
	      this.mouse.right = 'clicked';
	    }
	    else {
	      this.mouse.right = 'held';
	    }
	  }
	},

	onMouseUp: function(event) {
	  if (event.which === 1) {
	    this.mouse.left = 'up';
	  }
	  else if (event.which === 3) {
	    this.mouse.right = 'up';
	  }
	},
	
	onMouseMove: function(event) {
	  this.mouse.coordinates = {x: event.clientX, y: event.clientY};
	},
	
	onMouseScroll: function(event) {
	  this.mouse.wheel += event.deltaY;
	},
	
	update: function() {
	  this.mouse.wheel = 0;
	}
};