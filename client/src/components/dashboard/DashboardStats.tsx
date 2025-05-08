import StatsCard from "@/components/dashboard/StatsCard";
import { TicketStats } from "@/lib/types";

interface DashboardStatsProps {
  stats: TicketStats;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-300 h-32 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-300 h-32 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-300 h-32 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-300 h-32 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard 
        title="Open Tickets"
        value={stats.openTickets}
        icon="inbox"
        iconBgColor="bg-primary bg-opacity-10"
        iconColor="text-primary"
        trend={{
          value: "5%",
          isPositive: true,
          text: "vs last week"
        }}
        borderColor="border-primary"
      />
      
      <StatsCard 
        title="In Progress"
        value={stats.inProgressTickets}
        icon="pending_actions"
        iconBgColor="bg-warning bg-opacity-10"
        iconColor="text-warning"
        trend={{
          value: "2%",
          isPositive: false,
          text: "vs last week"
        }}
        borderColor="border-warning"
      />
      
      <StatsCard 
        title="Resolved Today"
        value={stats.resolvedTickets}
        icon="check_circle"
        iconBgColor="bg-success bg-opacity-10"
        iconColor="text-success"
        trend={{
          value: "12%",
          isPositive: true,
          text: "vs yesterday"
        }}
        borderColor="border-success"
      />
      
      <StatsCard 
        title="Avg Response Time"
        value={stats.avgResponseTime}
        icon="schedule"
        iconBgColor="bg-info bg-opacity-10"
        iconColor="text-info"
        trend={{
          value: "8%",
          isPositive: true,
          text: "improvement"
        }}
        borderColor="border-info"
      />
    </div>
  );
};

export default DashboardStats;
