import "server-only";

import { dimoDevicesAxiosInstance } from "./client";
import { DevicesResponse, UserDevice } from "@/app/types";
import { DIMO_DEVICES_API } from "@/app/config";

export async function fetchUserDevices(token: string): Promise<UserDevice[]> {
  try {
    const res = await dimoDevicesAxiosInstance(token).get<DevicesResponse>(
      DIMO_DEVICES_API
    );
    if (!res.data?.userDevices) {
      return [];
    }
    return res.data.userDevices;
  } catch (e: any) {
    console.log(e);
    throw new Error(
      e.response?.data?.message || e.response?.data?.message || e.message
    );
  }
}
