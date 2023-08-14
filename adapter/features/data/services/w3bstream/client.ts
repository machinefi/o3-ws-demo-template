import "server-only";

import { HTTP_ROUTE, DEVICE_TOKEN } from "@/app/config";
import { DeviceWithDistances } from "@/app/types";
import { hashString } from "@/features/secrets/utils/hash";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${DEVICE_TOKEN}`);

const requestOptions: any = {
  method: "POST",
  headers: myHeaders,
};

const DISTANCE_DATA_EVENT_TYPE = "DISTANCE_DATA";
const ANALYZE_DISTANCE_DATA_EVENT_TYPE = "ANALYZE_DISTANCE_DATA";

export async function uploadDistanceToWS(device: DeviceWithDistances) {
  if (!device.distances || device.distances.length === 0) {
    return;
  }

  requestOptions.body = JSON.stringify({
    deviceId: "0x" + hashString(device.id),
    distances: device.distances,
  });

  await sendRequest(
    HTTP_ROUTE.trim() + `?eventType=${DISTANCE_DATA_EVENT_TYPE}`,
    requestOptions
  );
}

export async function triggerEvaluation() {
  await sendRequest(
    HTTP_ROUTE.trim() + `?eventType=${ANALYZE_DISTANCE_DATA_EVENT_TYPE}`,
    requestOptions
  );
}

async function sendRequest(route: string, options: any) {
  try {
    await fetch(route, options);
  } catch (error) {
    console.error("Error while sending request to w3bstream", error);
    throw new Error("Error while sending request to w3bstream");
  }
}
