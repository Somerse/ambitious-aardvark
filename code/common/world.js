var World = {
  foreground: new Layer(),
  background: new Layer(),
  
  update: function() {
    this.background.update();
    this.foreground.update();
  },
  
  draw: function(ctx, terrainColor, atmosphereColor) {
    ctx.beginPath();
    var gradient = context.createLinearGradient(0, window.innerHeight, 0, 0)
    gradient.addColorStop(0, terrainColor);
    gradient.addColorStop(1, atmosphereColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    this.background.draw(context, chroma.mix('#000', terrainColor, 0.5));
    this.foreground.draw(context, chroma('#000'));
  }
}