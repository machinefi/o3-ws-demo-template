import axios from "axios";

import {
  DIMO_DEVICES_API_BASE_URL,
  DIMO_DEVICE_DATA_API_BASE_URL,
} from "@/app/config";

export const dimoDevicesAxiosInstance = (token: string) =>
  axios.create({
    baseURL: DIMO_DEVICES_API_BASE_URL,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const dimoDeviceDataAxiosInstance = (token: string) =>
  axios.create({
    baseURL: DIMO_DEVICE_DATA_API_BASE_URL,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
