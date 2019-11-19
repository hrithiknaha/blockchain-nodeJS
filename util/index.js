const EC = require('elliptic').ec;

const ec = new EC('secp256k1'); //standards of efficient cyptography prime 256 bits koblits first implementation

module.exports = { ec };
