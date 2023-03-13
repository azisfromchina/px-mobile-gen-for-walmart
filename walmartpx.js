var express = require("express");
var bodyParser = require("body-parser");
const date = require('date-and-time');
const PORT = process.env.PORT || 4278;
const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
var btoa = require('btoa');
var atob = require('atob');
const LR = require('./LR.js')
var colors = require("colors");
var randomCountry = require('random-country');
const deviceData = require('./deviceData.json');
const crypto = require("crypto");
const long = require('long');
const guid = require('./guid.js');
const helpers = require('./helpers')

function randomOfArray(items){
    return items[Math.floor(Math.random() * items.length)];
}

var app = express();
app.use(
   bodyParser.json({
      type: "application/*+json",
   })
);
var jsonParser = bodyParser.json();
app.disable('x-powered-by');

var statusofbattery = ['charging','discharging','not charging','full']
var batterystatus = ["good"]
var pluggedornot = ["None", "AC", "USB"]




function randomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
}


function Hash(input) // Sha1 Hash
{
    return sha1(input);
}

function String_To_Int(string)
{
    var bytes = [];

    for (var i = 0; i < string.length; ++i)
    {
        bytes.push(string.charCodeAt(i));
    }

    return Array_To_Int(bytes);
}

function Array_To_Int(array)
{
    return SwapEndian(BitConverterToInt(array));
}

function BitConverterToInt(array)
{
    return (array[0] | array[1]<<8 | array[2] << 16 | array[3] << 24) >>> 0;
}

function SwapEndian(val) { // Big / Small Endian Byte Read Method
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}

function Pars(source, first, last)
{
    return source.match(new RegExp(first + "(.*)" + last))[1];
}

function Solve_Challenge_And(Arg0, Arg1, Arg2, Arg3, Arg4, Arg5, Model)
{
    return InternalChallenge(InternalChallenge(Arg0, Arg1, Arg3, Arg5), Arg2, Arg4, Arg5) ^ String_To_Int(Model);
}

function InternalChallenge(Arg1, Arg2, Arg3, Arg4)
{
    V4 = Arg4 % 10;
    V3 = V4 == 0 ? Arg3 % 10 : Arg3 % V4;
    V4_1 = Arg1 * Arg1;
    V0 = Arg2 * Arg2;
    switch(V3)
    {
        case 0:
            break;
        case 1:
            return Arg1 + V0;
        case 2:
            return V4_1 * Arg2;
        case 3:
            return Arg1 ^ Arg2;
        case 4:
            return Arg1 - V0;
        case 5:
            V1 = Arg1 + 0x30F;
            return V1 * V1 + V0;
        case 6:
            return (Arg1 ^ Arg2) + Arg2;
        case 7:
            return V4_1 - V0;
        case 8:
            return Arg1 * Arg2;
        case 9:
            return Arg2 * Arg1 - Arg1;
        default:
            return -1;
    }

    return V4_1 + Arg2;
}

function NextBool()
{
    return Math.random() < 0.5;
}

function random_item(items)
{
return items[Math.floor(Math.random()*items.length)];   
}

var bat_per1 = ['100','90','84','80', '92', '40', '50', '60', '74', '44', '59']

var bat_temp = [30,31,32,33,34,28,29,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,10,15,25,14,3,13,4,2,6,7,8,9,1,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70]
var bat_temper = random_item(bat_temp) / 10.0

const GenerateSHA1 = data => crypto.createHash("sha1").update(data).digest('hex').toUpperCase();

