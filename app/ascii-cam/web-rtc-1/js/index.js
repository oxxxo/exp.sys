var captureBtn = document.getElementById('capture');
var video = document.getElementById('video');

// Cross browser checks
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

captureBtn.addEventListener('click', function(){
  if(navigator.getUserMedia){
  	navigator.getUserMedia({video:true}, onGumSuccess, onGumFailure);
  }
  else{
    // Sorry not supported, but enjoy this great film!
    video.src = 'http://video.webmfiles.org/big-buck-bunny_trailer.webm';
    video.classList.add('show');
  }
}, false);


onGumSuccess = function(stream) {
	var url = window.URL.createObjectURL(stream);
  video.src = url;
  video.classList.add('show');
};
  
onGumFailure = function(){
	alert('unable to get usermedia');
};