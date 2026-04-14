import { APIDevice, getAllDevices, getDashboardSummary, DeviceSummaryMetric } from "@/src/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export default function Dashboard() {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [devices, setDevices] = useState<APIDevice[]>([]);
  const [summary, setSummary] = useState<DeviceSummaryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination, Search, Sort State
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPageIndex(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const getAccessToken = async (): Promise<string> => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.error("Failed to acquire token silently:", error);
      // Try interactive login
      const response = await instance.acquireTokenRedirect(loginRequest);
      return response.accessToken;
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = await getAccessToken();
        const summaryData = await getDashboardSummary(token);
        setSummary(summaryData);
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };
    fetchSummary();
  }, [instance, accounts]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const token = await getAccessToken();
        const devicesData = await getAllDevices(
          token,
          pageIndex,
          pageSize,
          sortColumn,
          sortOrder,
          debouncedSearch
        );
        setDevices(devicesData);
        setError(null);
      } catch (err) {
        setError("Failed to load devices. Please ensure you are authenticated.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [pageIndex, pageSize, sortColumn, sortOrder, debouncedSearch, instance, accounts]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setPageIndex(0);
  };

  const getMetric = (name: string) => {
    const metric = summary.find(m => m.deviceSummaryName === name);
    return metric ? parseInt(metric.deviceSummaryValue).toLocaleString() : "0";
  };

  const totalRecords = devices.length > 0 ? devices[0].totalRows : 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
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
              <Input 
                placeholder="Search by MAC, Product Name..." 
                className="pl-8 h-9 text-sm" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
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
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead 
                      className="text-xs font-bold uppercase text-slate-600 cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort("mac")}
                    >
                      MAC {sortColumn === "mac" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="text-xs font-bold uppercase text-slate-600 cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort("productName")}
                    >
                      Product Name {sortColumn === "productName" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
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
              
              {/* Pagination Controls */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
                <div className="text-sm text-slate-500">
                  Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalRecords)} of {totalRecords} entries
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    className="text-sm border border-slate-200 rounded px-2 py-1"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageIndex(0);
                    }}
                  >
                    {[10, 25, 50, 100].map(size => (
                      <option key={size} value={size}>{size} per page</option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={pageIndex === 0}
                      onClick={() => setPageIndex(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center px-4 text-sm font-medium">
                      Page {pageIndex + 1} of {totalPages || 1}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={pageIndex >= totalPages - 1}
                      onClick={() => setPageIndex(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
