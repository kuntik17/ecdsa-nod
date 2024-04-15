import { useState } from "react";
import { sign, util } from "tweetnacl";
import { decodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hexToUint8Array(hexString) {
    if (hexString.length % 2 !== 0) {
      throw new Error("Invalid hex string");
    }
    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return byteArray;
  }

  async function transfer(evt) {
    evt.preventDefault();

    const privateKey = "9794de0cfa67c300376bc1c006caab68caeb67ddf6750e08b3fc25b707731c7c";
    const message = `${address}:${recipient}:${sendAmount}`;

    const signature = signTransaction(message, privateKey);
    console.log(signature);

    console.log({
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
      signature: encodeBase64(signature),
    });

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: encodeBase64(signature),
      });
      console.log(balance);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  function signTransaction(message, privateKeySeedHex) {
    const messageUint8 = decodeUTF8(message);
    const seedUint8 = hexToUint8Array(privateKeySeedHex);

    // Generate the full key pair from the seed
    const keyPair = sign.keyPair.fromSeed(seedUint8);

    const signature = sign.detached(messageUint8, keyPair.secretKey);
    return signature;
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)}></input>
      </label>

      <label>
        Recipient
        <input placeholder="Type an address, for example: 0x2" value={recipient} onChange={setValue(setRecipient)}></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
