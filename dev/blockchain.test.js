const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();
const previousBlockHash = "FDJTHT34IU4223IIO24";
const nonce = 100;

currentBlockData = [
  {
    amount: 10,
    sender: "0X03WFHBEFUKHFHDHR",
    recipient: "0X035NKWSNFERIIKR"
  },
  {
    amount: 80,
    sender: "0X0AJRSWIQEIUWE",
    recipient: "0X0SCNKS3402W"
  },
  {
    amount: 120,
    sender: "0X03WFHBEFQEW494",
    recipient: "0X035NKWS35982KR"
  }
];

// bitcoin.createNewBlock(1233, "dsfwsqwe2q3er322eq12fr", "234r3647uyefesfgh");
// bitcoin.createNewBlock(1233, "dsfwsqwe2q3er322eq12fr", "234r3647uyefesfgh");

// bitcoin.createNewTransactions(100, "32395sdjsmirse", "43ruweri8249ui");
// bitcoin.createNewTransactions(40, "32395sdjsmirse", "43ruweri8249ui");

//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 52773));
console.log(bitcoin);
