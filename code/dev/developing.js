var Developing = {
  activeTool: Tools.drawTerrain,
  activeLayer: World.foreground,
  menu: false,
  menuLayout: [
    {name: 'Edit Terrain'},
    {name: 'Edit Backdrop'},
    {name: 'Place Object'},
    {name: 'Switch Layers'},
    {name: 'Options', children: [
      {name: 'Nested 1'},
      {name: 'Nested 2'},
      {name: 'Nested 3'},
    ]},
  ],
  
  update: function(delta) {
    if (Input.mouse.right === 'clicked') {
      this.menu = new Menu(Input.mouse.coordinates, this.menuLayout);
    }
    else if (Input.mouse.right === 'up') {
      if (this.menu !== false) {
        this.menu = false;
      }
    }
    
    if (this.menu !== false) {
      this.menu.update(delta);
    }
  },

  draw: function(ctx) {
    if (this.menu !== false) {
      this.menu.draw(ctx);
    }
  }
}