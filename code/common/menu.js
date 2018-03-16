function RingSegment(name, center, inside, length, width, index){
  this.name = name;
  this.center = center;
  this.length = length;
  this.width = width;
  this.index = index;

  this.start = this.index * this.length;
  this.inside = inside;
  this.rotatedStart = this.start;
  this.selected = false;

  this.update = function(radialMouse, rotation, delta) {
    this.rotatedStart = this.start + rotation;
    this.selected = false;

    if (radialMouse.angle >= this.start && radialMouse.angle < this.start + this.length && 
        radialMouse.radius >= this.inside && radialMouse.radius < this.inside + this.width) {
      this.selected = true;
    }
  }

  this.draw = function(ctx) {
    var opacityModifier = 0.8;

    if (this.selected) {
      opacityModifier = 1;
    }

    this.drawBackground(opacityModifier, ctx);
    this.drawText(opacityModifier, ctx);
  }

  this.drawBackground = function(opacityModifier, ctx) {
    ctx.fillStyle='rgba(0, 0, 0,' + 0.8 * opacityModifier + ')';
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.start + this.width, this.rotatedStart, this.rotatedStart + this.length, false);
    ctx.arc(this.center.x, this.center.y, this.inside * 1.05, this.rotatedStart + this.length, this.rotatedStart, true);
    ctx.fill(); 
  }

  this.drawText = function(opacityModifier, ctx) {
    ctx.fillStyle='rgba(0, 0, 0,' + opacityModifier + ')';
    
    ctx.font = (this.width / 4) + "px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    var textRadius = this.inside + this.width / 2;
    var textAngle = ctx.measureText(this.name).width / textRadius;
    var textAngleCenter = this.rotatedStart + this.length / 2;
    var textAngleStart = textAngleCenter - textAngle / 2;
    
    var charAngle = textAngleStart;
    
    for (var i = 0; i < this.name.length; i++) {
      charAngle += (ctx.measureText(this.name[i]).width) / 2 / textRadius;
      
      var charX = this.center.x + textRadius * Math.cos(charAngle);
      var charY = this.center.y + textRadius * Math.sin(charAngle);
      
      ctx.translate(charX, charY);
      ctx.rotate(charAngle + Math.PI / 2);
      ctx.fillText(this.name[i], 0, 0);
      ctx.rotate(-charAngle - Math.PI / 2);
      ctx.translate(-charX, -charY);
      
      charAngle += (ctx.measureText(this.name[i]).width) / 2 / textRadius;
    }
  }
}


function Ring(center, width, index, elements) {
  this.center = center;
  this.width = width;
  this.index = index;

  this.inside = this.width * (this.index + 1);
  this.rotation = Math.PI / (elements.length / 2);
  this.inertia = 0;
  this.ringSegments = [];

  for (var i = 0; i < elements.length; i++) {
    this.ringSegments.push(
      new RingSegment(
        elements[i].name,
        center,
        this.width * (this.index + 1),
        width, 
        (Math.PI * 2) / elements.length, 
        i
      )
    );
  }
  
  this.update = function(radialMouse, delta) {
    this.checkForScroll(0.75, 0.02);

    for (i = 0; i < this.ringSegments.length; i++) {
      this.ringSegments[i].update(delta);
    }
  };

  this.draw = function(ctx) {
    for (i = 0; i < this.ringSegments.length; i++) {
      this.ringSegments[i].draw(ctx);
    }
  };

  this.checkForScroll = function(bounds, friction) {
    //This handles scrolling if the pointer is over this ring
    //*May make this its own function
    if (Input.mouse.wheel !== 0) {
      this.inertia += (Input.mouse.wheel / 125) * (Math.PI / (this.elements.length / 2));

      if (this.inertia > bounds) {
        this.inertia = bounds;
      }
      else if (this.inertia < -bounds) {
        this.inertia = -bounds;
      }
    }

    if (this.inertia !== 0) {
      this.rotation += this.inertia;

      if (this.inertia > friction) {
        this.inertia = this.inertia - friction;
      }
      else if (this.inertia < -friction) {
        this.inertia = this.inertia + friction;
      }
      else {
        this.inertia = 0;
      }
    }
  }
}


function Menu(center, elements) {
  this.center = center;
  this.elements = elements;
  this.ring = new Ring(this.center, 75, 0, elements);
  
  this.update = function(delta) {
    var coordinates = Input.mouse.coordinates;
    var radius = Math.sqrt(Math.pow(coordinates.x - this.center.x, 2) + Math.pow(coordinates.y - this.center.y, 2));
    var angle = (Math.atan2((coordinates.y - this.center.y), (coordinates.x - this.center.x)) + Math.PI / this.elements.length) % (Math.PI * 2);
    
    var radialMouse = {angle: angle, radius: radius};

    this.ring.update(delta, radialMouse);
  };
  
  this.draw = function(ctx) {
    this.ring.draw(ctx);
  };
}