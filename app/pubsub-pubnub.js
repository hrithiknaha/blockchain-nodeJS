const PubNub = require('pubnub');

const credentials = {
	publishKey: 'pub-c-769f9d55-a3a0-4c59-846c-cc4320fa8014',
	subscribeKey: 'sub-c-6dc113a8-0a9c-11ea-90c2-1a72d7432d4b',
	secrerKey: 'sec-c-ODMxZTU2ZDctYWZkOS00ZjlmLTk3NTItM2U4OTk4YzkxYzk1'
};

const CHANNELS = {
	TEST: 'TEST',
	BLOCKCHAIN: 'BLOCKCHAIN',
	TRANSACTION: 'TRANSACTION'
};

class PubSub {
	constructor({ blockchain, transactionPool }) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;

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

				const parsedMessage = JSON.parse(message);

				switch (channel) {
					case CHANNELS.BLOCKCHAIN:
						this.blockchain.replaceChain(parsedMessage);
						break;
					case CHANNELS.TRANSACTION:
						this.transactionPool.setTransaction(parsedMessage);
						break;
					default:
						return;
				}
			}
		};
	}

	// publish({ channel, message }) {
	// 	this.pubnub.publish({ channel, message });
	// }

	publish({ channel, message }) {
		this.pubnub.unsubscribe({ channel });
		setTimeout(() => this.pubnub.publish({ channel, message }), 3000);
		setTimeout(
			() => this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] }),
			6000
		);
	}

	broadcastChain() {
		this.publish({
			channel: CHANNELS.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain)
		});
	}

	broadcastTransaction(transaction) {
		this.publish({
			channel: CHANNELS.TRANSACTION,
			message: JSON.stringify(transaction)
		});
	}
}

module.exports = PubSub;
