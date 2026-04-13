import { APIDevice, getAllDevices, getDashboardSummary, DeviceSummaryMetric } from "@/src/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<APIDevice[]>([]);
  const [summary, setSummary] = useState<DeviceSummaryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [devicesData, summaryData] = await Promise.all([
          getAllDevices(),
          getDashboardSummary()
        ]);
        setDevices(devicesData);
        setSummary(summaryData);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please ensure you are authenticated.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMetric = (name: string) => {
    const metric = summary.find(m => m.deviceSummaryName === name);
    return metric ? parseInt(metric.deviceSummaryValue).toLocaleString() : "0";
  };

  const totalRecords = devices.length > 0 ? devices[0].totalRows : 0;
  const onlineCount = summary.find(m => m.deviceSummaryName === "onlineRouterCount")?.deviceSummaryValue || "0";
  const offlineCount = summary.find(m => m.deviceSummaryName === "offlineRouterCount")?.deviceSummaryValue || "0";
  const activeCount = summary.find(m => m.deviceSummaryName === "activeDeviceCount")?.deviceSummaryValue || "0";
  const totalCount = summary.find(m => m.deviceSummaryName === "totalDeviceCount")?.deviceSummaryValue || "1";

  const onlinePercent = Math.round((parseInt(onlineCount) / parseInt(totalCount)) * 100);
  const activePercent = Math.round((parseInt(activeCount) / parseInt(totalCount)) * 100);
  const offlinePercent = Math.round((parseInt(offlineCount) / parseInt(totalCount)) * 100);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Device Management</h1>
        <div className="text-sm text-slate-500">Last Updated On: {new Date().toLocaleString()}</div>
      </div>

      {/* Overall Analysis Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-600">Overall Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
            <div className="p-4 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Total Device Count</div>
              <div className="text-lg font-bold">{getMetric("totalDeviceCount")}</div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Total Online Router Count | %</div>
              <div className="text-lg font-bold">{parseInt(onlineCount).toLocaleString()} | {onlinePercent}%</div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Total Active Device Count | %</div>
              <div className="text-lg font-bold">{parseInt(activeCount).toLocaleString()} | {activePercent}%</div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Total Offline Router Count | %</div>
              <div className="text-lg font-bold">{parseInt(offlineCount).toLocaleString()} | {offlinePercent}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device List Section */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold">Total Record(s):</span> {totalRecords.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by MAC, Product Name..." className="pl-8 h-9 text-sm" />
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-md border border-slate-200">
              <Filter className="h-4 w-4 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-md border border-slate-200">
              <Download className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-slate-500 text-sm">Fetching devices...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center space-y-4">
              <div className="text-red-500 font-medium">{error}</div>
              <p className="text-slate-500 text-sm">The API requires a valid Azure AD token. Please ensure you are logged in.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">MAC</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">Product Name</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">Package Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">Device Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">SIM1</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">SIM1 Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">Router Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">Ethernet</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-slate-600">Wi-Fi Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow 
                    key={device.deviceId} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/device/${encodeURIComponent(device.mac)}`, { state: { deviceId: device.deviceId } })}
                  >
                    <TableCell>
                      <input type="checkbox" className="rounded border-slate-300" onClick={(e) => e.stopPropagation()} />
                    </TableCell>
                    <TableCell className="font-medium text-blue-600 hover:underline">{device.mac}</TableCell>
                    <TableCell className="text-sm">{device.productName || '-'}</TableCell>
                    <TableCell className="text-sm">{device.packageStatus || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={device.deviceStatusName === 'Active' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold">
                        {device.deviceStatusName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{device.siM1 || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold ${device.siM1Status === 'Activated' ? 'border-green-200 text-green-700 bg-green-50' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                        {device.siM1Status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${device.routerStatus === 'Online' ? 'text-green-600' : 'text-slate-400'}`}>
                        {device.routerStatus || 'Offline'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{device.ethernetStatus || '-'}</TableCell>
                    <TableCell className="text-sm">{device.wifiStatus || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
