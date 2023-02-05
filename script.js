// 文字に色をつける記号を挿入
function addColor(e, color) {
  var get_text = getSelectionTextarea(e);
  console.log(get_text);
  if (get_text == "ブラウザが対応していません") {
    alert("ブラウザが対応していません");
  }
  //テキストエリアと挿入する文字列を取得
  var targetTextArea = document.getElementById("FlexTextarea");
  var text1;
  var text2;
  if (color == "blue") {
    text1 = "@";
    text2 = "@";
  } else if (color == "red") {
    text1 = "&";
    text2 = "&";
  } else if (color == "green") {
    text1 = "$";
    text2 = "$";
  } else if (color == "yellow") {
    text1 = "#";
    text2 = "#";
  } else {
    text1 = "";
    text2 = "";
  }
  //カーソルの開始位置と終了位置を基準に分割
  targetTextArea.value =
    targetTextArea.value.substr(0, targetTextArea.selectionStart) +
    text1 +
    targetTextArea.value.substr(
      targetTextArea.selectionStart,
      targetTextArea.selectionEnd - targetTextArea.selectionStart
    ) +
    text2 +
    targetTextArea.value.substr(targetTextArea.selectionEnd);
}

// テキストエリアから選択部分を取得
function getSelectionTextarea(e) {
  if (document.selection) {
    // IE
    e.focus(); // ドキュメントのフォーカスをテキストエリアにあてる
    var r = document.selection.createRange(); // 現在フォーカスのあたっている選択範囲を取得する
    return r.text;
  } else if (e.setSelectionRange) {
    // Mozilla(NN)
    e.focus(); // NNの場合は得にフォーカスをあてる必要はないが動作を同等にしている
    return e.value.substring(e.selectionStart, e.selectionEnd); // テキストエリアのvalueから開始位置と終了位置を指定して抜き出し
  } else {
    alert("ブラウザが対応していません");
    return null;
  }
}

// テキストエリアのテキストをすべてクリップボードにコピーする関数
function copy(FlexTextarea) {
  var targetText = FlexTextarea;
  var replacedCopyText = targetText.value.replace(/\n/g, "\\n");

  if (navigator.userAgent.match(/iphone|ipod|ipad|android/i)) {
    try {
      targetText.select();
    } catch (error) {}
    var range = document.createRange();
    range.selectNode(targetText);
    window.getSelection().addRange(range);
  } else {
    try {
      targetText.select(); // input field
    } catch (error) {
      document.getSelection().selectAllChildren(a);
    }
  }
  // クリップボードにコピー
  if (navigator.clipboard == undefined) {
    // IE
    window.clipboardData.setData("Text", replacedCopyText);
  } else {
    // IE以外
    navigator.clipboard.writeText(replacedCopyText);
  }
}

// テキストエリアを書く文量によって拡大する関数
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
function getJsonData() {
  // XMLHttpRequestインスタンスを作成
  let request = new XMLHttpRequest();
  // JSONファイルが置いてあるパスを記述
  request.open("GET", "map_data/s3data_1500.json");
  request.send();
  // JSON読み込み時の処理
  request.onreadystatechange = () => {
    // 全てのデータを受信・正常に処理された場合
    if (request.readyState == 4 && request.status == 200) {
      // JSONデータを変換
      let json = JSON.parse(request.responseText);
      json = json["s3"];
      for (let i = 0; i < json.length; ++i) {
        generateStateButton(json[i], 3);
        generateCastleButton(json[i], 3);
        for (var j = 0; j < json[i]["districts"].length; j++) {
          for (var k = 0; k < json[i]["districts"][j]["castles"].length; k++)
            json[i]["districts"][j]["castles"][k]["castleLocation"] = "";
        }
        generateStateButton(json[i], 2);
        generateCastleButton(json[i], 2);
      }
    }
  };
}

// s4マップ用
// TODO getJsonData()に統合
function getS4JsonData() {
  // XMLHttpRequestインスタンスを作成
  let request = new XMLHttpRequest();
  // JSONファイルが置いてあるパスを記述
  request.open("GET", "map_data/s4data_1500.json");
  request.send();
  // JSON読み込み時の処理
  request.onreadystatechange = () => {
    // 全てのデータを受信・正常に処理された場合
    if (request.readyState == 4 && request.status == 200) {
      // JSONデータを変換
      let json = JSON.parse(request.responseText);
      json = json["s4"];
      for (let i = 0; i < json.length; ++i) {
        // console.log(json[i]);
        generateStateButton(json[i], 4);
        generateCastleButton(json[i], 4);
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
  if (version == 4) {
    var divButtons = document.getElementById("state-district-s4");
  } else if (version == 3) {
    var divButtons = document.getElementById("state-district-s3");
  } else {
    var divButtons = document.getElementById("state-district-s2");
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

  if (version == 4) var divButtons = document.getElementById("castle-name-s4");
  else if (version == 3)
    var divButtons = document.getElementById("castle-name-s3");
  else var divButtons = document.getElementById("castle-name-s2");
  divButtons.innerHTML += div_html;
}

window.onload = function () {
  getJsonData();
  getS4JsonData();
};
