// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

// notification
function notifyMe() {
  var notification = new Audio('sounds/notification.mp3');
  notification.play();
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('EncryptedChat', {
      icon: 'images/encrypted.png',
      body: decryptedMsg.plaintext.replace(/([^>])\n/g, '$nbsp'),
    });
  }
}

// functions
function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function encode(str) {
    return encodeURIComponent(escape(str));
}


function decode(str) {
    return unescape(decodeURIComponent(str))

}

//To download files

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// main
var file=null;
var encryptedFile="";
var messageEncrypted = "";
var publicExponent = "65537";
var n;
var d;
var p;
var q;
var anotherPeerId;
var anotherId;
var RSAChat;
var Bits = "512";


$('#connect').click(function() {

	anotherId = $('#another_id').val().split(','); // split string to array to get real id and Keys

  anotherPeerId = anotherId[0]; // real id 
  n = anotherId[1];
  d = anotherId[2];

});  

/*
// Connect to PeerJS, have server assign an ID instead of providing one
// Showing off some of the configs available with PeerJS :).
*/
var peer = new Peer({host: 'localhost', port: 9000, debug:3, logFunction: function(){ var copy = Array.prototype.slice.call(arguments).join(' '); }});

var connectedPeers = {};
// Show this peer's ID.
peer.on('open', function(id){
	if (typeof vars.id == 'undefined') {
  $('#own_id').val(id + ',' + n + ","+ d);
}
});
// Await connections from others
peer.on('connection', connect);
peer.on('error', function(err) {
  console.log(err);
})
// Handle a connection object.
function connect(c) {
  startMessaging();

  // Handle a chat connection.
  if (c.label === 'chat') {
    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
    var messages = $('<div><em class="notification">La Conversación inicio, Alguien se conecto a usted...</em></div>').addClass('messages');
    chatbox.append(messages);
 
    // Select connection handler.
    chatbox.on('click', function() {
      if ($(this).attr('class').indexOf('active') === -1) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    $('.filler').hide();
    $('#connections').append(chatbox);
    c.on('data', function(data) {
    	// Decrypt data (message)
      console.log("DATA!!!!!!:");
      console.log(data);  
      var dataBigInt = data.split(",");
      for (var i = 0; i < dataBigInt.length; i++) {
        dataBigInt[i] = new BigInteger(dataBigInt[i]);
      }
      RSAChat.setPrivateKey(n, d);
      console.log("n:", n);
      console.log("d:", d);
      decryptedMsg = {};
      //decryptedMsg.plaintext = RSAChat.decrypt(dataBigInt);
      decryptedMsg.plaintext = data;
      console.log("Decrypted text");
      messages.append('<li><div class="message_block partner"><span class="date">' + (new Date()).getHours() + ':' + addZero(new Date().getMinutes()) + '</span> <span class="peer">Socio</span><div class="message">' + decryptedMsg.plaintext.replace(/([^>])\n/g, '$1<br/>') +
        '</div></div></li>');
      // play notification
      notifyMe();

        });
        c.on('close', function() {
          alert('La otra persona salio de la conversación, Volviendo al inicio...');
          $('.chat').hide();
          if ($('.connection').length === 0) {
            $('.filler').show();
          }
          delete connectedPeers[c.peer];
          window.location.replace("http://localhost/rsa");
        });
  } 
  connectedPeers[c.peer] = 1;
}
$(document).ready(function() {
    //Geeting RSA
  RSAChat = new RSA();
  RSAChat.generateKeys(parseInt(Bits),publicExponent);
  //Setting PublicKey from RSA generated
  n = RSAChat.n.toString();
  d = RSAChat.d.toString();
  p = RSAChat.p.toString();
  q = RSAChat.q.toString();

  function doNothing(e){
    e.preventDefault();
    e.stopPropagation();
  }
  // Connect to a peer
  $('#connect').click(function() {
  if (vars.id != '') {
    var requestedPeer = anotherPeerId;
    if (!connectedPeers[requestedPeer]) {
      // Create connection
      var c = peer.connect(requestedPeer, {
        label: 'chat',
        serialization: 'none',
        metadata: {message: 'Hola, quiero hablar contigo!'}
      });
      c.on('open', function() {
        connect(c);
      });
      c.on('error', function(err) { alert(err); });
    connectedPeers[requestedPeer] = 1;
  }}});
  // Close a connection.
  $('#close').click(function() {
    eachActiveConnection(function(c) {
      c.close();
    });
  });

  //Encrypt a File
  $("#encryptFile").click(function(){
    var reader = new FileReader();
    reader.onload = function(){
      var textEncrypted = reader.result;
      var node = document.getElementById('outputEncrypted');
      node.innerHTML = textEncrypted;
      console.log(reader.result.substring(0,20));

      var rsa = new RSA();
      rsa.setPublicKey(n,publicExponent);
      rsa.setPrivateKey(n,d);
      var res = rsa.encrypt(textEncrypted);
      textEncrypted = rsa.arrayEncrypted;
      download("encrypted.txt",textEncrypted.join(","));
    };
    reader.readAsText(file);
  });

  $("#decryptFile").click(function(){
    var reader = new FileReader();
    reader.onload = function(){
      var textEncrypted = reader.result;
      var node = document.getElementById('outputEncrypted');
      node.innerHTML = textEncrypted;
      console.log(reader.result.substring(0,20));
      var dataBigInt = textEncrypted.split(",");
      for (var i = 0; i < dataBigInt.length; i++) {
        dataBigInt[i] = new BigInteger(dataBigInt[i]);
      }
      RSAChat.setPrivateKey(n, d);
      decryptedText = RSAChat.decrypt(dataBigInt);
      download("decrypted.txt", decryptedText);
    };
    reader.readAsText(file);
  });

  //Handle change select file
  $('input[type="file"]').change(function(e){
    file = e.target.files[0];
    alert('The file "' + file.name +  '" has been selected.');
  });


  // Send a chat message to all active connections
  $('#send').submit(function(e) {
    e.preventDefault();    // For each active connection, send the message.
    var msg = $('#msg').val();

    if (msg != '' && msg != ' ') {

    eachActiveConnection(function(c, $c) {
      if (c.label === 'chat') {

        var rsa = new RSA();
        rsa.setPublicKey(n,publicExponent);
        rsa.setPrivateKey(n,d);
        var res = rsa.encrypt(msg);

        //RSAChat.setPublicKey(n, e);
        //RSAChat.setPrivateKey(n, d);
        //var encryptedMsg = {};
        //encryptedMsg.cipher = RSAChat.encrypt(msg);
        messageEncrypted = rsa.arrayEncrypted;
        console.log("Sending...");
        console.log(messageEncrypted.join(","));
        if (res){
          c.send(messageEncrypted.join(","));
        }
        else{
          console.log("Error Encripando en #send");
        }

        console.log("n:", n);
        console.log("d:", d);
        $c.find('.messages').append('<li><div class="message_block you"><span class="date">' + (new Date()).getHours() + ':' + addZero(new Date().getMinutes()) + '</span> <span class="me">Yo</span><div class="message">' + escapeHtml(msg).replace(/([^>])\n/g, '$1<br/>')
          + '</div></div></li>');
      }
    });
  }
    $('#msg').val('');
    $('#msg').focus();
  });
  // Goes through each active peer and calls FN on its connections.
  function eachActiveConnection(fn) {
    var actives = $('.active');
    var checkedIds = {};
    actives.each(function() {
      var peerId = $(this).attr('id');
      if (!checkedIds[peerId]) {
        var conns = peer.connections[peerId];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var conn = conns[i];
          fn(conn, $(this));
        }
      }
      checkedIds[peerId] = 1;
    });
  }
});
// Make sure things clean up properly.
window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};
