# px-mobile-gen-for-walmart
px mobile gen for walmart, 3 months old

includes device data


http://localhost:4278/payload?post=1&appId=PXUArm9B04&appName=Walmart&bundleId=com.walmart.android&sdkVer=v1.8.0&appVersion=22.6
First url to get the payload + toSendBack info
After that you need to send request to walmart's px api to get the sid/vid etc for the second payload

you need to encode the response of it in base64
this is the second url to get the second payload http://localhost:4278/payload?post=2&toSendBack=<toSendBack>&encodedRes=<encodedRes>&appId=PXUArm9B04&bundle=com.walmart.android&SDKVer=v1.8.0&appName=Walmart&appVersion=22.6

encodedRes is the response of the request encoded in base64
