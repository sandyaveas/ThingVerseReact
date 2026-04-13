import { environment } from "../environments/environment";

export interface APIDevice {
  deviceManagementListDataId: number;
  deviceId: number;
  mac: string;
  wifiConnectivityParam1: string;
  wifiConnectivityParam2: string;
  wifiConnectivityParam3: string;
  deviceStatusId: number | null;
  wifiStatus: string | null;
  deviceStatusName: string;
  deviceSerialNumber: string;
  eisStatus: string;
  packingDate: string | null;
  shipmentDate: string | null;
  deviceRegisteredDate: string | null;
  productId: number | null;
  productName: string;
  siM1: string;
  siM1StatusId: number | null;
  siM1Status: string;
  siM2: string;
  siM2StatusId: number | null;
  siM2Status: string;
  customerAccountId: number;
  ncmGroupName: string;
  routerStatus: string;
  packageStatusId: number | null;
  modemStatus: string;
  ethernetStatus: string;
  siM1ProvisioningDate: string | null;
  siM2ProvisioningDate: string | null;
  packageStatus: string;
  createdBy: number;
  createdOn: string;
  lastUpdatedOn: string | null;
  totalRows: number;
  wifiConfiguration: number | null;
  serviceAttributeStatus: string | null;
  batterySerialNumber: string;
  batteryHealth: number | null;
}

export const getAllDevices = async (pageIndex = 0, pageSize = 10): Promise<APIDevice[]> => {
  const url = `${environment.API_BASE_URL_DEVICEMANAGEMENT}devicemgmt/Device/GetAllDevicesList?CustomerAccountId=1&PageIndex=${pageIndex}&PageSize=${pageSize}&SortColumn=&SortOrder=&SearchText=&QueryName=&ApplyFilter=%5B%5D`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

export interface RouterAlert {
  mac: string;
  productName: string;
  deviceStatusName: string;
  routerStatus: string;
  ethernetStatus: string | null;
  modemStatus: string | null;
  updatedDate: string;
  processedDate: string;
  totalRows: number;
}

export const getRouterAlerts = async (deviceId: number, pageIndex = 0, pageSize = 10): Promise<RouterAlert[]> => {
  const url = `${environment.API_BASE_URL_DEVICEMANAGEMENT}devicemgmt/Device/GetRouterAlertsData`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        DeviceId: deviceId,
        PageIndex: pageIndex,
        PageSize: pageSize,
        SortColumn: null,
        SortOrder: null
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch router alerts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching router alerts:', error);
    return [];
  }
};

export interface SIMActivity {
  iccId: string;
  simStatusName: string;
  commandActionName: string;
  requestedBy: string;
  processedBy: string | null;
  requestedDate: string;
  processedDate: string | null;
  totalRows: number;
}

export const getSIMActivities = async (deviceId: number, pageIndex = 0, pageSize = 10): Promise<SIMActivity[]> => {
  const url = `${environment.API_BASE_URL_DEVICEMANAGEMENT}devicemgmt/Device/GetSIMActivitiesData`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        DeviceId: deviceId,
        PageIndex: pageIndex,
        PageSize: pageSize,
        SortColumn: null,
        SortOrder: null
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch SIM activities');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching SIM activities:', error);
    return [];
  }
};

export interface DeviceSummaryMetric {
  deviceSummaryId: number;
  deviceSummaryName: string;
  deviceSummaryValue: string;
  customerAccountId: number;
  createdBy: number;
  createdOn: string;
  lastUpdatedOn: string | null;
}

export const getDashboardSummary = async (customerAccountId = 1): Promise<DeviceSummaryMetric[]> => {
  const url = `${environment.API_BASE_URL_DEVICEMANAGEMENT}devicemgmt/Device/GetDeviceSummaryByCustomerAccountId/${customerAccountId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return [];
  }
};

export interface APIDeviceDetail {
  deviceId: number;
  deviceRegisteredDate: string | null;
  mac: string;
  routerStatus: string;
  modemStatus: string;
  ethernetStatus: string;
  wifiStatus: string;
  productId: number;
  productName: string;
  siM1: string;
  siM1Status: string;
  siM1StatusId: number;
  siM2: string;
  siM2Status: string;
  siM2StatusId: number;
  packingDate: string | null;
  shipmentDate: string | null;
  asnInsertedDate: string | null;
  lastMessageReceivedDate: string | null;
  deviceStatus: string;
  rmaDevice: string;
  ncmGroupName: string | null;
  eisStatus: string | null;
  eisReferenceStatus: string | null;
  siM1ProvisioningDate: string | null;
  siM2ProvisioningDate: string | null;
  deviceModel: string;
  deviceSerialNumber: string;
  carrier1Name: string;
  carrier2Name: string;
  siM1Imsi: string;
  siM2Imsi: string;
  siM1ServicePlan: string | null;
  siM2ServicePlan: string | null;
  batterySerialNumber: string | null;
  batteryHealth: number;
}

export const getDeviceDetailById = async (deviceId: number, customerAccountId = 1): Promise<APIDeviceDetail | null> => {
  const url = `${environment.API_BASE_URL_DEVICEMANAGEMENT}devicemgmt/Device/GetDeviceActivityDataByDeviceId/${customerAccountId}/${deviceId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch device detail');
    return await response.json();
  } catch (error) {
    console.error('Error fetching device detail:', error);
    return null;
  }
};

