"use strict";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var fps = 30;
var frameDuration = 1000 / 30;
var lastUpdate = Date.now();

//Developing or Playing
var mode = Developing;

setInterval(function () 
{
	update();
	draw();
}, frameDuration);

function update() 
{
	canvas.width = window.innerWidth;
  	canvas.height = window.innerHeight;
  	
  	var delta = (Date.now() - lastUpdate) / frameDuration;
  	
  	mode.update(delta);
  	Input.update(delta);

  	lastUpdate = Date.now();
}

function draw() 
{
  	World.draw(context, chroma('#800'), chroma('#f80'));
	mode.draw(context);
}