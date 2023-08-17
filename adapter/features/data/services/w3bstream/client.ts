import "server-only";

import { W3bstreamClient, WSHeader } from "w3bstream-client-js";

import { HTTP_ROUTE, API_TOKEN } from "@/app/config";

const client = new W3bstreamClient(HTTP_ROUTE, API_TOKEN);

const DATA_EVENT_TYPE = "";
const TRIGGER_REWARDS_EVENT_TYPE = "";

export async function uploadDataToWS({ id, value }: { id: string, value: number }) {
  const header: WSHeader = {
    device_id: id,
    event_type: DATA_EVENT_TYPE,
    timestamp: Date.now(),
  }
  const payload = {
    data: value,
  }

  await sendRequest(header, payload)
}

export async function triggerEvaluation(deviceId: string) {
  const header: WSHeader = {
    device_id: "deviceId",
    event_type: TRIGGER_REWARDS_EVENT_TYPE,
    timestamp: Date.now(),
  }
  const payload = {}

  await sendRequest(header, payload)
}

async function sendRequest(header: WSHeader, payload: Object | Buffer) {
  try {
    await client.publishSingle(header, payload);
  } catch (error) {
    console.error("Error while sending request to w3bstream", error);
    throw new Error("Error while sending request to w3bstream");
  }
}
