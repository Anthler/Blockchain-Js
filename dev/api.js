const port = process.argv[2];

const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const rp = require("request-promise");

const nodeAddress = uuid()
  .split("-")
  .join("");

const bitcoin = new Blockchain();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/blockchain", (req, res) => {
  res.send(bitcoin);
});

app.post("/transaction", (req, res) => {
  const blockIndex = bitcoin.createNewTransactions(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({
    note: `Transaction will be added at block number ${blockIndex}.`
  });
});

app.get("/mine", (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  bitcoin.createNewTransactions(12.5, "00", nodeAddress);

  res.json({
    note: "Block mined successfully",
    block: newBlock
  });
});

app.post("/register-and-broadcast-node", (req, res) => {
  const newNodeUrl = request.body.newNodeUrl;
  const requestOptions = {
    uri: networkNodeUrl + "/register-node",
    method: "POST",
    body: { newNodeUrl: newNodeUrl },
    json: true
  };

  rp(requestOptions);
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodePromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true
    };

    regNodePromises.push(rp(requestOptions));

    Promise.all(regNodePromises)
      .then(() => {
        const registerBulkOptions = {
          uri: newNodeUrl + "/register-nodes-bulk",
          method: "POST",
          body: {
            allNetworkNode: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
          },
          json: true
        };

        rp(registerBulkOptions);
      })
      .then(data => {
        res.json({ note: "New node registered with network successfully" });
      });
  });
});

app.post("/register-node", (req, res) => {
  const newNodeUrl = request.body.newNodeUrl;
});

app.post("/register-nodes-bulk", (req, res) => {
  const newNodeUrl = request.body.newNodeUrl;
});

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT: ${port}`);
});
