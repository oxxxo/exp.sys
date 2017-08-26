function chunkString(str, length) {
  if (length>=str.length)
  {
	var tmpArray = []
	tmpArray.push(str);
	return tmpArray;
  }
  else
  {
  	return str.match(new RegExp('.{1,' + length + '}', 'g'));	
  }
  
}


//Convierte el texto m a n bytes y retorna un BigInteger
function stringToNumbers(s, n)
{
  if(n < s.length + 11) { // TODO: fix for utf-8
    throw new Error("Message too long for RSA");
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

function numbersToString(d,n){
  var b = d.toByteArray();
  console.log("byte array length:", b);
  var i = 0;
  while(i < b.length && b[i] == 0) ++i;
  if(b.length-i != n-1 || b[i] != 2){
    console.log("First null");
    return null;
  }
  ++i;
  while(b[i] != 0)
    if(++i >= b.length){
      console.log("Second null;")
      return null;
    } 
  var ret = "";
  while(++i < b.length) {
    var c = b[i] & 255;
    if(c < 128) { // utf-8 decode
      ret += String.fromCharCode(c);
    }
    else if((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (b[i+1] & 63));
      ++i;
    }
    else {
      ret += String.fromCharCode(((c & 15) << 12) | ((b[i+1] & 63) << 6) | (b[i+2] & 63));
      i += 2;
    }
  }
  return ret;
}

function stringToByteArray(str){
	var bytes = [];

	for (var i = 0; i < str.length; ++i) {
	    bytes.push(str.charCodeAt(i));
	}
	return bytes;
}