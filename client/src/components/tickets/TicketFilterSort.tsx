import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category, TicketFilters } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface TicketFilterSortProps {
  filters: TicketFilters;
  onFilterChange: (filters: TicketFilters) => void;
  onSort: (sortBy: string) => void;
}

const TicketFilterSort = ({ filters, onFilterChange, onSort }: TicketFilterSortProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<string[]>(filters.status || []);
  const [priorityFilters, setPriorityFilters] = useState<string[]>(filters.priority || []);
  
  const { data: categories } = useQuery<Category[]>({ queryKey: ['/api/categories'] });
  
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatusFilters = checked 
      ? [...statusFilters, status]
      : statusFilters.filter(s => s !== status);
    
    setStatusFilters(newStatusFilters);
  };
  
  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorityFilters = checked 
      ? [...priorityFilters, priority]
      : priorityFilters.filter(p => p !== priority);
    
    setPriorityFilters(newPriorityFilters);
  };
  
  const applyFilters = () => {
    onFilterChange({
      ...filters,
      status: statusFilters.length > 0 ? statusFilters as any[] : undefined,
      priority: priorityFilters.length > 0 ? priorityFilters as any[] : undefined,
    });
    setIsFilterOpen(false);
  };

  return (
    <div className="flex space-x-2">
      {/* Filters Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <span className="material-icons text-sm">filter_list</span>
            <span>Filters</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-open" 
                  checked={statusFilters.includes("open")}
                  onCheckedChange={(checked) => handleStatusChange("open", checked as boolean)}
                />
                <Label htmlFor="status-open" className="text-sm">Open</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-in-progress" 
                  checked={statusFilters.includes("in_progress")}
                  onCheckedChange={(checked) => handleStatusChange("in_progress", checked as boolean)}
                />
                <Label htmlFor="status-in-progress" className="text-sm">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-resolved" 
                  checked={statusFilters.includes("resolved")}
                  onCheckedChange={(checked) => handleStatusChange("resolved", checked as boolean)}
                />
                <Label htmlFor="status-resolved" className="text-sm">Resolved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-closed" 
                  checked={statusFilters.includes("closed")}
                  onCheckedChange={(checked) => handleStatusChange("closed", checked as boolean)}
                />
                <Label htmlFor="status-closed" className="text-sm">Closed</Label>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-700 mb-3 mt-4">Filter by Priority</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="priority-high" 
                  checked={priorityFilters.includes("high")}
                  onCheckedChange={(checked) => handlePriorityChange("high", checked as boolean)}
                />
                <Label htmlFor="priority-high" className="text-sm">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="priority-medium" 
                  checked={priorityFilters.includes("medium")}
                  onCheckedChange={(checked) => handlePriorityChange("medium", checked as boolean)}
                />
                <Label htmlFor="priority-medium" className="text-sm">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="priority-low" 
                  checked={priorityFilters.includes("low")}
                  onCheckedChange={(checked) => handlePriorityChange("low", checked as boolean)}
                />
                <Label htmlFor="priority-low" className="text-sm">Low</Label>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
              <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <span className="material-icons text-sm">sort</span>
            <span>Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSort("newest")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("oldest")}>
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("priority-high")}>
            Priority (High-Low)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("priority-low")}>
            Priority (Low-High)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TicketFilterSort;
