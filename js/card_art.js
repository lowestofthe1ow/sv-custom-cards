window.onload = function() {
  // Load images
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
    document.getElementById("imageloader").appendChild(loadedImages[i]);
  }
}

function generate() {
  // Input fields
  var name = document.getElementById("form_name").value;
  var text1 = document.getElementById("form_text1").value;
  var text2 = document.getElementById("form_text2").value;
  var backgroundImage = new fabric.Image(loadedImages[5], {opacity: 0.4})

  // Number of text lines (Followers only)
  var lines1 = getLines(text1) < 5 ? 5 : getLines(text1);
  var lines2 = getLines(text2) < (10 - lines1) ? 10 - lines1 : getLines(text2);
  if (lines2 > 5 && getLines(text1) < 5) {
    lines1 = getLines(text1);
  };

  // Create canvas
  var canvas = new fabric.StaticCanvas("cardTemplate", {
    backgroundColor: "#000000",
  });

  // Set canvas height
  canvas.setHeight(getHeight(lines1 + lines2));

  // Disable background image if canvas is expanded
  if (lines1+lines2 <= 12) {
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas))
  }

  // Draw text box and card text (Followers only)
  drawTextBox(0, lines1, lines2, canvas);
  drawText(name, text1, text2, lines1, canvas);

  // Download image
  download(canvas.toDataURL('image/png', 1.0), "card", "image/png");
}

// Get canvas height to account for text lines
function getHeight(sum) {
  if (sum > 12) {
    return 1120 + (40*(sum-12));
  } else {
    return 1120;
  }
}

// Get number of text lines
function getLines(text) {
  var textbox = new fabric.Textbox(text, {
    width: 911,
    fontFamily: "Seagull",
    fontSize: 30,
    fill: "#FFFDEE"
  });
  return textbox._textLines.length;
}

// Draw text on canvas
// Name - User-inputted name
// Text1 - Amulet, Spell, or Unevolved Follower text
// Text2 - Evolved Follower text, blank string if Spell or Amulet
// LinesSpacing - Number of Text1 line spaces for Text2 to account for
// Canvas - Fabric.js canvas object
function drawText(name, text1, text2, linesSpacing, canvas) {
  canvas.add(new fabric.Text(name, {top: 113, left: 133, fontFamily: "Seagull", fontSize: 60, fill: "#FFFDEE"}));
  canvas.add(new fabric.Textbox(text1, {
    top: 357,
    left: 804,
    width: 911,
    fontFamily: "Seagull",
    fontSize: 30,
    lineHeight: 1.18,
    fill: "#FFFDEE"
  }));
  canvas.add(new fabric.Textbox(text2, {
    top: 474+(40*linesSpacing),
    left: 804,
    width: 911,
    fontFamily: "Seagull",
    fontSize: 30,
    lineHeight: 1.18,
    fill: "#FFFDEE"
  }));
}

// Draw text box on canvas
// Type - Type of text box (0 - Follower, 1 - Amulet, 2 - Spell)
// Line1 - Amulet, Spell, or Unevolved Follower text lines
// Line2 - Evolved Follower text lines, 0 if Spell or Amulet
// Canvas - Fabric.js canvas object
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
    for (var i = 0; i < lines2 - 1; i++) {
      canvas.add(new fabric.Image(loadedImages[1], {top: lineDrawPositionY, left: 753}));
      lineDrawPositionY += 40;
    };
    canvas.add(new fabric.Image(loadedImages[3], {top: lineDrawPositionY, left: 753}));
  };
  canvas.requestRenderAll;
}
