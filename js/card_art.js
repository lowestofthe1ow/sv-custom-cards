window.onload = function() {
  window.loadedImages = [];
  const images = [
    "img/generator/layout/textbox_follower/0.png",
    "img/generator/layout/textbox_follower/1.png",
    "img/generator/layout/textbox_follower/2.png",
    "img/generator/layout/textbox_follower/3.png",
    "img/ui/background_Track.png"
  ];
  for (var i = 0; i < images.length; i++) {
    loadedImages[i] = new Image;
    loadedImages[i].src = images[i];
  }
}

function generate() {
  var canvas = new fabric.StaticCanvas("cardTemplate", {
    width: 1920,
    height: 1120,
    backgroundImage: new fabric.Image(loadedImages[4]),
    // ...
  });
  drawTextBox(0, canvas);
  download(canvas.toDataURL('image/png', 1.0), "card", "image/png");
}

function drawTextBox(type, canvas) {
  var lineDrawPositionY;
  if (type == 0) {
    canvas.add(new fabric.Image(loadedImages[0], {top: 240, left: 753}));

    for (var i = 0; i < 4; i++) {
      canvas.add(new fabric.Image(loadedImages[1], {top: 394+(40*i), left: 753}));
      lineDrawPositionY = 394+(40*i);
    };

    canvas.add(new fabric.Image(loadedImages[2], {top: lineDrawPositionY+40, left: 753}));
    lineDrawPositionY += 197;

    for (var i = 0; i < 4; i++) {
      canvas.add(new fabric.Image(loadedImages[1], {top: lineDrawPositionY, left: 753}));
      lineDrawPositionY += 40;
    };

    canvas.add(new fabric.Image(loadedImages[3], {top: lineDrawPositionY, left: 753}));
  };
  canvas.requestRenderAll;
}
