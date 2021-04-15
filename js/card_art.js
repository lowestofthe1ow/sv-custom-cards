window.onload = function() {
  // Load images
  window.loadedImages = [];
  const images = [
    // Follower text box (0-3)
    "img/generator/layout/textbox_follower/0.png",
    "img/generator/layout/textbox_follower/1.png",
    "img/generator/layout/textbox_follower/2.png",
    "img/generator/layout/textbox_follower/3.png",
    // Border (4)
    "img/generator/layout/border.png",
    // Card art (5)
    "",
    // Amulet/spell text box (6-10)
    "img/generator/layout/textbox_amuletspell/0.png",
    "img/generator/layout/textbox_amuletspell/1.png",
    "img/generator/layout/textbox_amuletspell/2.png",
    "img/generator/layout/textbox_amuletspell/3.png",
    "img/generator/layout/textbox_amuletspell/4.png",
    // Legendary frame (11-13)
    "img/generator/follower/follower_legendary.png",
    "img/generator/amulet/amulet_legendary.png",
    "img/generator/spell/spell_legendary.png",
    // Gold frame (14-16)
    "img/generator/follower/follower_gold.png",
    "img/generator/amulet/amulet_gold.png",
    "img/generator/spell/spell_gold.png",
    // Silver frame (17-19)
    "img/generator/follower/follower_silver.png",
    "img/generator/amulet/amulet_silver.png",
    "img/generator/spell/spell_silver.png",
    // Bronze frame (20-22)
    "img/generator/follower/follower_bronze.png",
    "img/generator/amulet/amulet_bronze.png",
    "img/generator/spell/spell_bronze.png",
    // Backgrounds (23-31)
    "img/generator/layout/backgrounds/background_Morning_Star.png",
    "img/generator/layout/backgrounds/background_Forest.png",
    "img/generator/layout/backgrounds/background_Castle.png",
    "img/generator/layout/backgrounds/background_Laboratory.png",
    "img/generator/layout/backgrounds/background_Mountains.png",
    "img/generator/layout/backgrounds/background_Mansion.png",
    "img/generator/layout/backgrounds/background_Darkstone.png",
    "img/generator/layout/backgrounds/background_Hall.png",
    "img/generator/layout/backgrounds/bg_tree_2_1.png"
  ];
  preloadImages(images, loadedImages, function() {
    document.getElementById("loadGif").style.display = "none";
    document.getElementById("generateButton").disabled = false;
    document.getElementById("generateButton").innerHTML = "Generate card"
  });
  document.getElementById("form_art").value = null;
  toggleText2();
}

function preloadImages(srcArray, imgArray, callback) {
  var remaining = srcArray.length - 1;
  for (var i = 0; i < srcArray.length; i++) {
    var img = new Image();
    img.onload = function() {
      remaining -= 1;
      if (remaining <= 0) {
        callback();
      }
    };
    img.src = srcArray[i];
    imgArray.push(img);
  }
}

// Bold text shortcut button
function formatText(areaText) {
  var area = document.getElementById(areaText);
  var text = area.value;
  var selectedText = text.substring(area.selectionStart, area.selectionEnd);
  var beforeText = text.substring(0, area.selectionStart);
  var afterText = text.substring(area.selectionEnd, text.length);
  if (selectedText.trim().length != 0) {
    area.value = beforeText + "[b]" + selectedText + "[/b]" + afterText;
  };
}

// Change visible settings for follower, amulet, and spell
function toggleText2() {
  if (document.getElementById("form_type").value != 0) {
    document.getElementById("div_text2").style.display = "none";
    document.getElementById("div_stats").style.display = "none";
    document.getElementById("label_form_text1").innerHTML = "Text:";
  } else {
    document.getElementById("div_text2").style.display = "block";
    document.getElementById("div_stats").style.display = "block";
    document.getElementById("label_form_text1").innerHTML = "Unevolved Text:";
  }
}

