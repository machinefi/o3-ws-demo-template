import { buildTxSlot, buildTxString, ethToHex } from "@w3bstream/wasm-sdk/assembly/utility";

export function buildTxData(
  functionAddr: string,
  recipient: string,
  tokenAmount: string
): string {
  const slotForRecipient = buildTxSlot(recipient);
  const slotForAmount = tokenNumberToTxSlot(tokenAmount);

  return buildTxString([functionAddr, slotForRecipient, slotForAmount]);
}

export function buildUINT256Slot(amount: u64): string {
  const hexStr = intToHexStr(amount);
  return buildTxSlot(hexStr);
}

function tokenNumberToTxSlot<T>(value: T): string {
  const ethHex = ethToHex(value);
  return buildTxSlot(ethHex);
}

function intToHexStr(value: u64): string {
  return value.toString(16);
}