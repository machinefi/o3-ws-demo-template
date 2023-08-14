interface Integration {
  createdAt: string;
  externalId: string;
  integrationId: string;
  integrationVendor: string;
  metadata: string;
  status: string;
  updatedAt: string;
}

interface Privilege {
  expiry: string;
  id: number;
  updatedAt: string;
}

interface PrivilegedUser {
  address: string;
  privileges: Privilege[];
}

interface Make {
  id: string;
  logo_url: {
    string: string;
    valid: boolean;
  };
  name: string;
  oem_platform_name: {
    string: string;
    valid: boolean;
  };
}

interface Type {
  make: string;
  model: string;
  subModels: string[];
  type: string;
  year: number;
}

interface VehicleData {
  base_msrp: number;
  driven_wheels: string;
  epa_class: string;
  fuel_tank_capacity_gal: string;
  fuel_type: string;
  mpg: string;
  mpg_city: string;
  mpg_highway: string;
  number_of_doors: string;
  vehicle_type: string;
}

interface CompatibleIntegration {
  capabilities: number[];
  country: string;
  id: string;
  region: string;
  style: string;
  type: string;
  vendor: string;
}

interface DeviceAttribute {
  name: string;
  value: string;
}

interface DeviceDefinition {
  compatibleIntegrations: CompatibleIntegration[];
  deviceAttributes: DeviceAttribute[];
  deviceDefinitionId: string;
  imageUrl: string;
  make: Make;
  metadata: any;
  name: string;
  type: Type;
  vehicleData: VehicleData;
  verified: boolean;
}

interface NFT {
  ownerAddress: number[];
  status: "Submitted" | "Unstarted";
  tokenId: number;
  tokenUri: string;
  txHash: string;
}

interface Metadata {
  canProtocol: string;
  elasticDefinitionSynced: boolean;
  elasticRegionSynced: boolean;
  geoDecodedCountry: string;
  geoDecodedStateProv: string;
  postal_code: string;
  powertrainType: "PHEV" | "ICE" | "FCEV";
}

interface SharedDevice {
  countryCode: string;
  customImageUrl: string;
  deviceDefinition: DeviceDefinition;
  id: string;
  integrations: Integration[];
  metadata: Metadata;
  name: string;
  nft: NFT;
  optedInAt: string;
  privilegedUsers: PrivilegedUser[];
  vin: string;
  vinConfirmed: boolean;
}

export interface UserDevice {
  countryCode: string;
  customImageUrl: string;
  deviceDefinition: DeviceDefinition;
  id: string;
  integrations: Integration[];
  metadata: Metadata;
  name: string;
  nft: NFT;
  optedInAt: string;
  privilegedUsers: PrivilegedUser[];
  vin: string;
  vinConfirmed: boolean;
}

export interface DevicesResponse {
  sharedDevices: SharedDevice[];
  userDevices: UserDevice[];
}

export interface Distance {
  date: string;
  distance: number;
}

export interface DrivenDistanceResponse {
  days: Distance[];
}

export interface DeviceWithDistances {
  id: string;
  distances: Distance[];
}
