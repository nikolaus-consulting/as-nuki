'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// MQTT Connector
// Author: Stefan Nikolaus (www.nikolaus-consulting.de)
// Version: 1.1
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Logging
const {systemLogger, deviceLogger} = require('../../utils/logger')

// Import MQTT
let MQTT = require("mqtt");

// Configuration
var config = global.config

const mqttBaseTopic = config.NAME

var mqttClient = MQTT.connect(config.mqtt.BROKERURL, {
	clientId: config.NAME + config.ID,
	username: config.mqtt.USERNAME, 
	password: config.mqtt.PASSWORD,
	will: {
		topic: mqttBaseTopic + "/system/state",
		payload: 'offline',
		qos: 1,
		retain: true
	}
});

mqttClient.on("connect", onConnected);
mqttClient.on("reconnect", onReconnect);
mqttClient.on("close", onClose);
mqttClient.on("error", onError);

function onConnected()
{
	mqttClient.publish(mqttBaseTopic + "/system/state", "online", {retain: true});
	
	mqttClient.subscribe(mqttBaseTopic + "/+/set/#");
	systemLogger.info('MQTT - Connected to ' + config.mqtt.BROKERURL);
}

function onReconnect()
{
	systemLogger.warn("MQTT - Try to reconnect");
}

function onClose()
{
	systemLogger.error("MQTT - Connection closed");
}

function onError()
{
	systemLogger.error('MQTT - Error connect to "' + config.mqtt.BROKERURL + '"');
}

function sendMessage(topic, value) {

	if (typeof value === 'object') {
		value = JSON.stringify(value);
	}

	if (mqttClient.connected == true) {
		this.value = value.toString()
		mqttClient.publish(mqttBaseTopic + "/" + topic, this.value);
		deviceLogger.info("Send MQTT message: " + mqttBaseTopic + "/" + topic + " : " + value);
		return true;
	} else {
		deviceLogger.error("MQTT - Sending failed! No connection to MQTT Broker");
		return false;
	}
}

exports.sendMessage = sendMessage;
exports.client = mqttClient;