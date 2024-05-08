const express = require('express');
let mqtt = require('../services/mqtt/mqtt');
var router = express.Router();

//////////////////////////////////////////////////////////////////////////////////////////
// Begin Express Routes

router.post('/', (req, res) => {

	callback = req.body
	console.log(callback.batteryCritical)
	if (callback.batteryCritical) {
		req.body.batteryCritical = 1
	} else {
		callback.batteryCritical = 0
	}
	//console.log(req.body)
	mqtt.sendMessage(callback.nukiId + "/state", JSON.stringify(callback))
	res.sendStatus(200);
	//res.status(404).send({ message: "No devices found"});
    //res.status(500).send({ message: "Error retrieving devices " + err});
});

module.exports = router;
