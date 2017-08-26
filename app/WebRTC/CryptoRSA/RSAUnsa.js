/*
	RSA implementation by Jair Huaman Canqui
	Universidad Nacional de San Agustin
	Using https://github.com/andyperlitch/jsbn for Large-number math in pure Javascript
	Using http://stackoverflow.com/questions/16680631/how-do-i-encrypt-crypto-js-keys-with-jsbn for Text to Numbers
*/


//RSA Constructor
function RSA(){
	this.n = null;
	this.e = 0;
	this.d = null;
	this.p = null;
	this.q = null;
	this.split = 0;
	this.arrayNumber = [];
	this.arrayString = [];
	this.arrayEncrypted = [];
}


/*
	@param B Numero de bits para generar la clave publica
	@param E Exponente de clave publica
*/	

RSA.prototype.generateKeys = function(b, e){
	var rng = new SecureRandom();
	var qs = b>>1; //qs almacenara la mitad del numero de bits b
	this.e = parseInt(e);
	var ee = new BigInteger(e);
	while (true)
	{
		//Buscando p y q primos aleatorios
		while (true){
			this.p = new BigInteger(b-qs, 1, rng);
			if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10))
			{
				break;
			}
		}
		while (true){
			this.q = new BigInteger(qs,1,rng);
      		if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10))
      		{
      			break;	
      		} 
		}
		if (this.p.compareTo(this.q) <= 0){
			//Intercambiar p y q
			var temp = this.p;
			this.p = this.q;
			this.q = temp;
		}
		var pminus1 = this.p.subtract(BigInteger.ONE);
    	var qminus1 = this.q.subtract(BigInteger.ONE);
    	var phi = pminus1.multiply(qminus1); //Funcion de euler
    	//var MCD = phi.gcd(ee); //Maximo comun divisor
    	if (phi.gcd(ee).compareTo(BigInteger.ONE)==0) //MCD == 1
    	{
    		this.n = this.p.multiply(this.q);
    		this.d = ee.modInverse(phi);
    		break;
    	}
	}

}

RSA.prototype.setPublicKey = function(n, e){
	if (n && e)
	{
		this.n = new BigInteger(n);
		this.e = parseInt(e);
	}
}

RSA.prototype.setPrivateKey = function(n, d) {
	if (n && d){
		this.n = new BigInteger(n);
		this.d = new BigInteger(d);
	}	
};

//Devuelve un texto encriptado
RSA.prototype.encrypt = function(text) {

	this.split = Math.ceil((text.length+11) / ((this.n.bitLength()+7)>>3)); //Partir el texto en partes computables
	console.log(this.split);

	this.arrayString = chunkString(text, ((this.n.bitLength()+7)>>3)-11);
	for (var i = 0 ; i < this.arrayString.length; i++) {
		var m = stringToNumbers(this.arrayString[i], (this.n.bitLength()+7)>>3);
		var c = m.modPowInt(this.e, this.n);
		this.arrayNumber.push(m);
		this.arrayEncrypted.push(c);
	}
	
	var c =  this.arrayEncrypted.join("");
	return c;
}

/*
//Devuelve un texto encriptado
RSA.prototype.encrypt = function(text) {
	var m = stringToNumbers(text, (this.n.bitLength()+7)>>3);
	if (!m){
		return null;
	}
	else{
		//Encriptar, c almacena el mensaje cifrado (Ciphertext)
		var c = m.modPowInt(this.e, this.n);
		if (!c){
			return null;
		}
		else{
			return c;
		}
	}
};
*/

RSA.prototype.decrypt = function(arrayEncrypted){
	var decryptedText = "";
	for (var i = 0; i < arrayEncrypted.length; i++) {
		var c = arrayEncrypted[i];
		var m = c.modPow(this.d, this.n);
		decryptedText += numbersToString(m, (this.n.bitLength()+7)>>3);
	}
	return decryptedText;

}


/*
RSA.prototype.decrypt = function(ciphertext,){

	var c = new BigInteger(ciphertext);
	var m = c.modPow(this.d, this.n);
	if (!m) {
		return null;
	} else {
		return numbersToString(m, (this.n.bitLength()+7)>>3);
	}
}
*/


RSA.prototype.cleanBase = function(){
	this.split = 0;
	this.arrayNumber = [];
	this.arrayString = [];
	this.arrayEncrypted = [];
}
