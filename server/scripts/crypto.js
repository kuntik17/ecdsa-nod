const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const hashMessage = (message) => {
  let bytes = utf8ToBytes(message);
  return keccak256(bytes);
};

const signMessage = async (message, privateKey) => {
  let hash = hashMessage(message);
  return secp.sign(hash, privateKey, { recovered: true });
};

const recoverKey = (message, signature, recoveryBit) => {
  let hash = hashMessage(message);
  return secp.recoverPublicKey(hash, signature, recoveryBit);
};

const getAddress = async (message, privateKey) => {
  const [sig, recoveryBit] = await signMessage(message, privateKey);
  const recoveryKey = recoverKey(message, sig, recoveryBit);
  const slicedPublickey = recoveryKey.slice(1);
  const keccak = keccak256(slicedPublickey);
  return toHex(keccak.slice(-20));
};

module.exports = { getAddress };
