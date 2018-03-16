"use strict";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var fps = 30;

//Developing or Playing
var mode = Developing;

setInterval(function () 
{
	update();
	draw();
}, 1000 / fps);

function update() 
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mode.update();
  Input.update();
}

function draw() 
{
  World.draw(context, chroma('#800'), chroma('#f80'));
	mode.draw(context);
}