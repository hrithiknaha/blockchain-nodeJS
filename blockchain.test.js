const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
	let blockchain, newChain, orginalChain;

	beforeEach(() => {
		blockchain = new Blockchain();
		newChain = new Blockchain();
		orginalChain = blockchain.chain;
	});

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

	describe('isValidChain()', () => {
		describe('when the chain does not start with the genesis block', () => {
			it('returns false', () => {
				blockchain.chain[0] = { data: 'fake-genesis' };

				expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
			});
		});

		describe('when the chain starts with the genesis block and has multiple blocks', () => {
			beforeEach(() => {
				blockchain.addBlock({ data: 'Bears' });
				blockchain.addBlock({ data: 'Beets' });
				blockchain.addBlock({ data: 'Bananas' });
			});

			describe('and a last hash reference has changed', () => {
				it('return false', () => {
					blockchain.chain[2].lastHash = 'broken-lastHash';

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('and chain contains a block with an invalid blocks', () => {
				it('return false', () => {
					blockchain.chain[2].data = 'some-bad-evil-data';

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('and chain does not contains any invalid blocks', () => {
				it('return true', () => {
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
				});
			});
		});
	});

	describe('replaceChain()', () => {
		let errorMock, logMock;

		beforeEach(() => {
			errorMock = jest.fn();
			logMock = jest.fn();

			global.console.error = errorMock;
			global.console.log = logMock;
		});

		describe('when the new chain is not longer', () => {
			beforeEach(() => {
				newChain.chain[0] = { new: 'chain' };
				blockchain.replaceChain(newChain.chain);
			});

			it('does not replace the chain', () => {
				expect(blockchain.chain).toEqual(orginalChain);
			});

			it('logs and error', () => {
				expect(errorMock).toHaveBeenCalled();
			});
		});

		describe('when the new chain is longer', () => {
			beforeEach(() => {
				newChain.addBlock({ data: 'Beras' });
				newChain.addBlock({ data: 'Geras' });
				newChain.addBlock({ data: 'Teras' });
			});

			describe('and the chain is invalid', () => {
				beforeEach(() => {
					newChain.chain[2].hash = 'some-fake-hash';
					blockchain.replaceChain(newChain.chain);
				});

				it('does not replace the chain', () => {
					expect(blockchain.chain).toEqual(orginalChain);
				});

				it('logs an error', () => {
					expect(errorMock).toHaveBeenCalled();
				});
			});

			describe('and the chain is valid', () => {
				beforeEach(() => {
					blockchain.replaceChain(newChain.chain);
				});

				it('replaces the chain', () => {
					expect(blockchain.chain).toEqual(newChain.chain);
				});

				it('logs about the chain replacement', () => {
					expect(logMock).toHaveBeenCalled();
				});
			});
		});
	});
});
