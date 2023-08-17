import "server-only";

import { HTTP_ROUTE, DEVICE_TOKEN } from "@/app/config";
import { hashString } from "@/features/secrets/utils/hash";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${DEVICE_TOKEN}`);

const requestOptions: any = {
  method: "POST",
  headers: myHeaders,
};

const DATA_EVENT_TYPE = "";
const TRIGGER_REWARDS_EVENT_TYPE = "";

export async function uploadDistanceToWS(device: { id: string, value: number }) {
  requestOptions.body = JSON.stringify({
    deviceId: "0x" + hashString(device.id),
    data: device.value,
  });

  await sendRequest(
    HTTP_ROUTE.trim() + `?eventType=${DATA_EVENT_TYPE}`,
    requestOptions
  );
}

export async function triggerEvaluation() {
  await sendRequest(
    HTTP_ROUTE.trim() + `?eventType=${TRIGGER_REWARDS_EVENT_TYPE}`,
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
