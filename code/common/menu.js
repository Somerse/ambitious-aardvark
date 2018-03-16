function Ring(point, width, index, elements) {
  this.center = point;
  this.width = width;
  this.index = index;
  this.elements = elements;
  this.startAngle = (Math.PI / 2) / this.elements.length;
  this.mouse = {angle: 0, radius: 0};
  this.inertia = 0;
  this.opacityModifier = 0;
  
  this.update = function(mouse) {
    this.mouse = mouse;
    
    if (this.opacityModifier < 1) {
      this.opacityModifier += 0.1;
    }
    
    if (Input.mouse.wheel !== 0) {
      this.inertia += Input.mouse.wheel / 10;
    }
    
    if (this.inertia !== 0) {
      this.startAngle += this.inertia;
      this.inertia = this.inertia * 0.9;
      
      if (this.inertia > 10 || this.inertia < -10) {
        this.inertia = 0;
      }
    }
  };
  this.draw = function(ctx) {
    var innerRadius = this.width * (this.index + 1);
    var outerRadius = innerRadius + this.width;
    
    for (i = 0; i < this.elements.length; i++) {
      var angle = this.startAngle + i * (Math.PI / (this.elements.length / 2)); 
      
      if (this.mouse.angle >= angle && this.mouse.angle < angle + Math.PI / (this.elements.length / 2) && this.mouse.radius < outerRadius && this.mouse.radius >= innerRadius) {
        ctx.fillStyle='rgba(50, 50, 50, 0.6)';
        
        if (Object.keys(this.elements[i]).includes('children')) {
          //rings.push(new Ring(this.center, this.width, this.index + 1, element.children));
        }
      }
      else {
        ctx.fillStyle='rgba(50, 50, 50,' + 0.5 * this.opacityModifier + ')';
      }
      
      ctx.translate(this.center.x, this.center.y);
      ctx.beginPath();
      ctx.arc(0, 0, outerRadius, angle, angle + Math.PI / (this.elements.length / 2), false);
      ctx.arc(0, 0, innerRadius + 5, angle + Math.PI / (this.elements.length / 2), angle, true);
      ctx.fill();
      ctx.translate(-this.center.x, -this.center.y);
      
      ctx.font = (this.width / 4) + "px Arial";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle="rgba(50, 50, 50, 0.7 * this.OpacityModifier)";
      
      var textRadius = innerRadius + this.width / 2;
      var textAngle = ctx.measureText(this.elements[i].name).width / textRadius;
      var textAngleCenter = angle + Math.PI / this.elements.length;
      var textAngleStart = textAngleCenter - textAngle / 2;
      var charAngle = textAngleStart;
      
      for (var j = 0; j < this.elements[i].name.length; j++) {
        charAngle += (ctx.measureText(this.elements[i].name[j]).width) / 2 / textRadius;
        
        var charX = this.center.x + textRadius * Math.cos(charAngle);
        var charY = this.center.y + textRadius * Math.sin(charAngle);
        
        ctx.translate(charX, charY);
        ctx.rotate(charAngle + Math.PI / 2);
        ctx.fillText(this.elements[i].name[j], 0, 0);
        ctx.rotate(-charAngle - Math.PI / 2);
        ctx.translate(-charX, -charY);
        
        charAngle += (ctx.measureText(this.elements[i].name[j]).width) / 2 / textRadius;
      }
    }
  };
}


function Menu(point, elements) {
  this.center = point;
  this.ring = new Ring(this.center, 75, 0, elements);
  
  this.update = function() {
    var coordinates = Input.mouse.coordinates;
    var mouse = {
      angle: (-Math.atan2(coordinates.x - this.center.x, coordinates.y - this.center.y) + Math.PI * 2.5) % (Math.PI * 2),
      radius: Math.sqrt(Math.pow(coordinates.x - this.center.x, 2) + Math.pow(coordinates.y - this.center.y, 2))
    };
  
    this.ring.update(mouse);
  };
  
  this.draw = function(ctx) {
    this.ring.draw(ctx);
  };
}