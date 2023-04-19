const Snowboy = require("@bugsounet/snowboy").Snowboy;
const path = require("path");
let snowboy = null;

const snowboyconfig = {
	debug: true,
	snowboy: [
		{
			usePMDL: false,
			PMDLPath: __dirname + "/pmdl",
			audioGain: 2.0,
			Frontend: true,
			Model: "jarvis",
			Sensitivity: 0.7
		}
	],
	micConfig: {
		recorder: "arecord",
		device: "plughw:3"
	}
};

const Log = require("logger");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function (notification, payload) {
		if (notification === "init-hotword") {
			this.init();
			this.startDetect();
		}
	},

	// // Test another function
	// anotherFunction: function() {
	// 	return {date: new Date()};
	// }

	async startDetect(ctx) {
		Log.info("Start detecting...");
		snowboy.start();
	},

	async init() {
		snowboy = new Snowboy(
			snowboyconfig.snowboy,
			snowboyconfig.micConfig,
			(detected) => {
				this.detect(detected);
			},
			snowboyconfig.debug
		);
		snowboy.init();
	},

	async detect(detected) {
		Log.info(detected + " is detected");
		// eslint-disable-next-line no-undef
		// ctx.emit("hotWords.detected");
		await this.sleep(500);
		this.sendSocketNotification("hotword-deteced");
	},

	sleep(time) {
		return new Promise(function (resolve) {
			setTimeout(resolve, time);
		});
	}
});
