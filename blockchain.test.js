const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
	const blockchain = new Blockchain();

	it('should contain a `chain` Array instance', () => {
		expect(blockchain.chain instanceof Array).toBe(true);
	});

	it('should start with the genesis block', () => {
		expect(blockchain.chain[0]).toEqual(Block.genesis());
	});

	it('should add new block to the chain', () => {
		const newData = 'foo bar';
		blockchain.addBlock({ data: newData });

		expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
	});
});
