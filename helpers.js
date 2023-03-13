const LR = require('./LR')
const fs = require('fs')
const ByteBuffer = require('byte-buffer');


function getResArr (firstPxResponse) {
    var doArr = JSON.parse(firstPxResponse).do;
 
    var newArray;
 
    for (var i = 0; i < doArr.length; i++) {
       var split = doArr[i].split("|", -1);
       newArray = split.slice(1, split.length);
    }
 
    return newArray;
 }
 
 function calcChecksum (i, i2, i3, i4, i5, i6, deviceModel) {
    var calcedChecksum = checksumHelper(checksumHelper(i, i2, i4, i6), i3, i5, i6) ^ getIntFromBytes(deviceModel);
 
    return calcedChecksum;
 }
 
 function getIntFromBytes (deviceModel) {
    var encoder = new TextEncoder();
    var wrappedBytes = new ByteBuffer(encoder.encode(deviceModel));
 
    return wrappedBytes.readInt();
 }
 
 function checksumHelper (i, i2, i3, i4) {
    var i5 = i4 % 10;
    var i6 = i5 != 0 ? i3 % i5 : i3 % 10;
    var i7 = i * i;
    var i8 = i2 * i2;
    switch (i6) {
       case 0:
          return i7 + i2;
       case 1:
          return i + i8;
       case 2:
          return i7 * i2;
       case 3:
          return i ^ i2;
       case 4:
          return i - i8;
       case 5:
          var i9 = i + 783;
          return (i9 * i9) + i8;
       case 6:
          return (i ^ i2) + i2;
       case 7:
          return i7 - i8;
       case 8:
          return i * i2;
       case 9:
          return (i2 * i) - i;
       default:
          return -1;
    }
 }

var helpers = {
    randomOfArray: function(items) {
        return items[Math.floor(Math.random() * items.length)];
    },
    uuidv4: function() {  
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    SHA1Generator: {

        hex_chr: "0123456789abcdef",
  
        hex: function(num) {
           var str = "";
           for (var j = 7; j >= 0; j--)
              str += this.hex_chr.charAt((num >> (j * 4)) & 0x0F);
           return str;
        },
  
  
        str2blks_SHA1: function(str) {
           var nblk = ((str.length + 8) >> 6) + 1;
           var blks = new Array(nblk * 16);
           for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
           for (i = 0; i < str.length; i++)
              blks[i >> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
           blks[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
           blks[nblk * 16 - 1] = str.length * 8;
           return blks;
        },
  
  
        add: function(x, y) {
           var lsw = (x & 0xFFFF) + (y & 0xFFFF);
           var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
           return (msw << 16) | (lsw & 0xFFFF);
        },
  
  
        rol: function(num, cnt) {
           return (num << cnt) | (num >>> (32 - cnt));
        },
  
  
        ft: function(t, b, c, d) {
           if (t < 20) return (b & c) | ((~b) & d);
           if (t < 40) return b ^ c ^ d;
           if (t < 60) return (b & c) | (b & d) | (c & d);
           return b ^ c ^ d;
        },
  
  
        kt: function(t) {
           return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
              (t < 60) ? -1894007588 : -899497514;
        },
  
        calcSHA1FromByte: function(byteArr) {
           var str = '';
           for (var i = 0; i < byteArr.length; i++)
              str += String.fromCharCode(byteArr[i]);
           return this.calcSHA1(str);
        },
  
  
        calcSHA1: function(str) {
           if (str != '') {
              var x = this.str2blks_SHA1(str);
              var w = new Array(80);
  
              var a = 1732584193;
              var b = -271733879;
              var c = -1732584194;
              var d = 271733878;
              var e = -1009589776;
  
              for (var i = 0; i < x.length; i += 16) {
                 var olda = a;
                 var oldb = b;
                 var oldc = c;
                 var oldd = d;
                 var olde = e;
  
                 for (var j = 0; j < 80; j++) {
                    if (j < 16) w[j] = x[i + j];
                    else w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    t = this.add(this.add(this.rol(a, 5), this.ft(j, b, c, d)), this.add(this.add(e, w[j]), this.kt(j)));
                    e = d;
                    d = c;
                    c = this.rol(b, 30);
                    b = a;
                    a = t;
                 }
  
                 a = this.add(a, olda);
                 b = this.add(b, oldb);
                 c = this.add(c, oldc);
                 d = this.add(d, oldd);
                 e = this.add(e, olde);
              }
              return this.hex(a) + this.hex(b) + this.hex(c) + this.hex(d) + this.hex(e);
           } else {
              return '';
           }
        }
    },
    getBytes: function(str) {
        var bytes = [];
  
        for (var i = 0; i < str.length; ++i) {
           bytes.push(str.charCodeAt(i));
        }
  
        return bytes
     },
     randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
     },
     USB: function(str) {
        if(str == "charging") {
            var ChargerArr = ['AC', 'USB']
            return ChargerArr[Math.floor(Math.random() * ChargerArr.length)]
        } else {
            if(str != "charging") {
                return "None"
            }
        }
    },
    getNeededComponents: function(str) {
        var VID = LR.get(str, "vid|", "|")[0]
        var appcComp = /(?<=appc\|2\|.*\|)(.*)(?=\|.*\|.*\|.*\|.*\|.*\|.*)/gm.exec(str)[0]
        var SID = LR.get(str, "sid|", '"')[0]
        var appcTwo = LR.get(str, "appc|1|", "|")[0]
        return [VID, appcComp, SID, appcTwo]
    },
    Base64Encode: function(str) {
        var strBuffer = new Buffer.from(JSON.stringify(str));
        var encoded = strBuffer.toString('base64')
        return encoded
    },
    Base64Decode: function(str) {
        var PayloadBuffer = new Buffer.from(str);
        var base64Encoded = PayloadBuffer.toString('ascii')
        var EncodedBuff = new Buffer.from(base64Encoded, 'base64');
        var finalStr = EncodedBuff.toString('ascii');
        return finalStr;
    },
    getPx257: function(firstPxResponse, deviceModel) {
        var resArr = getResArr(firstPxResponse);
    
        var finalRes = calcChecksum(parseInt(resArr[5]), parseInt(resArr[6]), parseInt(resArr[7]), parseInt(resArr[3]), parseInt(resArr[4]), parseInt(resArr[8]), deviceModel);
    
        return [finalRes, resArr[1]];
     }
}




module.exports = helpers;