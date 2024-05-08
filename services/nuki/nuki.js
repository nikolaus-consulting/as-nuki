// Logging
const {systemLogger, accessLogger, deviceLogger} = require('../../utils/logger')

// Configuration
const config = require('../../config');

// Utils
const utils = require('../../utils/utils')

// Webserver
let webserver = require('../webserver/webserver');

// Global Variable
const nukiToken = config.nuki.token

// HTTP Request Library
const axios = require('axios');

// Doku
// https://developer.nuki.io/page/nuki-bridge-http-api-1-13/4/

// MQTT
let mqtt = require('../mqtt/mqtt');
mqtt.client.on("message", onMessageReceived);

// On Starup
const { networkInterfaces } = require('os');
const nets = networkInterfaces();

startup()

async function onMessageReceived(topic, value) {
	var message = {
		fullTopic: topic,
		deviceName: topic.split("/")[1],
		sensorTypeShort: topic.split("/")[3],
		type: topic.split("/").slice(3).join("/"),
		value: value.toString()
	};

	console.log("--------------------------------------------------");
	console.log("Topic       : " + message.fullTopic);
	console.log("DeviceName  : " + message.deviceName);
	console.log("Type        : " + message.type);
	console.log("Value       : " + message.value);
	console.log("--------------------------------------------------");

	try {

		if (message.deviceName == "system") {
            if (message.type = "discover") {
                let discover = await getRequest('https://api.nuki.io/discover/bridges')
                for (const bridge of discover.bridges) {
                    mqtt.sendMessage("system/discover/" + bridge.bridgeId, JSON.stringify(bridge))
                }
            }
		}

        if (message.deviceName == "bridge") {
            if (message.type = "callback") {
                //addCallback(ip)
                //removeCallback(ip)
            }
        }

	} catch (err) {
		console.log("Error! ", err)
	}
};

function parameter() {
    var isoDate = new Date().toISOString()
    var randomNr = utils.random(1000, 9999);
    var hash = utils.hash(isoDate + "," + randomNr + "," + nukiToken)
    return "ts=" + isoDate + "&rnr=" + randomNr + "&hash=" + hash
}

async function startup() {

    let response = await getRequest('https://api.nuki.io/discover/bridges')
    for (const bridge of response.bridges) {
        mqtt.sendMessage("system/bridge/" + bridge.bridgeId + "/discover", JSON.stringify(bridge))
    }
    deviceLogger.debug("Discovered NUKI bridges", {body: response.bridges})

    // LIST
    for (const bridge of response.bridges) {
        deviceLogger.info("Get NUKI device list from " + bridge.bridgeId)
        let response = await getRequest('http://' + bridge.ip + ':8080/list?' + parameter())
        deviceLogger.debug("NUKI devices attached to bridge IP " + bridge.ip, {body: response})
        for (const device of response) {
            mqtt.sendMessage(device.nukiId + "/info", JSON.stringify(device))
        }
        //addCallback(bridge.ip)
    }
   
    for (const bridge of response.bridges) {
        // LIST CALLBACK
        let response = await getRequest('http://' + bridge.ip + ':8080/callback/list?' + parameter())
        mqtt.sendMessage("system/bridge/" + bridge.bridgeId + "/callback",JSON.stringify(response.callbacks))
        deviceLogger.debug(response.callbacks)
    }
}

////////////////////////// FUNCTION //////////////////////////
// ADD CALLBACK
async function addCallback(ip) {
    url = "http://" + nets.eth0[0].address + ":3100/nuki"
    console.log(url)

    let callbackList = await getRequest('http://' + ip + ':8080/callback/list?' + parameter())
    let urlExist = callbackList.callbacks.some( callback => callback['url'] === url )
    if (urlExist) {
        console.log("callback already exist")
    } else {
        let response = await getRequest('http://' + ip + ':8080/callback/add?url='+ encodeURIComponent(url) + "?" + parameter())
        systemLogger.debug("Callback added " + response.success)
    }
}

////////////////////////// FUNCTION //////////////////////////
// REMOVE CALLBACK
async function removeCallback(ip) {
    url = "http://" + nets.eth0[0].address + ":3100/nuki"

    let callbackList = await getRequest('http://' + ip + ':8080/callback/list?' + parameter())
    //console.log("callbacklist", callbackList.callbacks)
    index = callbackList.callbacks.findIndex(x => x.url === url);
    if (index >= 0) {
        let response = await getRequest('http://' + ip + ':8080/callback/remove?id=' + index + '&' + parameter())
        if (response.success) {
            deviceLogger.info("callback deleted")
            return { error: false, message: "deleted" }
        }
    } else {
        deviceLogger.warn("callback not found")
        return {error: "not found"}
    }
}

////////////////////////// FUNCTION //////////////////////////
// GET REQUEST
async function getRequest(url) {
    try {
       let res = await axios({
            url: url,
            method: 'get',
            timeout: 30000
        })
        if(res.status == 200){
            // test for status you want, etc
            //console.log(res.status)
        }    
        // Don't forget to return something   
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}