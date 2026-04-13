import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDeviceDetail, mockActivities, getRouterAlerts, RouterAlert, getSIMActivities, SIMActivity, getDeviceDetailById, APIDeviceDetail } from "@/src/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function DeviceDetail() {
  const { mac } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const deviceId = location.state?.deviceId;
  
  const [device, setDevice] = useState<APIDeviceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [routerAlerts, setRouterAlerts] = useState<RouterAlert[]>([]);
  const [simActivities, setSimActivities] = useState<SIMActivity[]>([]);

  useEffect(() => {
    const fetchDeviceDetail = async () => {
      if (deviceId) {
        try {
          setLoading(true);
          const data = await getDeviceDetailById(deviceId);
          setDevice(data);
        } catch (error) {
          console.error("Failed to fetch device detail:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDeviceDetail();
  }, [deviceId]);

  const handleLoadActivities = async () => {
    setLoadingActivities(true);
    try {
      if (deviceId) {
        const [alerts, sims] = await Promise.all([
          getRouterAlerts(deviceId),
          getSIMActivities(deviceId)
        ]);
        setRouterAlerts(alerts);
        setSimActivities(sims);
      }
      setShowActivities(true);
    } catch (error) {
      console.error("Failed to load activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const SummaryItem = ({ label, value }: { label: string, value: string | null | undefined }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{label}:</span>
      <span className="text-sm text-slate-600">{value || "-"}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-slate-600 text-sm font-medium">Loading device details...</p>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Device details not found.</p>
        <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <span>Device Management</span>
        <span>&gt;</span>
        <span className="font-medium text-slate-900">Devices</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Activity View</h1>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-[#0089D1] text-white hover:bg-[#0077B5] border-none h-8 px-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
          <CardTitle className="text-sm font-bold uppercase text-slate-900">Summary:</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
            <SummaryItem label="MAC" value={device.mac} />
            <SummaryItem label="SIM-1 Service Plan" value={device.siM1ServicePlan} />
            <SummaryItem label="Device Serial Number" value={device.deviceSerialNumber} />
            <SummaryItem label="ICCID-1 Provisioning Date Time" value={device.siM1ProvisioningDate ? new Date(device.siM1ProvisioningDate).toLocaleString() : "-"} />
            <SummaryItem label="Last Message Date Time" value={device.lastMessageReceivedDate ? new Date(device.lastMessageReceivedDate).toLocaleString() : "-"} />
            <SummaryItem label="ASN Inserted Date Time" value={device.asnInsertedDate ? new Date(device.asnInsertedDate).toLocaleString() : "-"} />
            <SummaryItem label="Product Name" value={device.productName} />
            <SummaryItem label="ICCID-2" value={device.siM2} />
            <SummaryItem label="Device Model" value={device.deviceModel} />
            <SummaryItem label="Carrier-2 Name" value={device.carrier2Name} />
            <SummaryItem label="Router Online" value={device.routerStatus} />
            <SummaryItem label="SIM-2 IMSI" value={device.siM2Imsi} />
            <SummaryItem label="Device Status" value={device.deviceStatus} />
            <SummaryItem label="Packing Date Time" value={device.packingDate ? new Date(device.packingDate).toLocaleString() : "-"} />
            <SummaryItem label="Ethernet" value={device.ethernetStatus} />
            <SummaryItem label="ICCID-2 Status" value={device.siM2Status} />
            <SummaryItem label="Wi-Fi Status" value={device.wifiStatus} />
            <SummaryItem label="Shipment Date Time" value={device.shipmentDate ? new Date(device.shipmentDate).toLocaleString() : "-"} />
            <SummaryItem label="Modem/LTE" value={device.modemStatus} />
            <SummaryItem label="RMA Device" value={device.rmaDevice} />
            <SummaryItem label="ICCID-1" value={device.siM1} />
            <SummaryItem label="SIM-2 Service Plan" value={device.siM2ServicePlan} />
            <SummaryItem label="Carrier-1 Name" value={device.carrier1Name} />
            <SummaryItem label="ICCID-2 Provisioning Date Time" value={device.siM2ProvisioningDate ? new Date(device.siM2ProvisioningDate).toLocaleString() : "-"} />
            <SummaryItem label="SIM-1 IMSI" value={device.siM1Imsi} />
            <SummaryItem label="Registered Device Date Time" value={device.deviceRegisteredDate ? new Date(device.deviceRegisteredDate).toLocaleString() : "-"} />
            <SummaryItem label="ICCID-1 Status" value={device.siM1Status} />
          </div>

          <div className="mt-8">
            {!showActivities ? (
              <Button 
                onClick={handleLoadActivities} 
                className="bg-[#0089D1] text-white hover:bg-[#0077B5] border-none"
                disabled={loadingActivities}
              >
                {loadingActivities && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load Device & SIM Activities
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {showActivities && (
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="router-alerts" className="border border-slate-200 bg-white rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-medium text-slate-700">
                Router Alerts {routerAlerts.length > 0 && `(${routerAlerts.length})`}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <RouterAlertsTable data={routerAlerts} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="device-alerts" className="border border-slate-200 bg-white rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-medium text-slate-700">
                Device Registered Alerts
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="text-sm text-slate-500 italic py-4">No data found for this section.</div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sim-activities" className="border border-slate-200 bg-white rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-medium text-slate-700">
                SIM Activity Details {simActivities.length > 0 && `(${simActivities.length})`}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <SIMActivitiesTable data={simActivities} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="eis-transactions" className="border border-slate-200 bg-white rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-medium text-slate-700">
                EIS Transactions
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ActivityTable data={mockActivities.eisTransactions} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="wifi-details" className="border border-slate-200 bg-white rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-medium text-slate-700">
                Wifi Connectivity Details
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="text-sm text-slate-500 italic py-4">No data found for this section.</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}

function SIMActivitiesTable({ data }: { data: SIMActivity[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-slate-500 italic py-4">No SIM activities found for this device.</div>;
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-xs font-bold uppercase text-slate-600">ICCID</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">SIM Status</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Command Action</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Requested By</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Requested Date</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Processed By</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Processed Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-sm font-mono">{item.iccId}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-green-200 text-green-700 bg-green-50">
                  {item.simStatusName}
                </Badge>
              </TableCell>
              <TableCell className="text-sm font-medium">{item.commandActionName}</TableCell>
              <TableCell className="text-sm">{item.requestedBy}</TableCell>
              <TableCell className="text-sm font-mono">{new Date(item.requestedDate).toLocaleString()}</TableCell>
              <TableCell className="text-sm">{item.processedBy || "-"}</TableCell>
              <TableCell className="text-sm font-mono">{item.processedDate ? new Date(item.processedDate).toLocaleString() : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RouterAlertsTable({ data }: { data: RouterAlert[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-slate-500 italic py-4">No router alerts found for this device.</div>;
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Updated Date</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Processed Date</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Router Status</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Ethernet</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Modem</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Device Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-sm font-mono">{new Date(item.updatedDate).toLocaleString()}</TableCell>
              <TableCell className="text-sm font-mono">{new Date(item.processedDate).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`text-sm font-medium ${item.routerStatus === 'Online' ? 'text-green-600' : 'text-slate-400'}`}>
                  {item.routerStatus}
                </span>
              </TableCell>
              <TableCell className="text-sm">{item.ethernetStatus || "-"}</TableCell>
              <TableCell className="text-sm">{item.modemStatus || "-"}</TableCell>
              <TableCell>
                <Badge variant={item.deviceStatusName === 'Active' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                  {item.deviceStatusName}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ActivityTable({ data }: { data: any[] }) {
  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Timestamp</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Event</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Details</TableHead>
            <TableHead className="text-xs font-bold uppercase text-slate-600">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-sm font-mono">{item.timestamp}</TableCell>
              <TableCell className="text-sm font-medium">{item.event}</TableCell>
              <TableCell className="text-sm text-slate-600">{item.details}</TableCell>
              <TableCell>
                <Badge 
                  variant={item.status === 'Success' ? 'default' : item.status === 'Failure' ? 'destructive' : 'outline'}
                  className="text-[10px] uppercase"
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
