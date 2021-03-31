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
  Promise.all(loadedImages.filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
      //console.log('images finished loading');
      document.getElementById("generateButton").disabled = false;
  });
}

function generate() {
  // Input fields
  var name = document.getElementById("form_name").value;
  var text1 = document.getElementById("form_text1").value;
  var text2 = document.getElementById("form_text2").value;
  var att1 = document.getElementById("form_att1").value;
  var att2 = document.getElementById("form_att2").value;
  var def1 = document.getElementById("form_def1").value;
  var def2 = document.getElementById("form_def2").value;
  var cardClass = document.getElementById("form_class").value;
  var trait = document.getElementById("form_trait").value;
  var backgroundImage = new fabric.Image(loadedImages[5], {opacity: 0.4})

  if (trait.trim().length === 0) {
    trait = "-";
  };

  // Number of text lines (Followers only)
  var lines1 = getLines(text1) < 5 ? 5 : getLines(text1);
  var lines2 = getLines(text2) < (10 - lines1) ? 10 - lines1 : getLines(text2);
  if (lines2 > 5) {
    if (getLines(text1) < 10 - lines2) {
      lines1 = 10 - lines2;
      console.log(lines1);
    } else {
      lines1 = getLines(text1);
    }
  };

  // Create canvas
  var canvas = new fabric.StaticCanvas("cardTemplate", {
    width: 1920,
    backgroundColor: "#000000"
  });

  // Set canvas height
  canvas.setHeight(getHeight(lines1 + lines2));

  // Disable background image if canvas is expanded
  if (lines1+lines2 <= 12) {
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas))
  }

  // Draw text box and card text (Followers only)
  drawTextBox(0, lines1, lines2, canvas);
  drawFollowerText(name, text1, text2, lines1, canvas, att1, att2, def1, def2);
  drawInitial(name, canvas, cardClass, "-");
  // Download image
  download(canvas.toDataURL('image/png', 1.0), "card", "image/png");
}

function drawInitial(name, canvas, cardClass, trait) {
  canvas.add(new fabric.Text(name, {top: 113, left: 133, fontFamily: "Seagull", fontSize: 60, fill: "#FFFDEE"}));
  canvas.add(new fabric.Text("Class:", {top: 75, left: 1406, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#CACAB2"}));
  canvas.add(new fabric.Text("Trait:", {top: 128, left: 1419, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#CACAB2"}));
  canvas.add(new fabric.Text(cardClass, {top: 75, left: 1553, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#FFFDEE"}));
  canvas.add(new fabric.Text(trait, {top: 128, left: 1553, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#FFFDEE"}));
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
function drawFollowerText(name, text1, text2, linesSpacing, canvas, att1, att2, def1, def2) {
  var parseResults1 = parseBB(text1);
  var parseResults2 = parseBB(text2);
  var fabricText1 = new fabric.Textbox(parseResults1[0], {
    top: 357,
    left: 804,
    width: 911,
    fontFamily: "Seagull",
    fontSize: 30,
    lineHeight: 1.18,
    fill: "#FFFDEE",
  });
  for (var i = 0; i < parseResults1[1].length; i++) {
    fabricText1.setSelectionStyles({fontWeight: 1000}, parseResults1[1][i], parseResults1[2][i]);
  }
  var fabricText2 = new fabric.Textbox(parseResults2[0], {
    top: 474+(40*linesSpacing),
    left: 804,
    width: 911,
    fontFamily: "Seagull",
    fontSize: 30,
    lineHeight: 1.18,
    fill: "#FFFDEE"
  });
  for (var i = 0; i < parseResults2[1].length; i++) {
    fabricText2.setSelectionStyles({fontWeight: 1000}, parseResults2[1][i], parseResults2[2][i]);
  }
  //unevolved,atk,def
  canvas.add(new fabric.Text(att1, {
    top: 284,
    left: 1535,
    fontFamily: "Stargate",
    fontSize: 60,
    lineHeight: 1.18,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  canvas.add(new fabric.Text(def1, {
    top: 284,
    left: 1677,
    fontFamily: "Stargate",
    fontSize: 60,
    lineHeight: 1.18,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  //evolved,atk,def
  canvas.add(new fabric.Text(att2, {
    top: 598,
    left: 1535,
    fontFamily: "Stargate",
    fontSize: 60,
    lineHeight: 1.18,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  canvas.add(new fabric.Text(def2, {
    top: 598,
    left: 1677,
    fontFamily: "Stargate",
    fontSize: 60,
    lineHeight: 1.18,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  canvas.add(fabricText1);
  canvas.add(fabricText2);
}

// Parse [b] and [/b] in TextArea input
// Text - User-inputted text
function parseBB(text) {
  var slicedText = text;
  var startIndices = [];
  var endIndices = [];
  var result = [];
  var i = 0;
  while (slicedText.includes("[b]") == true && slicedText.includes("[/b]") == true) {
    startIndices[i] = slicedText.indexOf("[b]");
    endIndices[i] = slicedText.indexOf("[/b]") - 3;
    slicedText = slicedText.replace("[b]", "");
    slicedText = slicedText.replace("[/b]", "");
    i += 1;
  }
  result = [slicedText, startIndices, endIndices];
  return result;
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
    };
    lineDrawPositionY = 354+(40*i);
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
