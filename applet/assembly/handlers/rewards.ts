import { GetEnv, JSON, Log, QuerySQL, SendTx } from "@w3bstream/wasm-sdk";
import { String } from "@w3bstream/wasm-sdk/assembly/sql";

import { getField } from "../utils/payload-parser";
import {
  buildUINT256Slot,
  buildRecepientSlot,
  buildTxString,
} from "../utils/build-tx";

const APPROVE_FUNCTION_ADDR = "426a8493";

export function handle_analyze_data(rid: i32): i32 {
  const drivenDistances = getDrivenDistance();
  processDistances(drivenDistances);
  cleanDB();
  return 0;
}

function getDrivenDistance(): JSON.Value[] {
  const queryRes = queryDrivenDistance();
  const distances = parseDrivenDistance(queryRes);
  return distances;
}

function queryDrivenDistance(): string {
  const DISTANCE_TABLE = GetEnv("DISTANCE_TABLE");
  const EVALUATION_PERIOD_DAYS = GetEnv("EVALUATION_PERIOD_DAYS");

  const sql = `
    SELECT device_id, SUM(distance) as driven_distance
    FROM ${DISTANCE_TABLE}
    WHERE CAST(date AS DATE) > NOW() - INTERVAL '${EVALUATION_PERIOD_DAYS}' DAY
    GROUP BY device_id;
  `;
  return QuerySQL(sql);
}

function parseDrivenDistance(result: string): JSON.Value[] {
  const distanceRaw = JSON.parse(result);

  if (!distanceRaw.isArr) {
    const distanceArr: JSON.Arr = new JSON.Arr();
    distanceArr.push(distanceRaw);
    return distanceArr.valueOf();
  } else if (distanceRaw.isArr) {
    const distanceArr = distanceRaw as JSON.Arr;
    return distanceArr.valueOf();
  } else {
    assert(false, "Distances are not an array");
    return [];
  }
}

function processDistances(distances: JSON.Value[]): void {
  for (let i = 0; i < distances.length; i++) {
    processSingleDistance(distances[i] as JSON.Obj);
  }
}

function processSingleDistance(distance: JSON.Obj): void {
  Log("Processing distance: " + distance.toString());

  const deviceId = getField<JSON.Str>(distance, "device_id")!.valueOf();
  const distanceValue = distance.get("driven_distance") as JSON.Value;
  let distanceEvaluatable: i32 = 0;

  if (distanceValue instanceof JSON.Integer) {
    const _distance = distanceValue as JSON.Integer;
    distanceEvaluatable = i32(_distance.valueOf());
  } else if (distanceValue instanceof JSON.Float) {
    const _distance = distanceValue as JSON.Float;
    distanceEvaluatable = i32(_distance.valueOf());
  } else {
    assert(false, "Distance is not a number");
  }

  const EVALUATION_DISTANCE = GetEnv("EVALUATION_DISTANCE");

  if (
    distanceEvaluatable >= i32(parseInt(EVALUATION_DISTANCE)) &&
    checkDeviceRegistrationAndActivity(deviceId)
  ) {
    const ownerAddr = getOwnerAddr(deviceId);
    approveRewardsNFT(ownerAddr, 1);
  }
}

function checkDeviceRegistrationAndActivity(deviceId: string): bool {
  const DEVICE_REGISTRY_TABLE = GetEnv("DEVICE_REGISTRY_TABLE");
  const sql = `SELECT is_registered, is_active FROM ${DEVICE_REGISTRY_TABLE} WHERE device_id = ?;`;
  const deviceData = QuerySQL(sql, [new String(deviceId)]);

  if (deviceData == null || deviceData == "") {
    return false;
  }

  let deviceDataJSON = JSON.parse(deviceData) as JSON.Obj;
  let isRegistered = getField<JSON.Bool>(
    deviceDataJSON,
    "is_registered"
  )!.valueOf();
  let isActive = getField<JSON.Bool>(deviceDataJSON, "is_active")!.valueOf();

  return isRegistered && isActive;
}

function getOwnerAddr(deviceId: string): string {
  const DEVICE_BINDING_TABLE = GetEnv("DEVICE_BINDING_TABLE");
  const sql = `SELECT owner_address FROM ${DEVICE_BINDING_TABLE} WHERE device_id = ?;`;
  const ownerAddrData = QuerySQL(sql, [new String(deviceId)]);

  let ownerAddrDataJSON = JSON.parse(ownerAddrData) as JSON.Obj;
  let ownerAddr = getField<JSON.Str>(
    ownerAddrDataJSON,
    "owner_address"
  )!.toString();

  return ownerAddr;
}

function approveRewardsNFT(to: string, amount: number): void {
  const txData = buildTxData(APPROVE_FUNCTION_ADDR, to, 1, amount);
  const REWARDS_CONTRACT_ADDRESS = GetEnv("REWARDS_CONTRACT_ADDRESS");
  const CHAIN_ID = GetEnv("CHAIN_ID");
  SendTx(i32(parseInt(CHAIN_ID)), REWARDS_CONTRACT_ADDRESS, "0", txData);
}

function buildTxData(
  functionAddr: string,
  recipient: string,
  tierId: number,
  amount: number
): string {
  const slotForRecipient = buildRecepientSlot(recipient);
  const slotForTierId = buildUINT256Slot(u64(tierId));
  const slotForAmount = buildUINT256Slot(u64(amount));

  return buildTxString([
    functionAddr,
    slotForRecipient,
    slotForTierId,
    slotForAmount,
  ]);
}

function cleanDB(): void {
  const DISTANCE_TABLE = GetEnv("DISTANCE_TABLE");

  const sql = `
    DELETE FROM ${DISTANCE_TABLE}
  `;
  QuerySQL(sql);
}
