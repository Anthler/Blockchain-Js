const port = process.argv[2];

const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const rp = require("request-promise");
const request = require("request");

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
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(
    newTransaction
  );
  res.json(`Your transaction will be added at block number ${blockIndex}`);
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
  const newNodeUrl = req.body.newNodeUrl;

  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodePromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true
    };

    regNodePromises.push(
      rp(requestOptions)
        .then(data => {
          console.log("good");
        })
        .catch(err => {
          console.log(err);
        })
    );
  });

  Promise.all(regNodePromises)
    .then(data => {
      const registerBulkOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNode: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
        },
        json: true
      };

      return rp(registerBulkOptions)
        .then(data => {
          console.log("good");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(data => {
      res.json({ note: "New node registered with network successfully" });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/register-node", (req, res) => {
  const newNodeUrl = request.body.newNodeUrl;
  const nodeNotAlreadyExists = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyExists && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  res.json({ note: "New node registered successfully" });
});

app.post("/register-nodes-bulk", (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;

    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: "Bulk registration successful." });
});

app.post("/transaction/broadcast", (req, res) => {
  const newTransaction = bitcoin.createNewTransactions(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl,
      method: "POST",
      body: newTransaction,
      json: true
    };
    const requestPromises = [];
    requestPromises.push(
      rp(requestOptions)
        .then(data => {})
        .catch(err => {
          console.log("there was a problem");
        })
    );
  });

  Promise.all(requestPromises)
    .then(data => {
      res.json({ Note: "Transaction creted and broadcasted successfully" });
    })
    .catch(err => {
      console.log("There is an issue");
    });
});

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT: ${port}`);
});
