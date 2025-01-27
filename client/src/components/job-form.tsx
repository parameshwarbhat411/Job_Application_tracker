import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const statusOptions = ["Not Started", "In Progress", "Completed", "Rejected"] as const;

const jobSchema = z.object({
  companyName: z.string().min(1),
  jobTitle: z.string().min(1),
  location: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  applicationDate: z.string(),
  recruiterStatus: z.enum(statusOptions),
  referralStatus: z.enum(statusOptions),
  assessmentStatus: z.enum(statusOptions),
  interviewStatus: z.enum(statusOptions),
  applicationStatus: z.enum(statusOptions),
  notes: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export function JobForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      applicationDate: new Date().toISOString().split("T")[0],
      recruiterStatus: "Not Started",
      referralStatus: "Not Started",
      assessmentStatus: "Not Started",
      interviewStatus: "Not Started",
      applicationStatus: "Not Started",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      if (!user) throw new Error("Not authenticated");

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-User-Id": user.uid
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create job application");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Success", description: "Job application added" });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add job application",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="applicationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {["recruiterStatus", "referralStatus", "assessmentStatus", "interviewStatus", "applicationStatus"].map((status) => (
            <FormField
              key={status}
              control={form.control}
              name={status as keyof JobFormData}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{status.replace(/Status$/, "").replace(/^./, (str) => str.toUpperCase())}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Application
        </Button>
      </form>
    </Form>
  );
}