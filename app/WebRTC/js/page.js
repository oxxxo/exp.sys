function startMessaging() {
  $('#chat').show();
  $('#wrap').show();
  $('#input_group').hide();
}

$(window).load(function() {
  $('#connectbox').show();
  $('#wrap').hide();
// submit form by CTRL+ENTER
var t = document.getElementsByTagName('textarea');
var i = 0;
while(t[i]){
    if(/ctrlSubmit/.test(t[i].className)){
        t[i].onkeyup = function(e){
            e = window.event || e;
            if(e.keyCode == 13 && e.ctrlKey){
         $('#send').trigger('submit');
            }
        }
    }
    ++i;
}
});