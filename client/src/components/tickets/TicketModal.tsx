import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Ticket, TicketFormData, Category, User } from "@/lib/types";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Ticket; // If provided, it's edit mode
}

const TicketModal = ({ isOpen, onClose, ticket }: TicketModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!ticket;
  
  // Fetch categories and users for select dropdowns
  const { data: categories } = useQuery<Category[]>({ 
    queryKey: ['/api/categories'],
    enabled: isOpen
  });
  
  const { data: users } = useQuery<User[]>({ 
    queryKey: ['/api/users'],
    enabled: isOpen
  });
  
  // Form validation schema
  const formSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    priority: z.enum(["low", "medium", "high"]),
    categoryId: z.string().optional(),
    assignedToId: z.string().optional(),
  });
  
  // Set up form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: ticket?.subject || "",
      description: ticket?.description || "",
      priority: ticket?.priority || "medium",
      categoryId: ticket?.categoryId?.toString() || "",
      assignedToId: ticket?.assignedToId?.toString() || "",
    },
  });
  
  // Handle form submission
  const createMutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const transformedData = {
        ...data,
        categoryId: data.categoryId ? parseInt(data.categoryId as string) : undefined,
        assignedToId: data.assignedToId ? parseInt(data.assignedToId as string) : undefined,
        // For demo purposes, we'll use a fixed user ID as the creator
        createdById: 1
      };
      
      const res = await apiRequest("POST", "/api/tickets", transformedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create ticket: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const transformedData = {
        ...data,
        categoryId: data.categoryId ? parseInt(data.categoryId as string) : undefined,
        assignedToId: data.assignedToId ? parseInt(data.assignedToId as string) : undefined,
      };
      
      const res = await apiRequest("PUT", `/api/tickets/${ticket?.id}`, transformedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update ticket: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEditMode) {
      updateMutation.mutate(data as TicketFormData);
    } else {
      createMutation.mutate(data as TicketFormData);
    }
  };
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Ticket" : "Create New Ticket"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the ticket details below" 
              : "Fill in the details to create a new support ticket"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue"
              {...form.register("subject")}
              className="mt-1"
            />
            {form.formState.errors.subject && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.subject.message}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select
                onValueChange={(value) => form.setValue("categoryId", value)}
                defaultValue={form.getValues("categoryId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Priority
              </Label>
              <Select
                onValueChange={(value) => form.setValue("priority", value as "low" | "medium" | "high")}
                defaultValue={form.getValues("priority")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue"
              rows={5}
              {...form.register("description")}
              className="mt-1"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="assignee" className="text-sm font-medium text-gray-700">
              Assign To
            </Label>
            <Select
              onValueChange={(value) => form.setValue("assignedToId", value)}
              defaultValue={form.getValues("assignedToId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Agents</SelectLabel>
                  {users?.filter(user => user.role === "admin" || user.role === "agent")
                    .map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? "Updating..." : "Creating..."}
                </span>
              ) : (
                isEditMode ? "Update Ticket" : "Create Ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
