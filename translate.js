var dictionary = {
  age: { tr: "Yaş", en: "Age"},
  sex: { tr: "Cinsiyet", en: "Sex"},
  male: { tr: "Erkek", en: "Male"},
  female: { tr: "Kadın", en: "Female"},
  image_test: { tr: "Resim Testi", en: "Image Test"},
  stroop_test: { tr: "Stroop Testi", en: "Stroop Test"},
  countdown_test: { tr: "Geri Sayım Testi", en: "Countdown Test"},
  color: { tr: "Renk", en: "Color"},
  word: { tr: "Kelime", en: "Word"},
  btnStart: { tr: "Teste Başla", en: "Start Test"},
  btnStop: { tr: "Durdur", en: "Stop"},
  eda_File: { tr: "EDA Dosyası :", en: "EDA File :"},
  acc_File: { tr: "ACC Dosyası :", en: "ACC File :"},
  record_File: { tr: "Kayıt Dosyası :", en: "Record File :"},
  answerRed: { tr: "Kırmızı (1)", en: "Red (1)"},
  answerYellow: { tr: "Sarı (2)", en: "Yellow (2)"},
  answerGreen: { tr: "Yeşil (8)", en: "Green (8)"},
  answerBlue: { tr: "Mavi (9)", en: "Blue (9)"},
  adjust_Time_Mode: { tr: "Zaman Ayarlama Modu :", en: "Adjust Time Mode :"},
  adjustTimeModeOn: { tr: "Açık", en: "On"},
  adjustTimeModeOff: { tr: "Kapalı", en: "Off"},
  rest: { tr: "Dinlenme", en: "Rest"},
  substract: { tr: "Çıkarma", en: "Substact"},
  multiply: { tr: "Çarpma", en: "Multiply"}
};

function setTextForLang(lang) {
  Object.keys(dictionary).forEach(key => {
    var doc = document.getElementById(key)
    doc && (doc.innerText = dictionary[key][lang]);
  });
}

var langParam = new URL(location.href).searchParams.get('lang');

if(langParam && (langParam == 'tr' || langParam == 'en')) {
  setTextForLang(langParam);

  console.log("hey");

  //Set test links
  var imageTestLinkElement = document.getElementById("imageTestLink");
  imageTestLinkElement && (imageTestLinkElement.href = "imageTest.html" + "?lang=" + langParam);

  var stroopTestLinkElement = document.getElementById("stroopTestLink");
  stroopTestLinkElement && (stroopTestLinkElement.href = "stroopTest.html" + "?lang=" + langParam);

  var countdownTestLinkElement = document.getElementById("countdownTestLink");
  countdownTestLinkElement && (countdownTestLinkElement.href = "countdownTest.html" + "?lang=" + langParam);
}

function setLang(lang) {
  var url = new URL(location.href);
  url.searchParams.set('lang', lang);
  location.href = url.href;
}
