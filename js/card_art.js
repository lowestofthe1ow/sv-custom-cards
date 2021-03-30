window.onload = function() {
  window.loadedImages = [];
  const images = [
    "img/generator/layout/textbox_follower/0.png",
    "img/generator/layout/textbox_follower/1.png",
    "img/generator/layout/textbox_follower/2.png",
    "img/generator/layout/textbox_follower/3.png",
    "img/generator/layout/border.png",
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
    backgroundColor: "#000000",
    backgroundImage: new fabric.Image(loadedImages[5], {opacity: 0.4}),
  });
  var name = document.getElementById("form_name").value
  var text1 = document.getElementById("form_text1").value
  var text2 = document.getElementById("form_text2").value
  drawTextBox(0, 5, 5, canvas);
  drawText(name, text1, text2, canvas);
  download(canvas.toDataURL('image/png', 1.0), "card", "image/png");
}

function drawText(name, text1, text2, canvas) {
  canvas.add(new fabric.Text(name, {top: 113, left: 133, fontFamily: "Seagull", fontSize: 60, fill: "#FFFDEE"}));
  canvas.add(new fabric.Text(text1, {top: 357, left: 804, fontFamily: "Seagull", fontSize: 30, lineHeight: 1.18, fill: "#FFFDEE"}));
  canvas.add(new fabric.Text(text2, {top: 674, left: 804, fontFamily: "Seagull", fontSize: 30, lineHeight: 1.18, fill: "#FFFDEE"}));
}

function drawTextBox(type, lines1, lines2, canvas) {
  var lineDrawPositionY;
  if (type == 0) {
    canvas.add(new fabric.Image(loadedImages[0], {top: 240, left: 753}));
    canvas.add(new fabric.Image(loadedImages[4], {top: 0, left: 0}));
    for (var i = 0; i < lines1-1; i++) {
      canvas.add(new fabric.Image(loadedImages[1], {top: 394+(40*i), left: 753}));
      lineDrawPositionY = 394+(40*i);
    };
    canvas.add(new fabric.Image(loadedImages[2], {top: lineDrawPositionY+40, left: 753}));
    lineDrawPositionY += 197;
    for (var i = 0; i < lines2-1; i++) {
      canvas.add(new fabric.Image(loadedImages[1], {top: lineDrawPositionY, left: 753}));
      lineDrawPositionY += 40;
    };
    canvas.add(new fabric.Image(loadedImages[3], {top: lineDrawPositionY, left: 753}));
  };
  canvas.requestRenderAll;
}
