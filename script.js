function addColor(e, color) {
  const colorSymbols = {
    blue: "@",
    red: "&",
    green: "$",
    yellow: "#",
  };
  const get_text = getSelectionTextarea(e);
  console.log(get_text);
  if (get_text === "ブラウザが対応していません") {
    alert(get_text);
    return;
  }

  const targetTextArea = document.getElementById("FlexTextarea");
  const [text1, text2] = colorSymbols.hasOwnProperty(color)
    ? [colorSymbols[color], colorSymbols[color]]
    : ["", ""];

  //カーソルの開始位置と終了位置を基準に分割
  targetTextArea.value =
    targetTextArea.value.substring(0, targetTextArea.selectionStart) +
    text1 +
    targetTextArea.value.substring(
      targetTextArea.selectionStart,
      targetTextArea.selectionEnd
    ) +
    text2 +
    targetTextArea.value.substring(targetTextArea.selectionEnd);
}

// テキストエリアから選択部分を取得
function getSelectionTextarea(e) {
  try {
    e.focus();
    return e.value.substring(e.selectionStart, e.selectionEnd); // テキストエリアのvalueから開始位置と終了位置を指定して抜き出し
  } catch (error) {
    alert("ブラウザが対応していません");
    return null;
  }
}

// テキストエリアのテキストをすべてクリップボードにコピー
document.getElementById("copy-button").addEventListener("click", function () {
  var targetText = document.getElementById("FlexTextarea");
  var replacedCopyText = targetText.value.replace(/\n/g, "\\n");
  navigator.clipboard.writeText(replacedCopyText);
  // コピー完了の表示
  var coyButtonElement = document.getElementById("copy-button");
  coyButtonElement.textContent = "コピーしました";
  // 3秒後に元の文字列に戻す
  setTimeout(function () {
    coyButtonElement.textContent = "全部コピー";
  }, 3000); 
});

// テキストエリアを書く文量によってtextAreaを拡大する関数
function flexTextarea(el) {
  const dummy = el.querySelector(".FlexTextarea__dummy");
  el.querySelector(".FlexTextarea__textarea").addEventListener("input", (e) => {
    dummy.textContent = e.target.value + "\u200b";
  });
}
document.querySelectorAll(".FlexTextarea").forEach(flexTextarea);

// テキストエリアのカーソル位置に文字を挿入
function addText(inputText) {
  var targetTextArea = document.getElementById("FlexTextarea");
  //カーソルの位置を基準に前後を分割して、その間に文字列を挿入
  targetTextArea.value =
    targetTextArea.value.substr(0, targetTextArea.selectionStart) +
    inputText +
    targetTextArea.value.substr(targetTextArea.selectionStart);
}

// jsonファイルからマップデータを読み取る
function getJsonData(jsonFilePath, jsonKey, version) {
  let request = new XMLHttpRequest();
  request.open("GET", jsonFilePath);
  request.send();

  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      let json = JSON.parse(request.responseText);
      json = json[jsonKey];
      for (let i = 0; i < json.length; ++i) {
        generateStateButton(json[i], version);
        generateCastleButton(json[i], version);
      }
    }
  };
}

function generateStateButton(json, version) {
  var stateName = json["stateName"];
  var districts = json["districts"];
  var districts_html = "";
  for (let i = 0; i < districts.length; ++i) {
    var districtName = districts[i]["districtName"];
    if (districtName == "関") {
      continue;
    }
    var district_html =
      '<li><a href="#" onclick="addText(\'' +
      districtName +
      "郡');\">" +
      districtName +
      "郡</a></li>";
    districts_html += district_html;
  }
  var div_html =
    '<div class="uk-inline"> <button class="uk-button uk-button-default" type="button">' +
    stateName +
    '</button><div uk-dropdown="mode: click"><ul class="uk-nav uk-dropdown-nav"><li class="uk-nav-header">州名</li><li><a href="#" onclick="addText(\'' +
    stateName +
    "');\">" +
    stateName +
    '</a></li><li class="uk-nav-divider"></li><li class="uk-nav-header">郡名</li>' +
    districts_html +
    "</ul></div></div>";
  if (version === 9) {
    var divButtons = document.getElementById("state-district-s9");
  } else if (version == 4) {
    var divButtons = document.getElementById("state-district-s4");
  } else if (version == 3) {
    var divButtons = document.getElementById("state-district-s3");
  } else {
    var divButtons = document.getElementById("state-district-non-coordinate");
  }
  divButtons.innerHTML += div_html;
}

function generateCastleButton(json, version) {
  var stateName = json["stateName"];
  var districts = json["districts"];
  var districts_html = "";
  for (let i = 0; i < districts.length; ++i) {
    var districtName = districts[i]["districtName"];
    var castles = districts[i]["castles"];
    var castles_html = "";
    for (let i = 0; i < castles.length; ++i) {
      var castleLevel = castles[i]["castleLevel"];
      var castleLocation = castles[i]["castleLocation"];
      // var castleLocation = "";
      var castleName = castles[i]["castleName"];
      var castle_html =
        '<li><a href="#" onclick="addText(\' Lv.' +
        castleLevel +
        " " +
        castleName +
        castleLocation +
        "');\">Lv." +
        castleLevel +
        " " +
        castleName +
        "</a></li>";
      castles_html += castle_html;
    }
    if (districtName != "関") {
      districtName = districtName + "郡";
    }
    var district_html =
      '<li class="uk-nav-header">' +
      districtName +
      "</li>" +
      castles_html +
      '<li class="uk-nav-divider"></li>';
    districts_html += district_html;
  }
  var div_html =
    '<div class="uk-inline"><button class="uk-button uk-button-default" type="button">' +
    stateName +
    '</button><div uk-dropdown="mode: click"><ul class="uk-nav uk-dropdown-nav">' +
    districts_html +
    "</ul></div></div>";

  if (version == 9) var divButtons = document.getElementById("castle-name-s9");
  else if (version == 4)
    var divButtons = document.getElementById("castle-name-s4");
  else if (version == 3)
    var divButtons = document.getElementById("castle-name-s3");
  else var divButtons = document.getElementById("castle-name-non-coordinate");
  divButtons.innerHTML += div_html;
}

window.onload = function () {
  getJsonData(
    "map_data/non-coordinate.json",
    "non-coordinate",
    "non-coordinate"
  );
  getJsonData("map_data/s3data_1500.json", "s3", 3);
  getJsonData("map_data/s4data_1500.json", "s4", 4);
  getJsonData("map_data/s9data_1500.json", "s9", 9);
};
