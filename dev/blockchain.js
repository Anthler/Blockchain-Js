const sha = require("sha256");

const currentNodeUrl = process.argv[3];

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  Blockchain.prototype.createNewBlock = function(
    nonce,
    previousBlockHash,
    hash
  ) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.newTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash
    };
    /* We do this because, once we create our new block, 
        we are putting all of the new transactions into the newBlock. 
        Therefore, we want to clear out the entire new transactions
         array so that we can start over for the next block.
        */

    this.pendingTransactions = [];

    this.chain.push(newBlock);
    return newBlock;
  };

  this.createNewBlock(100, "0", "1");

  Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
  };

  Blockchain.prototype.createNewTransactions = function(
    amount,
    sender,
    recipient
  ) {
    this.amount = amount;
    this.recipient = recipient;
    this.sender = sender;

    newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient
    };

    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()["index"] + 1;
  };

  Blockchain.prototype.hashBlock = function(
    previousBlockHash,
    currentBlockHsh,
    nonce
  ) {
    const dataString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockHsh);

    const hash = sha(dataString);
    return hash;
  };

  Blockchain.prototype.proofOfWork = function(
    previousBlockHash,
    currentBlockData
  ) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

      //console.log(hash);
    }

    return nonce;
  };
}

module.exports = Blockchain;
