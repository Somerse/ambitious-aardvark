var Playing = {
  update: new function() {
    World.update();
  },
  draw: new function(ctx, terrainColor, atmosphereColor) {
    World.draw(ctx, terrainColor, atmosphereColor);
  }
}