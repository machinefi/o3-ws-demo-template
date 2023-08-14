import "server-only";

import { dimoDeviceDataAxiosInstance } from "./client";
import { DrivenDistanceResponse, Distance } from "@/app/types";
import { DIMO_DRIVEN_DISTANCE_API } from "@/app/config";

export async function fetchDeviceDistances(
  token: string,
  deviceId: string
): Promise<Distance[]> {
  try {
    const res = await dimoDeviceDataAxiosInstance(
      token
    ).get<DrivenDistanceResponse>(
      DIMO_DRIVEN_DISTANCE_API +
        `/${deviceId}/daily-distance?time_zone=America/Los_Angeles`
    );
    if (!res.data?.days) {
      return [];
    }
    return res.data.days;
  } catch (e: any) {
    console.log(e);
    throw Error(
      e.response?.data?.message || e.response?.data?.message || e.message
    );
  }
}
