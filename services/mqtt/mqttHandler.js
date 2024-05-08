'use strict';

// MQTT
let mqtt = require('./mqtt');

mqtt.client.on("message", onMessageReceived);

async function onMessageReceived(topic, value) {
	var message = {
		fullTopic: topic,
		gatewayName: topic.split("/")[1],
		deviceName: topic.split("/")[2],
		sensorTypeShort: topic.split("/")[3],
		sensorType: topic.split("/").slice(3).join("/"),
		value: value.toString()
	};
	
	console.log("--------------------------------------------------");
	console.log("gatewayName : " + message.gatewayName);
	console.log("Topic       : " + message.fullTopic);
	console.log("DeviceName  : " + message.deviceName);
	console.log("Reading     : " + message.sensorType);
	console.log("Value       : " + message.value);
	console.log("--------------------------------------------------");
	
	try {

		if (message.gatewayName == "INTERNAL") {
			device = await getDevice(message.deviceName)
			if (device) {
				console.log(device.devices[0])
				
				Internal(device, message.sensorType, message.value)
			}
		}
	} catch (err) {
		console.log("Error! ", err)
	}
};