// Bold text shortcut button
function formatText(areaText) {
  var area = document.getElementById(areaText);
  var text = area.value;
  var selectedText = text.substring(area.selectionStart, area.selectionEnd);
  var beforeText = text.substring(0, area.selectionStart);
  var afterText = text.substring(area.selectionEnd, text.length);
  area.value = beforeText + "[b]" + selectedText + "[/b]" + afterText;
}

// Preload array of images
function preloadImages(srcArray, imgArray, generateButton, callback) {
  var remaining = srcArray.length;
  for (var i = 0; i < srcArray.length; i++) {
    var img = new Image();
    img.addEventListener("load", function() {
      remaining -= 1;
      generateButton.innerHTML = "Loading (" + String((Math.round(100*(srcArray.length - remaining)/srcArray.length))) + "%)...";
      if (remaining <= 0) {
        callback();
      };
    });
    img.addEventListener("error", function() {
      this.crossOrigin = "anonymous";
      this.src = srcArray[i];
    })
    img.crossOrigin = "anonymous";
    img.src = srcArray[i];
    document.getElementById("imageloader").appendChild(img);
    imgArray.push(img);
  }
}

window.onload = function() {
  // Load queue
  var loadQueue = [];
  var loadedImages = [];

  // Input fields
  const generateButton = document.getElementById("generateButton");
  const cardName = document.getElementById("form_name");
  const cardText1 = document.getElementById("form_text1");
  const cardText2 = document.getElementById("form_text2");
  const cardStats = [
    document.getElementById("form_att1"),
    document.getElementById("form_att2"),
    document.getElementById("form_def1"),
    document.getElementById("form_def2")
  ]
  const cardClass = document.getElementById("form_class");
  const cardTrait = document.getElementById("form_trait");
  const cardType = document.getElementById("form_type");
  const cardCost = document.getElementById("form_cost");
  const cardRarity = document.getElementById("form_rarity");
  const cardIllus = document.getElementById("form_illus");
  const isToken = document.getElementById("form_token");
  const useBlackBG = document.getElementById("form_blackBG");
  const autoStretch = document.getElementById("form_autoStretch");
  const artUpload = document.getElementById("form_art");

  // Const arrays for lookup
  const cardClasses = ["Neutral", "Forestcraft", "Swordcraft", "Runecraft", "Dragoncraft", "Shadowcraft", "Bloodcraft", "Havencraft", "Portalcraft"];
  const cardTypes = ["follower", "amulet", "spell"];
  const cardRarities = ["legendary", "gold", "silver", "bronze"];

  artUpload.value = null;

  // Initialize cropper
  var croppedArt = new Image();
  var cropperWidth = document.documentElement.clientWidth >= 470 ? 440 : (document.documentElement.clientWidth - 30);
  var croppedImage = "";
  var cropper = new Croppie(document.getElementById("ui_crop"), {
    viewport: { width: cropperWidth, height: cropperWidth*(14/11) },
    boundary: { width: cropperWidth, height: cropperWidth*(14/11) },
    mouseWheelZoom: false
  });

  // Change visible settings depending on if card is follower, amulet, and spell
  cardType.onchange = function() {
    if (cardType.value != 0) {
      document.getElementById("div_text2").style.display = "none";
      document.getElementById("div_stats").style.display = "none";
      document.getElementById("label_form_text1").innerHTML = "Text:";
    } else {
      document.getElementById("div_text2").style.display = "block";
      document.getElementById("div_stats").style.display = "block";
      document.getElementById("label_form_text1").innerHTML = "Unevolved Text:";
    };
  };

  // Crop whenever image is uploaded
  artUpload.onchange = function() {
    croppedImage = URL.createObjectURL(artUpload.files[0]);
    cropper.bind({
        url: croppedImage,
    });
  };

  // Change visible settings for automatically stretching image instead of cropping
  autoStretch.onchange = function() {
    if (autoStretch.checked == true) {
      document.getElementById("ui_crop").style.display = "none";
    } else {
      document.getElementById("ui_crop").style.display = "block";
      if (croppedImage.length != 0) {
        artUpload.onchange(); // Re-bind uploaded image to cropper
      };
    };
  };

  // Update visible settings on window load
  cardType.onchange();
  autoStretch.onchange();

  // Load background image and generate
  generateButton.addEventListener("click", function() {
    // Disable all forms
    for (var i = 0; i < document.querySelectorAll(".cardData").length; i++) {
      document.querySelectorAll(".cardData")[i].disabled = true;
    }
    generateButton.innerHTML = "Loading...";

    // Set frame image source
    var srcFrame = "img/generator/" + cardTypes[
      cardType.value
    ] + "/" + cardTypes[
      cardType.value
    ] + "_" + cardRarities[
      cardRarity.value
    ] + ".png";

    // Set gem image source
    var srcGem = "img/generator/gems/gem_" + cardClasses[
      cardClass.value
    ] + ".png";

    // Set textbox header
    var srcTxtHeader = "img/generator/layout/header_" + cardTypes[
      cardType.value
    ] + ".png";

    // Reset loadedImages array
    loadedImages = [];

    // Update loading queue
    loadQueue = [
      srcFrame,
      srcGem,
      "img/generator/layout/border.png",
      srcTxtHeader
    ];

    // Set textbox image sources, depending on type
    if (cardType.value == 0) {
      loadQueue.push(
        "img/generator/layout/follower_1.png",
        "img/generator/layout/follower_2.png",
        "img/generator/layout/follower_3.png"
      );
    } else {
      loadQueue.push(
        "img/generator/layout/amuletspell_1.png",
        "img/generator/layout/amuletspell_2.png",
        "img/generator/layout/amuletspell_3.png"
      )
    };

    // Set emblem image source, if used
    if (cardClass.value != 0) {
      var srcEmblem = "img/generator/emblems/emblem_" + cardClasses[
        cardClass.value
      ] + ".png";
      loadQueue.push(srcEmblem)
    }

    // Set background image source, if used
    if (useBlackBG.checked == false) {
      var srcBG = "img/generator/backgrounds/background_" + cardClasses[
        cardClass.value
      ] + ".png";
      loadQueue.push(srcBG);
    };

    // Load images
    preloadImages(loadQueue, loadedImages, generateButton, function() {
      // Update "generate" button text
      generateButton.innerHTML = "Generating...";
      // Load images
      if (autoStretch.checked == true && croppedImage.length != 0) {
        croppedArt.src = croppedImage;
      } else {
        cropper.result({
          type: "base64",
          size: {width: 440, height: 560},
          format: "png",
          quality: 1,
          circle: false
        }).then(function(base64) {
          croppedArt.src = base64;
        });
      };
    });
  });

  // Generate card
  croppedArt.addEventListener("load", function () {
    var canvas = new fabric.StaticCanvas("cardTemplate", {
      width: 1920,
      backgroundColor: "#000000"
    });

    // Re-enable all forms
    for (var i = 0; i < document.querySelectorAll(".cardData").length; i++) {
      document.querySelectorAll(".cardData")[i].disabled = false;
    }
    generateButton.innerHTML = "Generate card";

    // Variable declarations
    var finalTrait = cardTrait.value;
    var finalIllus = cardIllus.value;
    var fileName = cardName.value.replace(/\s+/g, '');

    // Style objects
    const styleLabel = {
      charSpacing: 20,
      fontFamily: "font_Seagull",
      fontSize: 36,
      fill: "#CACAB2"
    };
    const styleValue = {
      charSpacing: 20,
      fontFamily: "font_Seagull",
      fontSize: 36,
      fill: "#FFFDEE"
    };
    const styleFollowerText = {
      left: 804,
      width: 911,
      fontFamily: "font_Seagull",
      fontSize: 30,
      lineHeight: (40/30)/1.13,
      fill: "#FFFDEE",
    };
    const styleTextboxStats = {
      fontFamily: "font_Stargate",
      fontSize: 60,
      fill: "#FFFDEE",
      charSpacing: -80
    };
    const styleCardStats = {
      width: 129,
      fontFamily: "font_Garamond",
      fontSize: 102,
      textAlign: "center",
      fill: "#FFFFFF",
      fontWeight: 1000,
      charSpacing: -80
    };

    // Default filename
    if (fileName.length === 0) {
      fileName = "card";
    };

    // "Trait: -" and "Illustrator: -" if string is blank
    if (finalTrait.trim().length === 0) {
      finalTrait = "-";
    };
    if (finalIllus.trim().length === 0) {
      finalIllus = "-";
    };

    // Number of text lines
    if (cardType.value == 0) {
      var getLinesResult1 = getLines(cardText1.value, 30);
      var getLinesResult2 = getLines(cardText2.value, 30);
      var lines1 = getLinesResult1 < 5 ? 5 : getLinesResult1;
      var lines2 = getLinesResult2 < (10 - lines1) ? 10 - lines1 : getLinesResult2;
      if (lines2 > 5) {
        if (getLinesResult1 < 10 - lines2) {
          lines1 = 10 - lines2;
        } else {
          lines1 = getLinesResult1;
        }
      };
    } else {
      var getLinesResult = getLines(cardText1.value, 36);
      var lines1 = getLinesResult < 6 ? 6 : getLinesResult;
      var lines2 = 9 - lines1;
      if (lines2 < 0) {
        lines2 = 0;
      };
    };

    // Set canvas height
    canvas.setHeight(getHeight(lines1 + lines2, cardType.value));

    // Set background image
    if (useBlackBG.checked == false) {
      // Create new Fabric image object for background
      var imageBG = new fabric.Image(loadedImages[loadedImages.length - 1], {opacity: 0.4});
      // Factor by which to scale the background image
      var scaleFactor = canvas.height < imageBG.height ? canvas.width / imageBG.width : canvas.height / imageBG.height;
      // Render the background image
      if (lines1+lines2 <= 12) {
        canvas.setBackgroundImage(imageBG, canvas.renderAll.bind(canvas), {
          originX: "center",
          originY: "center",
          top: canvas.height / 2,
          left: canvas.width / 2
        });
      } else {
        canvas.setBackgroundImage(imageBG, canvas.renderAll.bind(canvas), {
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          originX: "center",
          originY: "center",
          top: canvas.height / 2,
          left: canvas.width / 2
        });
      };
    };

    // Draw initial layout
    canvas.add(new fabric.Text(cardName.value, {
      top: 113,
      left: 133,
      fontFamily: "font_Seagull",
      fontSize: 60,
      fill: "#FFFDEE"
    }));
    canvas.add(new fabric.Text("Class:", {...styleLabel, ...{top: 75, left: 1406}}));
    canvas.add(new fabric.Text(cardClasses[cardClass.value], {...styleValue, ...{top: 75, left: 1553,}}));
    canvas.add(new fabric.Text("Trait:", {...styleLabel, ...{top: 128, left: 1419}}));
    canvas.add(new fabric.Text(finalTrait, {...styleValue, ...{top: 128, left: 1553}}));

    // Draw "Illustrator:" text
    var illusString = "Illustrator: " + finalIllus;
    var illusFabricText = new fabric.Text(illusString, {
      top: 987, left: 100, charSpacing: 20, fontFamily: "font_Seagull", fontSize: 36, fill: "#FFFDEE"
    })
    illusFabricText.setSelectionStyles({fill: "#CACAB2"}, 0, 12);
    canvas.add(illusFabricText);

    canvas.add(new fabric.Image(loadedImages[2], {top: 0, left: 0}));

    // Draw "This is a token card" text
    if (isToken.checked == true) {
      canvas.add(new fabric.Text("*This is a token card.", {top: 1020, left: 100, charSpacing: 20, fontFamily: "font_Seagull", fontSize: 36, fill: "#FFFDEE"}));
    }

    // Draw class emblem
    if (cardClass.value != 0) {
      var imageEmblem = loadedImages[7];
      canvas.add(new fabric.Image(imageEmblem, {top: 70, left: 1505}));
    }

    // Draw card frame
    canvas.add(new fabric.Image(loadedImages[0], {top: 221, left: 136, scaleX: 1.075, scaleY: 1.075}));
    canvas.add(new fabric.Image(loadedImages[1], {
      top: cardType.value == 2 ? 878 : 879,
      left: 413,
      scaleX: 1.1,
      scaleY: 1.1,
      shadow: {
        color: "rgba(0, 0, 0, 1)",
        blur: 3,
      },
    }));

    // Draw card art
    var fabricCroppedArt = new fabric.Image(croppedArt, {top: 342, left: 203});
    if (autoStretch.checked == true) {
      fabricCroppedArt.scaleX = 440 / fabricCroppedArt.width;
      fabricCroppedArt.scaleY = 560 / fabricCroppedArt.height;
    }
    canvas.add(fabricCroppedArt);
    canvas.sendToBack(fabricCroppedArt);

    // Draw card name
    var labelName = new fabric.Text(cardName.value, {
      left: 290,
      fontFamily: "font_Seagull",
      fontSize: 42,
      textAlign: "center",
      //lineHeight: (40/30)/1.13,
      fill: "#FFFFFF"
    });
    // Center and shrink card name font
    if (labelName.measureLine(0).width > 290) {
      labelName.fontSize *= 310 / (labelName.measureLine(0).width);
    } else {
      labelName.left = 280;
    };
    labelName.top = 302 + ((42-labelName.fontSize)/2.5);
    labelName.width = 310;
    // Add to canvas
    canvas.add(labelName);

    // Draw card cost
    var labelCost = new fabric.Textbox(cardCost.value, {
      left: 136,
      top: 254,
      width: 129,
      fontFamily: "font_Garamond",
      fontSize: 112,
      textAlign: "center",
      fill: "#FFFFFF",
      stroke: "rgba(153, 255, 102, 0.2)",
      paintFirst: "stroke",
      strokeWidth: 7,
      fontWeight: 1000,
      shadow: {
        color: "rgba(0, 0, 0, 1)",
        blur: 10,
      },
      charSpacing: -80
    });
    canvas.add(labelCost);

    // Draw follower stats
    if (cardType.value == 0) {
      var labelAtt = new fabric.Textbox(cardStats[0].value, {...styleCardStats, ...{
        left: 141,
        top: 830,
        shadow: {
          color: "rgba(0, 0, 50, 1)",
          offsetY: 4
        }
      }});
      var labelDef = new fabric.Textbox(cardStats[2].value, {...styleCardStats, ...{
        left: 575,
        top: 830,
        shadow: {
          color: "rgba(50, 0, 0, 1)",
          offsetY: 4
        }
      }});
      canvas.add(labelAtt);
      canvas.add(labelDef);
    }

    // Draw text box
    var currentDrawPosition;
    canvas.add(new fabric.Image(loadedImages[3], {top: 240, left: 753})); // Header

    // Follower text box and text
    if (cardType.value == 0) {
      // Parse text
      var parseResults1 = parseBB(cardText1.value);
      var parseResults2 = parseBB(cardText2.value);

      // Draw textbox spaces
      for (var i = 0; i < lines1-1; i++) {
        canvas.add(new fabric.Image(loadedImages[4], {top: 394+(40*i), left: 753}));
      };
      currentDrawPosition = 354+(40*i);
      // Draw unevolved-evolved textbox separator
      canvas.add(new fabric.Image(loadedImages[5], {top: currentDrawPosition+40, left: 753}));
      currentDrawPosition += 197;
      // Draw textbox spaces
      for (var i = 0; i < lines2 - 1; i++) {
        canvas.add(new fabric.Image(loadedImages[4], {top: currentDrawPosition, left: 753}));
        currentDrawPosition += 40;
      };
      // Draw textbox closing
      canvas.add(new fabric.Image(loadedImages[6], {top: currentDrawPosition, left: 753}));

      // Draw follower text
      var fabricText1 = new fabric.Textbox(parseResults1[0], {...styleFollowerText, ...{top: 357}});
      var fabricText2 = new fabric.Textbox(parseResults2[0], {...styleFollowerText, ...{top: 474+(40*lines1)}});
      // Format text to bold, depending on parse results
      for (var i = 0; i < parseResults1[1].length; i++) {
        fabricText1.setSelectionStyles({fontWeight: 1000}, parseResults1[1][i], parseResults1[2][i]);
      }
      for (var i = 0; i < parseResults2[1].length; i++) {
        fabricText2.setSelectionStyles({fontWeight: 1000}, parseResults2[1][i], parseResults2[2][i]);
      }

      // Draw unevolved attack and defense
      canvas.add(new fabric.Text(cardStats[0].value, {...styleTextboxStats, ...{top: 284, left: 1535}}));
      canvas.add(new fabric.Text(cardStats[2].value, {...styleTextboxStats, ...{top: 284, left: 1677}}));
      // Draw evolved attack and defense
      canvas.add(new fabric.Text(cardStats[1].value, {...styleTextboxStats, ...{top: 398+(40*lines1), left: 1535}}));
      canvas.add(new fabric.Text(cardStats[3].value, {...styleTextboxStats, ...{top: 398+(40*lines1), left: 1677}}));

      // Add to canvas
      canvas.add(fabricText1);
      canvas.add(fabricText2);
    }

    // Spell or Amulet text box and text
    else {
      // Parse text
      var parseResults = parseBB(cardText1.value);

      // Draw textbox spaces
      for (var i = 0; i < lines1 - 1; i++) {
        canvas.add(new fabric.Image(loadedImages[4], {top: 446+(51*i), left: 753}));
      };
      currentDrawPosition = 446+(51*i);
      // Draw empty textbox space
      for (var i = 0; i < lines2; i++) {
        canvas.add(new fabric.Image(loadedImages[5], {top: currentDrawPosition, left: 753}));
        currentDrawPosition += 51;
      };
      // Draw textbox closing
      canvas.add(new fabric.Image(loadedImages[6], {top: currentDrawPosition, left: 753}));

      // Draw spell or amulet text
      var fabricText = new fabric.Textbox(parseResults[0], {
        top: 401,
        left: 804,
        width: 911,
        fontFamily: "font_Seagull",
        fontSize: 36,
        lineHeight: (51/36)/1.13,
        fill: "#FFFDEE",
      });
      // Format text to bold, depending on parse results
      for (var i = 0; i < parseResults[1].length; i++) {
        fabricText.setSelectionStyles({fontWeight: 1000}, parseResults[1][i], parseResults[2][i]);
      }

      // Add to canvas
      canvas.add(fabricText);
    }

    // Download image
    download(canvas.toDataURL('image/png', 1.0), fileName, "image/png");
  });

  // Get canvas height
  function getHeight(sum, type) {
    if (type == 0) {
      if (sum > 12) {
        return 1120 + (40*(sum-12));
      } else {
        return 1120;
      };
    } else {
      if (sum > 11) {
        return 1120 + (51*(sum-11));
      } else {
        return 1120;
      };
    };
  };

  // Get number of text lines
  function getLines(text, textSize) {
    var textbox = new fabric.Textbox(parseBB(text)[0], {
      width: 911,
      fontFamily: "font_Seagull",
      fontSize: textSize,
      fill: "#FFFDEE"
    });
    return textbox._textLines.length;
  };

  // Parse [b] and [/b] in TextArea input
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
    };
    result = [slicedText, startIndices, endIndices];
    return result;
  };
};
