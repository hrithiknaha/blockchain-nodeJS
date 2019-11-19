const PubNub = require('pubnub');

const credentials = {
	publishKey: 'pub-c-769f9d55-a3a0-4c59-846c-cc4320fa8014',
	subscribeKey: 'sub-c-6dc113a8-0a9c-11ea-90c2-1a72d7432d4b',
	secrerKey: 'sec-c-ODMxZTU2ZDctYWZkOS00ZjlmLTk3NTItM2U4OTk4YzkxYzk1'
};

const CHANNELS = {
	TEST: 'TEST'
};

class PubSub {
	constructor() {
		this.pubnub = new PubNub(credentials);

		this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

		this.pubnub.addListener(this.listener());
	}

	listener() {
		return {
			message: (messageObject) => {
				const { channel, message } = messageObject;

				console.log(
					`Message recieved, Channel:${channel}. Message:${message}.`
				);
			}
		};
	}

	publish({ channel, message }) {
		this.pubnub.publish({ channel, message });
	}
}

module.exports = PubSub;
