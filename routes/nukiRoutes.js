const express = require('express');
let mqtt = require('../services/mqtt/mqtt');
var router = express.Router();

//////////////////////////////////////////////////////////////////////////////////////////
// Begin Express Routes

router.post('/', (req, res) => {

	nuki = req.body
	//console.log(req.body)
	mqtt.sendMessage(nuki.nukiId + "/state", JSON.stringify(req.body))
	res.sendStatus(200);
	//res.status(404).send({ message: "No devices found"});
    //res.status(500).send({ message: "Error retrieving devices " + err});
});

module.exports = router;