function generate() {
  // Create canvas
  var canvas = new fabric.StaticCanvas("cardTemplate", {
    width: 1920,
    backgroundColor: "#000000"
  });

  // Input fields
  const cardClasses = ["Neutral", "Forestcraft", "Swordcraft", "Runecraft", "Dragoncraft", "Shadowcraft", "Bloodcraft", "Havencraft", "Portalcraft"]
  var name = document.getElementById("form_name").value;
  var text1 = document.getElementById("form_text1").value;
  var text2 = document.getElementById("form_text2").value;
  var stats = [
    document.getElementById("form_att1").value,
    document.getElementById("form_att2").value,
    document.getElementById("form_def1").value,
    document.getElementById("form_def2").value
  ]
  var cardClass = document.getElementById("form_class").value;
  var trait = document.getElementById("form_trait").value;
  var type = document.getElementById("form_type").value;
  var cost = document.getElementById("form_cost").value;
  var art = document.getElementById("form_art");
  var rarity = document.getElementById("form_rarity").value;
  var useBlackBackground = document.getElementById("form_background").checked;
  var backgroundImage = new fabric.Image(loadedImages[23 + Number(cardClass)], {
    opacity: 0.4,
  })
  // "Trait: -" if string is blank
  if (trait.trim().length === 0) {
    trait = "-";
  };

  // Number of text lines
  if (type == 0) {
    var lines1 = getLines(text1, 30) < 5 ? 5 : getLines(text1, 30);
    var lines2 = getLines(text2, 30) < (10 - lines1) ? 10 - lines1 : getLines(text2, 30);
    if (lines2 > 5) {
      if (getLines(text1, 30) < 10 - lines2) {
        lines1 = 10 - lines2;
      } else {
        lines1 = getLines(text1, 30);
      }
    };
  } else {
    var lines1 = getLines(text1, 36) < 6 ? 6 : getLines(text1, 36);
    var lines2 = 9 - lines1;
    if (lines2 < 0) {
      lines2 = 0;
    };
  }

  // Set canvas height
  canvas.setHeight(getHeight(lines1 + lines2, type));

  // Set background image
  if (lines1+lines2 <= 12 && useBlackBackground == false) {
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas), {
      originX: "center",
      originY: "center",
      top: canvas.height / 2,
      left: canvas.width / 2
    })
  } else if (useBlackBackground == false) {
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas), {
      scaleX: canvas.height / backgroundImage.height,
      scaleY: canvas.height / backgroundImage.height,
      originX: "center",
      originY: "center",
      top: canvas.height / 2,
      left: canvas.width / 2
    });
  }

  // Draw elements common to all card types
  drawInitial(name, canvas, cardClasses[Number(cardClass)], trait);

  drawArt(canvas, type, name, cost, stats, art, rarity);

  // Draw text box and card text
  drawTextBox(type, lines1, lines2, canvas);
  if (type == 0) {
    drawFollowerText(name, text1, text2, lines1, canvas, stats);
  } else {
    drawSpellAmuletText(name, text1, lines1, canvas)
  }

  art.value = null;
  canvas.renderAll();

  // Download image
  download(canvas.toDataURL('image/png', 1.0), "card", "image/png");
}

function loadImage() {
  document.getElementById("generateButton").disabled = true;
  document.getElementById("generateButton").innerHTML = "Loading image...";
  var art = document.getElementById("form_art");
  var artImage = new Image();
  artImage.src = URL.createObjectURL(art.files[art.files.length - 1]);
  artImage.onload = function() {
    loadedImages[5] = artImage
    document.getElementById("generateButton").disabled = false;
    document.getElementById("generateButton").innerHTML = "Generate card";
  }
}

function drawArt(canvas, type, name, cost, stats, art, rarity) {
  var frame = loadedImages[11+Number(type)+(Number(rarity)*3)];
  canvas.add(new fabric.Image(frame, {top: 221, left: 136, scaleX: 576/536, scaleY: 750/698}));
  var object = new fabric.Image(loadedImages[5], {top: 342, left: 203})
  object.scaleX = 440 / object.width;
  object.scaleY = 560 / object.height;
  canvas.add(object);
  canvas.sendToBack(object);
  var widthValue = 310;
  var labelName = new fabric.Text((name), {
    left: 290,
    fontFamily: "Seagull",
    fontSize: 42,
    textAlign: "center",
    //lineHeight: (40/30)/1.13,
    fill: "#FFFFFF"
  });
  var labelCost = new fabric.Textbox((cost), {
    left: 136,
    top: 254,
    width: 129,
    fontFamily: "EBGaramond",
    fontSize: 112,
    textAlign: "center",
    fill: "#FFFFFF",
    fontWeight: 500,
    shadow: {
      color: "rgba(0, 0, 0, 0.7)",
      blur: 10,
    },
    charSpacing: -80
  });
  if (type == 0) {
    var labelAtt = new fabric.Textbox((stats[0]), {
      left: 141,
      top: 830,
      width: 129,
      fontFamily: "EBGaramond",
      fontSize: 112,
      textAlign: "center",
      fill: "#FFFFFF",
      fontWeight: 500,
      shadow: {
        color: "rgba(0, 0, 0, 0.7)",
        blur: 10,
      },
      charSpacing: -80
    });
    var labelDef = new fabric.Textbox((stats[2]), {
      left: 575,
      top: 830,
      width: 129,
      fontFamily: "EBGaramond",
      fontSize: 112,
      textAlign: "center",
      fill: "#FFFFFF",
      fontWeight: 500,
      shadow: {
        color: "rgba(0, 0, 0, 0.7)",
        blur: 10,
      },
      charSpacing: -80
    });
    canvas.add(labelAtt);
    canvas.add(labelDef);
  }
  canvas.add(labelCost);
  canvas.add(labelName);
  if (labelName.measureLine(0).width > widthValue - 20) {
    labelName.fontSize *= widthValue / (labelName.measureLine(0).width);
  } else {
    labelName.left = 280;
  };
  labelName.top = 302 + ((42-labelName.fontSize)/2.5);
  labelName.width = widthValue;
}