function IntFuckery(i, i2, i3, i4) {
    let i5 = i4 % 10;
    let i6 = i5 != 0 ? i3 % i5 : i3 % 10;
    let i7 = i * i;
    let i8 = i2 * i2;
    switch(i6) {
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
            let i9 = i + 783;
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

function ToInt32(buffer) {
    return (buffer[0] | buffer[1]<<8 | buffer[2] << 16 | buffer[3] << 24) >>> 0;
}

function ChallengeResponse(DeviceName, i, i2, i4, i3, i5, i6) {
    let a = Buffer.from(DeviceName);
    let b = ToInt32(a.slice(0,4).reverse(), 0);
    return IntFuckery(IntFuckery(i, i2, i4, i6), i3, i5, i6) ^ b;
}

function GenerateMostSigBytes(UnixTime) {
    let finalval = long.fromNumber(UnixTime).multiply(10000).multiply(long.fromNumber(122192928000000000)); 
    let a = finalval.and(long.fromNumber(-281474976710656)).shiftRightUnsigned(48);
    let b = finalval.shiftLeft(32);
    let c = long.fromNumber(281470681743360).and(finalval).shiftRightUnsigned(16);
    return a.or(b).or(4096).or(c).toString()
}

function GenerateLeastSigBytes() {
    let RetardedBitwiseShit = long.MIN_VALUE;
    let b = Array.from(crypto.randomBytes(4));

    let j2 = RetardedBitwiseShit.or(long.fromNumber(b[0] << 24).and(long.fromNumber(4278190080)));
    let j3 = j2.or((b[1] << 16) & 16711680);
    let j4 = j3.or((b[2] << 8) & 65280);
    let j = j4.or(b[3] & -1);

    return j.or(long.fromNumber(Math.random() * 16383.0).shiftLeft(48)).toString();
}

function GeneratePXUUID(mostSignificantBits, leastSignificantBits) {
    let uuidMostSignificantBytes = long.fromString(mostSignificantBits).toBytes().reverse();

    let uuidLeastSignificantBytes = long.fromString(leastSignificantBits).toBytes().reverse();

    let map = [
        uuidMostSignificantBytes[4],
        uuidMostSignificantBytes[5],
        uuidMostSignificantBytes[6],
        uuidMostSignificantBytes[7],
        uuidMostSignificantBytes[2],
        uuidMostSignificantBytes[3],
        uuidMostSignificantBytes[0],
        uuidMostSignificantBytes[1],
        uuidLeastSignificantBytes[7],
        uuidLeastSignificantBytes[6],
        uuidLeastSignificantBytes[5],
        uuidLeastSignificantBytes[4],
        uuidLeastSignificantBytes[3],
        uuidLeastSignificantBytes[2],
        uuidLeastSignificantBytes[1],
        uuidLeastSignificantBytes[0]
    ];

    return guid(Buffer.from(map).toString('hex'))
}


function makeuuid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var voltage_type = 12 

var battttttt = [4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5]


var carriers = ['T-Mobile', 'Vodafone', 'Msg2Send','Mobitel','Cequens','Vodacom','MTN','Meteor','Android','Movistar','Swisscom','Orange','Unite','Oxygen8','Txtlocal','TextOver','Virgin-Mobile','Aircel','AT&T','Cellcom','BellSouth','Cleartalk','Cricket','DTC','nTelos','Esendex','Kajeet','LongLines','MetroPCS','Nextech','SMS4Free','Solavei','Southernlinc','Sprint','Teleflip','Unicel','Viaero','UTBox']

function random(min, max) {
  return ~~(Math.random() * (max - min + 1) + min);
}

function randomInRange(min, max) {
  return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

app.get('/payload', jsonParser, function(req, res, next) {
   var post = req.query.post;
   var appId = req.query.appId;
   var appname = req.query.appName;
   var bundle = req.query.bundleId;
   var pxVersion = req.query.sdkVer;
   var appVersion = req.query.appVersion;
   var _toSendBack = req.query.toSendBack;
   var firstResponseEncoded = req.query.encodedRes;

   try {
      if (parseInt(post) == 1) {
         //var bat_level = randomInt(1, 100);
         var APP_ACTIVE_TIME_INTERVAL = randomInt(10000, 70000);
         var connection_type = NextBool() ? "3G" : "4G";

         var PX1214 = makeuuid(16)

         let now = new Date();
         let unixTimeMilliseconds = now.getTime();
         let PXUUID = GeneratePXUUID(GenerateMostSigBytes(unixTimeMilliseconds), GenerateLeastSigBytes());

         let unixTimeMilliseconds2 = now.getTime();
         let PXURLUUID = GeneratePXUUID(GenerateMostSigBytes(unixTimeMilliseconds2), GenerateLeastSigBytes());

         let unixTimeMilliseconds3 = now.getTime();
         let getuuid_sensor = GeneratePXUUID(GenerateMostSigBytes(unixTimeMilliseconds3), GenerateLeastSigBytes());

         var splitted_PX327 = getuuid_sensor.split('-');

         const PX327 = splitted_PX327[0].toString().toUpperCase();

         let fingerprint = randomOfArray(deviceData.fingerprints);

         var SCREEN_WIDTH = fingerprint[0]
         var SCREEN_HEIGHT = fingerprint[1]
         var PX318 = fingerprint[2]
         var android_version1 = fingerprint[3]
         var model = fingerprint[4]
         var brand = fingerprint[5]

         var PX350 = randomInt(10, 250)


         var deviceinfo = `${model}${PXUUID}${PX327}`

         var finger3 = Hash(deviceinfo).toUpperCase();
         var current_time_stamp = Math.floor(new Date().getTime() / 1000)
         var country = randomCountry()


         let battery_voltage = random_item(battttttt)

         //var voltage = (Math.random() * (0.003 - 0.006) + 0.006).toFixed(3)

         let voltage = battery_voltage.toFixed(3)

         let carrier = random_item(carriers)
         var PX413 = helpers.randomOfArray(["good"])
         var PX414 = helpers.randomOfArray(["charging", "discharging", "not charging", "full"])
         var PX415 = helpers.randomInt(25, 95)
         var PX416 = helpers.USB(PX414)
         console.log(PX416)

         var PX4181 = randomInRange(20.00, 35.00)
         var PX418 = PX4181.toFixed(2)
         var collection_time_1 = helpers.randomInt(100, 5000)


        
        var dogshit = helpers.USB(PX414)
        console.log(dogshit)

        let payload_123 = '[{"t":"PX315","d":{"PX1214":"'+
        ''+PX1214+
        ''+'","PX91":'+
        ''+SCREEN_WIDTH+
        ''+',"PX92":'+
        ''+SCREEN_HEIGHT+
        ''+`,"PX316":true,"PX318":"${PX318}","PX319":"${android_version1}","PX320":"${model}","PX339":"${brand}","PX321":"${model}","PX323":${current_time_stamp},"PX322":"Android","PX337":true,"PX336":true,"PX335":true,"PX334":true,"PX333":true,"PX331":true,"PX332":true,"PX421":"false","PX442":"false","PX317":"WiFi","PX344":"${carrier}","PX347":"[en_US]","PX343":"`+
        ''+connection_type+
        ''+`","PX415":${PX415},"PX413":"${PX413}","PX416":"${PX416}","PX414":"${dogshit}","PX419":"Li-ion","PX418":${PX418},"PX420":${voltage},"PX340":"${pxVersion}","PX342":"${appVersion}","PX341":"${appname}","PX348":"${bundle}","PX1159":false,"PX330":"new_session","PX345":3,"PX351":`+
        ''+APP_ACTIVE_TIME_INTERVAL+
        ''+`,"PX326":"${PXUUID}","PX327":"${PX327}","PX328":"${finger3}","PX1280":"[]"}}]`

         var _encodedPayload = btoa(payload_123)

         //var _finalPayload = `ftag=22&payload=${_encodedPayload}&appId=${appId}&tag=mobile&uuid=${PXUUID}`;
         var _finalPayload = `payload=${_encodedPayload}&uuid=${PXUUID}&appId=${appId}&tag=mobile&ftag=22`


         var toSendBack = `${appId}:${PXURLUUID}:${model}:${PX414}:${PX415}:${appname}:${bundle}:${pxVersion}:${android_version1}:${SCREEN_HEIGHT}:${SCREEN_WIDTH}:${connection_type}:${brand}:${appVersion}:${country}:${PX413}:${PX415}:${dogshit}:${voltage}:${carrier}:${PX418}:${PX1214}:${current_time_stamp}:${APP_ACTIVE_TIME_INTERVAL}:${finger3}:${PX327}:${PXUUID}`;
         toSendBack = Buffer.from(toSendBack).toString('base64');

         let date_ob = new Date()
         console.log(`[`.yellow + `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}` + `]`.yellow + `[`.yellow + `OK`.brightGreen + `]`.yellow + `[`.yellow + `${appname}`.white + `]`.yellow + `[`.yellow + `${pxVersion}`.white + `]`+ `[`.yellow + `${appVersion}`.white + `]`.yellow)

         response = {
            success: true,
            payload: _finalPayload,
            toSendBack: toSendBack,
            android_version: android_version1,
            model: model
         };
         next()
      } else {

         var _toSendBackDecoded = atob(_toSendBack);
         var splitSentBack = _toSendBackDecoded.split(':');

         var firstResponseEncodedBuff = atob(firstResponseEncoded)


         var appId = splitSentBack[0];
         var PX326 = splitSentBack[1];
         var model = splitSentBack[2];
         var PX414 = splitSentBack[3];
         var PX415 = splitSentBack[4];
         var appname = splitSentBack[5];
         var bundle = splitSentBack[6];
         var pxVersion = splitSentBack[7];
         var android_version = splitSentBack[8];
         var SCREEN_HEIGHT = splitSentBack[9];
         var SCREEN_WIDTH = splitSentBack[10];
         var connection_type = splitSentBack[11];
         var brand = splitSentBack[12];
         var appVersion = splitSentBack[13];
         var country = splitSentBack[14];
         var statusbattery = splitSentBack[16];
         var voltage = splitSentBack[18];
         var PX344 = splitSentBack[19];
         var PX418 = splitSentBack[20];
         var PX416 = helpers.USB(PX414)
         var PX1214 = splitSentBack[21]
         var current_time_stamp = splitSentBack[22]
         var APP_ACTIVE_TIME_INTERVAL = splitSentBack[23]
         var finger3 = splitSentBack[24]
         var PX327 = splitSentBack[25]
         var PXUUID = splitSentBack[26]

         var appc = LR.get(firstResponseEncodedBuff, 'appc|2|', "\"")[0]
         console.log(appc)

         var appcFixed = '2|' + appc;
         var tmp = appcFixed.split('|')

         var CHALLENGE_SIGNED = tmp[2];
         var challenge_ts = tmp[1];

         var sdk_ready_time = randomInt(10000, 80000);
         var collection_time = randomInt(10, 1000);

         var sid = LR.get(firstResponseEncodedBuff, 'sid|', "\"")[0]
         var vid = LR.get(firstResponseEncodedBuff, 'vid|', "|")[0]

         var challenge = Solve_Challenge_And(parseInt(tmp[5]), parseInt(tmp[6]), parseInt(tmp[7]), parseInt(tmp[3]), parseInt(tmp[4]), parseInt(tmp[8]), model);


        let payload_2 = '[{"t":"PX329","d":{"PX1214":"'+
        ''+PX1214+
        ''+`","PX91":${SCREEN_WIDTH},"PX92":${SCREEN_HEIGHT},"PX316":true,"PX318":"${PX318}","PX319":"${android_version1}","PX320":"${model}","PX339":"`+
        ''+brand+
        ''+`","PX321":"${model}","PX323":${current_time_stamp},"PX322":"Android","PX337":true,"PX336":true,"PX335":true,"PX334":true,"PX333":true,"PX331":true,"PX332":true,"PX421":"false","PX442":"false","PX317":"WiFi","PX344":"`+
        ''+PX344+
        ''+`","PX347":"[en_US]","PX343":"${connection_type}","PX415":${PX415},"PX413":"${statusbattery}","PX416":"${PX416}","PX414":"${PX414}","PX419":"Li-ion","PX418":${PX418},"PX420":${voltage},"PX340":"${pxVersion}","PX342":"${appVersion}","PX341":"${appname}","PX348":"${bundle}","PX1159":false,"PX330":"new_session","PX345":3,"PX351":`+
        ''+APP_ACTIVE_TIME_INTERVAL+
        ''+`,"PX326":"${PXUUID}","PX327":"${PX327}","PX328":"${finger3}","PX259":${challenge_ts},"PX256":"${CHALLENGE_SIGNED}","PX257":"${challenge}","PX1208":"[]"}}]`
        console.log(payload_2)

        

         var _encodedPayload = btoa(payload_2);

         var _finalPayload = `vid=${vid}&ftag=22&payload=${_encodedPayload}&appId=${appId}&tag=mobile&uuid=${PX326}&sid=${sid}`

         let date_ob = new Date()
         console.log(`[`.yellow + `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}` + `]`.yellow + `[`.yellow + `OK`.brightGreen + `]`.yellow + `[`.yellow + `${appname}`.white + `]`.yellow + `[`.yellow + `${pxVersion}`.white + `]`+ `[`.yellow + `${appVersion}`.white + `]`.yellow)
         response = {
            success: true,
            payload: _finalPayload,
         };
         next();
      }
   } catch (e) {
    console.log(e)
      response = {
         success: false,
         err: "Unknown error occured",
         stack: e
      };
      next();
   }

}, function(req, res, next) {
   res.json(response)
})

let date_ob = new Date();
app.listen(PORT, () =>
   console.log(`[`.yellow + `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}` + `]`.yellow + `[3.2.0] Perimeterx Mobile Server starting on http://localhost:${PORT}`.brightGreen)
);