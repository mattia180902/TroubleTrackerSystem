import { useState } from "react";
import TicketTable from "@/components/tickets/TicketTable";
import TicketFilterSort from "@/components/tickets/TicketFilterSort";
import TicketModal from "@/components/tickets/TicketModal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Ticket, TicketFilters } from "@/lib/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Tickets = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<TicketFilters>({});
  const [sortBy, setSortBy] = useState("newest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch tickets
  const { data: tickets, isLoading } = useQuery<Ticket[]>({ 
    queryKey: ['/api/tickets'],
    staleTime: 60000
  });
  
  const handleFilterChange = (newFilters: TicketFilters) => {
    setFilters(newFilters);
  };
  
  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
  };
  
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    // In a real application, this would navigate to a ticket detail page
    // or open a detailed view modal
    console.log("View ticket:", ticket);
  };
  
  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      await apiRequest("DELETE", `/api/tickets/${selectedTicket.id}`, null);
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
    }
  };
  
  // Apply filters, search and sorting to tickets
  const filteredTickets = tickets ? tickets.filter(ticket => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!ticket.subject.toLowerCase().includes(query) && 
          !ticket.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(ticket.status)) {
        return false;
      }
    }
    
    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(ticket.priority)) {
        return false;
      }
    }
    
    // Apply category filter
    if (filters.categoryId && ticket.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Apply assigned to filter
    if (filters.assignedToId && ticket.assignedToId !== filters.assignedToId) {
      return false;
    }
    
    return true;
  }) : [];
  
  // Apply sorting
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "priority-high":
        const priorityMap: Record<string, number> = { "high": 3, "medium": 2, "low": 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      case "priority-low":
        const priorityMapAsc: Record<string, number> = { "high": 3, "medium": 2, "low": 1 };
        return priorityMapAsc[a.priority] - priorityMapAsc[b.priority];
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <>
      {/* Tickets Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium text-gray-800">Tickets</h2>
          <p className="text-gray-600 mt-1">Manage all support tickets</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="material-icons text-sm mr-2">add</span>
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 p-4">
          <div className="mb-4 sm:mb-0 sm:w-1/3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons text-gray-500">search</span>
              </span>
              <Input
                type="text"
                placeholder="Search tickets..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <TicketFilterSort 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSort={handleSort}
          />
        </div>
        
        {/* Tickets Table */}
        <TicketTable 
          tickets={sortedTickets}
          onView={handleViewTicket}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
          isLoading={isLoading}
        />
      </div>
      
      {/* Create/Edit Ticket Modal */}
      <TicketModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      {selectedTicket && (
        <TicketModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTicket(null);
          }} 
          ticket={selectedTicket}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ticket
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTicket}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Tickets;