// Draw elements common to all card types
function drawInitial(name, canvas, cardClass, trait) {
  canvas.add(new fabric.Text(name, {top: 113, left: 133, fontFamily: "Seagull", fontSize: 60, fill: "#FFFDEE"}));
  canvas.add(new fabric.Text("Class:", {top: 75, left: 1406, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#CACAB2"}));
  canvas.add(new fabric.Text("Trait:", {top: 128, left: 1419, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#CACAB2"}));
  canvas.add(new fabric.Text(cardClass, {top: 75, left: 1553, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#FFFDEE"}));
  canvas.add(new fabric.Text(trait, {top: 128, left: 1553, charSpacing: 20, fontFamily: "Seagull", fontSize: 36, fill: "#FFFDEE"}));
}

// Get canvas height to account for text lines
function getHeight(sum, type) {
  if (type == 0) {
    if (sum > 12) {
      return 1120 + (40*(sum-12));
    } else {
      return 1120;
    }
  } else {
    if (sum > 11) {
      return 1120 + (51*(sum-11));
    } else {
      return 1120;
    }
  }
}

// Get number of text lines
function getLines(text, textSize) {
  var textbox = new fabric.Textbox(parseBB(text)[0], {
    width: 911,
    fontFamily: "Seagull",
    fontSize: textSize,
    fill: "#FFFDEE"
  });
  return textbox._textLines.length;
}

// Draw spell or amulet text on canvas
// Name - User-inputted name
// Text - Amulet or Spell text
// LinesSpacing - Number of Text1 line spaces for Text2 to account for
// Canvas - Fabric.js canvas object
function drawSpellAmuletText(name, text, linesSpacing, canvas) {
  var parseResults = parseBB(text);
  var fabricText = new fabric.Textbox(parseResults[0], {
    top: 401,
    left: 804,
    width: 911,
    fontFamily: "Seagull",
    fontSize: 36,
    lineHeight: (51/36)/1.13,
    fill: "#FFFDEE",
  });
  for (var i = 0; i < parseResults[1].length; i++) {
    fabricText.setSelectionStyles({fontWeight: 1000}, parseResults[1][i], parseResults[2][i]);
  }
  canvas.add(fabricText);
}

// Draw follower text on canvas
// Name - User-inputted name
// Text1 - Unevolved Follower text
// Text2 - Evolved Follower text
// LinesSpacing - Number of Text1 line spaces for Text2 to account for
// Canvas - Fabric.js canvas object
function drawFollowerText(name, text1, text2, linesSpacing, canvas, stats) {
  var parseResults1 = parseBB(text1);
  var parseResults2 = parseBB(text2);
  var fabricText1 = new fabric.Textbox(parseResults1[0], {
    top: 357,
    left: 804,
    width: 911,
    fontFamily: "Seagull",
    fontSize: 30,
    lineHeight: (40/30)/1.13,
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
    lineHeight: (40/30)/1.13,
    fill: "#FFFDEE"
  });
  for (var i = 0; i < parseResults2[1].length; i++) {
    fabricText2.setSelectionStyles({fontWeight: 1000}, parseResults2[1][i], parseResults2[2][i]);
  }
  //unevolved,atk,def
  canvas.add(new fabric.Text(stats[0], {
    top: 284,
    left: 1535,
    fontFamily: "Stargate",
    fontSize: 60,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  canvas.add(new fabric.Text(stats[2], {
    top: 284,
    left: 1677,
    fontFamily: "Stargate",
    fontSize: 60,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  //evolved,atk,def
  canvas.add(new fabric.Text(stats[1], {
    top: 398+(40*linesSpacing),
    left: 1535,
    fontFamily: "Stargate",
    fontSize: 60,
    fill: "#FFFDEE",
    charSpacing: -80
  }));
  canvas.add(new fabric.Text(stats[3], {
    top: 398+(40*linesSpacing),
    left: 1677,
    fontFamily: "Stargate",
    fontSize: 60,
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
  canvas.add(new fabric.Image(loadedImages[4], {top: 0, left: 0}));
  // Follower text box
  if (type == 0) {
    canvas.add(new fabric.Image(loadedImages[0], {top: 240, left: 753}));
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
  }
  // Spell or Amulet text box
  else {
    if (type == 1) {
      // Amulet
      canvas.add(new fabric.Image(loadedImages[6], {top: 240, left: 753}));
    }
    else {
      // Spell
      canvas.add(new fabric.Image(loadedImages[7], {top: 240, left: 753}));
    }
    for (var i = 0; i < lines1 - 1; i++) {
      canvas.add(new fabric.Image(loadedImages[8], {top: 446+(51*i), left: 753}));
    };
    lineDrawPositionY = 446+(51*i);
    for (var i = 0; i < lines2; i++) {
      canvas.add(new fabric.Image(loadedImages[9], {top: lineDrawPositionY, left: 753}));
      lineDrawPositionY += 51;
    };
    canvas.add(new fabric.Image(loadedImages[10], {top: lineDrawPositionY, left: 753}));
  }
}
