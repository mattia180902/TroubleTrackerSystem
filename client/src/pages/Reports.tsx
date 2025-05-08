import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ticket, TicketStats } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from "recharts";

const Reports = () => {
  const [timeRange, setTimeRange] = useState("week");
  
  // Fetch tickets and stats
  const { data: tickets, isLoading: ticketsLoading } = useQuery<Ticket[]>({ 
    queryKey: ['/api/tickets'],
    staleTime: 60000
  });

  const { data: stats, isLoading: statsLoading } = useQuery<TicketStats>({ 
    queryKey: ['/api/stats'],
    staleTime: 60000
  });

  // Calculate status distribution
  const statusData = tickets ? [
    { name: "Open", value: tickets.filter(t => t.status === "open").length },
    { name: "In Progress", value: tickets.filter(t => t.status === "in_progress").length },
    { name: "Resolved", value: tickets.filter(t => t.status === "resolved").length },
    { name: "Closed", value: tickets.filter(t => t.status === "closed").length },
  ] : [];

  // Calculate priority distribution
  const priorityData = tickets ? [
    { name: "High", value: tickets.filter(t => t.priority === "high").length },
    { name: "Medium", value: tickets.filter(t => t.priority === "medium").length },
    { name: "Low", value: tickets.filter(t => t.priority === "low").length },
  ] : [];

  // Mock data for ticket volume trends (in a real app, this would come from an API)
  const volumeTrendData = [
    { name: "Mon", tickets: 12 },
    { name: "Tue", tickets: 19 },
    { name: "Wed", tickets: 15 },
    { name: "Thu", tickets: 21 },
    { name: "Fri", tickets: 16 },
    { name: "Sat", tickets: 8 },
    { name: "Sun", tickets: 5 },
  ];

  // Mock data for resolution time (in a real app, this would come from an API)
  const resolutionTimeData = [
    { name: "Week 1", time: 4.2 },
    { name: "Week 2", time: 3.8 },
    { name: "Week 3", time: 3.5 },
    { name: "Week 4", time: 3.2 },
  ];

  // Colors for the charts
  const COLORS = {
    status: ["#1976d2", "#ff9800", "#4caf50", "#9e9e9e"],
    priority: ["#f44336", "#ff9800", "#4caf50"],
  };

  const isLoading = ticketsLoading || statsLoading;

  return (
    <>
      {/* Reports Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium text-gray-800">Reports</h2>
          <p className="text-gray-600 mt-1">Analytics and statistics of your support system</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Tickets</CardTitle>
            <CardDescription>Overall ticket count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats?.total || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Tickets</CardTitle>
            <CardDescription>Tickets pending resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats?.openTickets || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg Response Time</CardTitle>
            <CardDescription>Time to first response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats?.avgResponseTime || "N/A"
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resolution Rate</CardTitle>
            <CardDescription>Tickets resolved vs created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats && stats.total > 0 
                  ? `${Math.round((stats.resolvedTickets + stats.closedTickets) / stats.total * 100)}%` 
                  : "N/A"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ticket Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Breakdown of tickets by current status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.status[index % COLORS.status.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Ticket Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Priority Distribution</CardTitle>
            <CardDescription>Breakdown of tickets by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Tickets" barSize={60}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.priority[index % COLORS.priority.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Ticket Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Volume Trend</CardTitle>
            <CardDescription>Number of tickets created over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeTrendData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tickets" name="Tickets" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time Trend</CardTitle>
            <CardDescription>Average resolution time (hours) over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={resolutionTimeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} hours`, 'Resolution Time']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  name="Avg. Resolution Time"
                  stroke="#4caf50" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reports;
