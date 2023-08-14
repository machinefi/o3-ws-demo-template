import { GetDataByRID, JSON, ExecSQL, GetEnv } from "@w3bstream/wasm-sdk";
import { Float64, String } from "@w3bstream/wasm-sdk/assembly/sql";
import { getField, getPayloadValue } from "../utils/payload-parser";

export function handle_receive_data(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid);
  const payload = getPayloadValue(deviceMessage);

  const deviceId = getDeviceId(payload);
  const distances = getDistances(payload);

  handleDistances(deviceId, distances);
  return 0;
}

function getDeviceId(payload: JSON.Obj): string {
  const deviceId = getField<JSON.Str>(payload, "deviceId");
  if (deviceId == null) {
    assert(false, "Device ID not found in payload");
  }

  return deviceId!.toString();
}

function getDistances(payload: JSON.Obj): JSON.Value[] {
  const distances = getField<JSON.Arr>(payload, "distances");
  if (distances == null) {
    assert(false, "Distances not found in payload");
  }

  return distances!.valueOf();
}

export function handleDistances(
  deviceId: string,
  distances: JSON.Value[]
): void {
  for (let i = 0; i < distances.length; i++) {
    const distanceObj = distances[i];
    const distanceValue = getDistanceValue(distanceObj as JSON.Obj);
    const distanceDate = getTimeValue(distanceObj as JSON.Obj, "date");
    storeDistance(deviceId, distanceValue, distanceDate);
  }
}

function getTimeValue(distance: JSON.Obj, timeName: string): string {
  const timeValue = getField<JSON.Str>(distance, timeName);

  if (timeValue == null) {
    assert(false, "Time value not found in payload");
  }

  return timeValue!.toString();
}

function getDistanceValue(distance: JSON.Obj): number {
  const distanceValue = distance.get("distance");

  if (distanceValue == null) {
    assert(false, "Distance value not found in payload");
  }

  if (distanceValue instanceof JSON.Integer) {
    const _distance = distanceValue as JSON.Integer;
    return f64(_distance.valueOf());
  } else if (distanceValue instanceof JSON.Float) {
    const _distance = distanceValue as JSON.Float;
    return _distance.valueOf();
  } else {
    assert(false, "Distance value is not a number");
    return 0;
  }
}

function storeDistance(
  deviceId: string,
  distanceValue: number,
  distanceDate: string
): void {
  const DISTANCE_TABLE = GetEnv("DISTANCE_TABLE");
  const sql = `INSERT INTO "${DISTANCE_TABLE}" (device_id, distance, date) VALUES (?,?,?);`;
  ExecSQL(sql, [
    new String(deviceId),
    new Float64(distanceValue),
    new String(distanceDate),
  ]);
}
