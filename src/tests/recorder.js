'use strict';

/* globals MediaRecorder */

// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


if(getBrowser() == "Chrome"){
	var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };//Chrome
}else if(getBrowser() == "Firefox"){
	var constraints = {audio: true,video: {  width: { min: 640, ideal: 640, max: 640 },  height: { min: 480, ideal: 480, max: 480 }}}; //Firefox
}

//var recBtn = document.querySelector('button#rec');
//var pauseResBtn = document.querySelector('button#pauseRes');
//var stopBtn = document.querySelector('button#stop');

var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');

videoElement.controls = false;

function errorCallback(error){
	console.log('navigator.getUserMedia error: ', error);	
}

/*
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var sourceBuffer;
*/

var mediaRecorder;
var chunks = [];
var count = 0;

function startRecording(stream) {
	console.log('Start recording...');
	if (typeof MediaRecorder.isTypeSupported == 'function'){
		/*
			MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
		*/
		if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
		  var options = {mimeType: 'video/webm;codecs=h264'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		  var options = {mimeType: 'video/webm;codecs=vp9'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
		  var options = {mimeType: 'video/webm;codecs=vp8'};
		}
		console.log('Using '+options.mimeType);
		mediaRecorder = new MediaRecorder(stream, options);
	}else{
		console.log('Using default codecs for browser');
		mediaRecorder = new MediaRecorder(stream);
	}

	// pauseResBtn.textContent = "Pause";

	mediaRecorder.start(10);

	var url = window.URL || window.webkitURL;
	videoElement.srcObject = stream;
	videoElement.play();

	mediaRecorder.ondataavailable = function(e) {
		//console.log('Data available...');
		//console.log(e.data);
		//console.log(e.data.type);
		//console.log(e);
		chunks.push(e.data);
	};

	mediaRecorder.onerror = function(e){
		console.log('Error: ', e);
	};


	mediaRecorder.onstart = function() {
		console.log('Started & state = ' + mediaRecorder.state);
	};

	mediaRecorder.onstop = function(){
		console.log('Stopped & state = ' + mediaRecorder.state);

		var blob = new Blob(chunks, {type: "video/webm"});

		lastDropboxFileId = "1234567";
		if(lastDropboxFileId) {
			var formData = new FormData();
			formData.append('blob', blob, 'video.webm');

			fetch(`/records/sdmt/${lastDropboxFileId}/video`, {
				method: 'POST',
				body: formData
			}).then(res => {
				if (res.ok) {
					console.log('Uploaded video successfully!');
				} else {
					console.error('SDMT video could not be saved! Dropbox id:' + lastDropboxFileId);
				}
			});
		}

		var videoURL = window.URL.createObjectURL(blob);

		videoElement.srcObject = null;
		videoElement.src = videoURL;

		// downloadLink.innerHTML = 'Download video file';

		var name  = (lastDropboxFileId || testStartDate) +".webm" ;

		if(downloadLink) {
			downloadLink.href = videoURL;
			downloadLink.setAttribute("download", name);
			downloadLink.setAttribute("name", name);
		}

		mediaRecorder.stream.getTracks() // get all tracks from the MediaStream
			.forEach( track => track.stop() ); // stop each of them

		chunks = [];
	};

	mediaRecorder.onpause = function(){
		console.log('Paused & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onresume = function(){
		console.log('Resumed  & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onwarning = function(e){
		console.log('Warning: ' + e);
	};
}

//function handleSourceOpen(event) {
//  console.log('MediaSource opened');
//  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
//  console.log('Source buffer: ', sourceBuffer);
//}

function onBtnRecordClicked (){
	 if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
		alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	}else {
		navigator.getUserMedia(constraints, startRecording, errorCallback);
		// recBtn.disabled = true;
		// pauseResBtn.disabled = false;
		// stopBtn.disabled = false;
	}
}

function onBtnStopClicked(){
	mediaRecorder.stop();
	videoElement.controls = true;

	// recBtn.disabled = false;
	// pauseResBtn.disabled = true;
	// stopBtn.disabled = true;
}

function onPauseResumeClicked(){
	// if(pauseResBtn.textContent === "Pause"){
	// 	console.log("pause");
	// 	pauseResBtn.textContent = "Resume";
	// 	mediaRecorder.pause();
	// 	stopBtn.disabled = true;
	// }else{
	// 	console.log("resume");
	// 	pauseResBtn.textContent = "Pause";
	// 	mediaRecorder.resume();
	// 	stopBtn.disabled = false;
	// }
	// recBtn.disabled = true;
	// pauseResBtn.disabled = false;
}


function log(message){
	//dataElement.innerHTML = dataElement.innerHTML+'<br>'+message ;
}



//browser ID
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	return browserName;
}
