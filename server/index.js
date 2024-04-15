const express = require("express");
const app = express();
const cors = require("cors");
const { getAddress } = require("./scripts/crypto");
const port = 3042;

app.use(cors());
app.use(express.json());

// private key 1: 98fedda155c734b2084c1ae878f6f870e8672ba708c5a78206a44aa1e6860f57
// address: c24351875c3926558574780cecd6a63b477098a5
// private key 2: 2caee7adc783181cff1a040b68628f80f8e4fe6a9666fb45d8d72aaa909f40cf
// address: 5342f7810d21bb46fb2093e77fc3cf9a0b4a8b20
// private key 3: 2a51b21a31600e1342cf1d258d911aab314c7f01c9ba753eabc24021089d9dc2
// address: 50aeafd07d1cf0bc3fa3665e94e4a7e91fd70d46

const balances = {
  c24351875c3926558574780cecd6a63b477098a5: 100,
  ff15f78ce486129c0a5432c671a8747ac4b70978: 50,
  "50aeafd07d1cf0bc3fa3665e94e4a7e91fd70d46": 75,
};

app.get("/balance/:privateKey", async (req, res) => {
  const { privateKey } = req.params;
  const message = "Get Blanace";
  const address = await getAddress(message, privateKey);
  console.log("address: ", address);

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount } = req.body;

  const senderAddress = await getAddress("Get Balance", sender);
  const recipientAddress = await getAddress("Get Balance", recipient);

  setInitialBalance(senderAddress);
  setInitialBalance(recipientAddress);

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipientAddress] += amount;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
