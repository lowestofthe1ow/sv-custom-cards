function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
        // get num of sources
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}

function generate() {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  var sources = {
    textbox: 'img/generator/layout/textbox_follower.png',
    border: 'img/generator/layout/border.png'
  };
  loadImages(sources, function download(images) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1920, 1120);
    ctx.drawImage(images.textbox, 0, 0);
    ctx.drawImage(images.border, 0, 0);
    download(canvas.toDataURL('image/png', 1.0), "card", "image/png");
  });
}
