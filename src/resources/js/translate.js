var dictionary = {
  age: { tr: "Yaş", en: "Age"},
  sex: { tr: "Cinsiyet", en: "Sex"},
  male: { tr: "Erkek", en: "Male"},
  female: { tr: "Kadın", en: "Female"},
  image_test: { tr: "Resim Testi", en: "Image Test"},
  stroop_test: { tr: "Stroop Testi", en: "Stroop Test"},
  countdown_test: { tr: "Geri Sayım Testi", en: "Countdown Test"},
  vr_image_test: { tr: "Sanal Gerçeklik Resim Testi", en: "VR Image Test"},
  color: { tr: "Renk", en: "Color"},
  word: { tr: "Kelime", en: "Word"},
  btnStart: { tr: "Teste Başla", en: "Start Test"},
  btnStop: { tr: "Durdur", en: "Stop"},
  lblInterval: { tr: "Aralık", en: "Interval: "},
  lblCount: { tr: "Adet", en: "Count: "},
  lblClientId: { tr: "Kullanıcı ID: ", en: "Client ID: "},
  btnLoadRecords: { tr: "Yükle", "en": "Load"},
  eda_File: { tr: "EDA Dosyası :", en: "EDA File :"},
  acc_File: { tr: "ACC Dosyası :", en: "ACC File :"},
  record_File: { tr: "Kayıt Dosyası :", en: "Record File :"},
  answerRed: { tr: "Kırmızı (1)", en: "Red (1)"},
  answerYellow: { tr: "Sarı (2)", en: "Yellow (2)"},
  answerGreen: { tr: "Yeşil (8)", en: "Green (8)"},
  answerBlue: { tr: "Mavi (9)", en: "Blue (9)"},
  adjust_Time_Mode: { tr: "Zaman Ayarlama Modu :", en: "Adjust Time Mode :"},
  adjust_Time_Mode_On: { tr: "Açık", en: "On"},
  adjust_Time_Mode_Off: { tr: "Kapalı", en: "Off"},
  rest: { tr: "Dinlenme", en: "Rest"},
  substract: { tr: "Çıkarma", en: "Substact"},
  multiply: { tr: "Çarpma", en: "Multiply"},
  download: { tr: "İndir", en: "Download"},
  downloadVideo: { tr: "İndir (Video)", en: "Download (Video)"},
  downloadMetadata: { tr: "İndir (Metaveri)", en: "Download (Metadata)"}
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

  //Set test links
  var imageTestLinkElement = document.getElementById("imageTestLink");
  imageTestLinkElement && (imageTestLinkElement.href = "tests/imageTest.html" + "?lang=" + langParam);

  var stroopTestLinkElement = document.getElementById("stroopTestLink");
  stroopTestLinkElement && (stroopTestLinkElement.href = "tests/stroopTest.html" + "?lang=" + langParam);

  var countdownTestLinkElement = document.getElementById("countdownTestLink");
  countdownTestLinkElement && (countdownTestLinkElement.href = "tests/countdownTest.html" + "?lang=" + langParam);
}

function setLang(lang) {
  var url = new URL(location.href);
  url.searchParams.set('lang', lang);
  location.href = url.href;
}