export interface DeviceSummary {
  mac: string;
  productName: string;
  packageStatus: string;
  deviceStatus: string;
  sim1: string;
  sim1Status: string;
  sim1ProvisioningDate: string;
  sim2: string;
  sim2Status: string;
  sim2ProvisioningDate: string;
  routerStatus: string;
  ethernet: string;
  wifiStatus: string;
}

export interface DeviceDetail extends DeviceSummary {
  deviceSerialNumber: string;
  lastMessageDateTime: string;
  deviceModel: string;
  modemLte: string;
  iccid1: string;
  carrier1Name: string;
  sim1Imsi: string;
  sim1ServicePlan: string;
  iccid2: string;
  carrier2Name: string;
  sim2Imsi: string;
  sim2ServicePlan: string;
  packingDateTime: string;
  shipmentDateTime: string;
  rmaDevice: string;
  registeredDeviceDateTime: string;
  asnInsertedDateTime: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  status: 'Success' | 'Failure' | 'Pending';
}

export const mockDevices: DeviceSummary[] = [
  {
    mac: "00:30:44:AA:68:7A",
    productName: "Connection Pro",
    packageStatus: "Active Assigned",
    deviceStatus: "Active",
    sim1: "89148000010121543003",
    sim1Status: "Activated",
    sim1ProvisioningDate: "07/18/2024, 12:04 AM",
    sim2: "89011703274257815466",
    sim2Status: "Activated",
    sim2ProvisioningDate: "-",
    routerStatus: "Online",
    ethernet: "Connected",
    wifiStatus: "Standby"
  },
  {
    mac: "00:30:44:AD:DE:87",
    productName: "Connection Pro",
    packageStatus: "Active Assigned",
    deviceStatus: "Active",
    sim1: "89148000010850485129",
    sim1Status: "Activated",
    sim1ProvisioningDate: "12/12/2024, 11:26 PM",
    sim2: "89011703274257485203",
    sim2Status: "Activated",
    sim2ProvisioningDate: "03/11/2025, 05:30 AM",
    routerStatus: "Online",
    ethernet: "Connected",
    wifiStatus: "Disconnected"
  },
  {
    mac: "00:30:44:7D:7C:2B",
    productName: "Wireless Connect",
    packageStatus: "Active Assigned",
    deviceStatus: "Active",
    sim1: "89148000010850698374",
    sim1Status: "Activated",
    sim1ProvisioningDate: "04/04/2026, 04:41 PM",
    sim2: "89011703274257861932",
    sim2Status: "Activated",
    sim2ProvisioningDate: "04/04/2026, 04:32 PM",
    routerStatus: "Online",
    ethernet: "Disconnected",
    wifiStatus: "Disconnected"
  }
];

export const getDeviceDetail = (mac: string): DeviceDetail => {
  const summary = mockDevices.find(d => d.mac === mac) || mockDevices[0];
  return {
    ...summary,
    deviceSerialNumber: "MM240500003664",
    lastMessageDateTime: "03/14/2026, 07:38 AM",
    deviceModel: "E110",
    modemLte: "Standby",
    iccid1: summary.sim1,
    carrier1Name: "Verizon",
    sim1Imsi: "311110121543003",
    sim1ServicePlan: "CPPUBDYN",
    iccid2: summary.sim2,
    carrier2Name: "AT&T",
    sim2Imsi: "321174257815466",
    sim2ServicePlan: "Comcast Business - 500KB LTE NEW",
    packingDateTime: "07/08/2024, 12:59 AM",
    shipmentDateTime: "07/18/2024, 12:59 AM",
    rmaDevice: "No",
    registeredDeviceDateTime: "07/23/2024, 12:59 AM",
    asnInsertedDateTime: "07/03/2024, 12:59 AM",
    iccid1Status: "Activated",
    iccid2Status: "Activated",
    iccid1ProvisioningDateTime: summary.sim1ProvisioningDate,
    iccid2ProvisioningDateTime: summary.sim2ProvisioningDate,
  } as any;
};

export const mockActivities = {
  routerAlerts: [
    { id: '1', timestamp: '2026-04-10 10:00:00', event: 'Power Loss', details: 'Primary power source disconnected', status: 'Failure' },
    { id: '2', timestamp: '2026-04-10 10:05:00', event: 'Power Restored', details: 'Primary power source reconnected', status: 'Success' },
  ],
  simActivities: [
    { id: '1', timestamp: '2026-04-11 08:30:00', event: 'Data Session Start', details: 'Session initiated on SIM 1', status: 'Success' },
    { id: '2', timestamp: '2026-04-11 12:00:00', event: 'Data Limit Warning', details: '80% of data plan consumed', status: 'Pending' },
  ],
  eisTransactions: [
    { id: '1', timestamp: '2026-04-12 14:20:00', event: 'Provisioning', details: 'Provisioning request sent to EIS', status: 'Success' },
  ]
};
