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
import type { Job } from "@db/schema";

const statusOptions = ["Not Started", "In Progress", "Completed", "Rejected"] as const;

const jobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().nullish(),
  salaryMin: z.string().nullish(),
  salaryMax: z.string().nullish(),
  currentDate: z.string(),
  applicationDate: z.string().nullish(),
  interviewDate: z.string().nullish(),
  recruiterStatus: z.enum(statusOptions).default("Not Started"),
  referralStatus: z.enum(statusOptions).default("Not Started"),
  assessmentStatus: z.enum(statusOptions).default("Not Started"),
  interviewStatus: z.enum(statusOptions).default("Not Started"),
  applicationStatus: z.enum(statusOptions).default("Not Started"),
  notes: z.string().nullish(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: Job;
  onSuccess?: () => void;
}

export function JobForm({ job, onSuccess }: JobFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: job ? {
      ...job,
      currentDate: new Date().toISOString().split("T")[0],
      applicationDate: job.applicationDate ? new Date(job.applicationDate).toISOString().split("T")[0] : undefined,
      location: job.location || "",
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      notes: job.notes || "",
      interviewDate: job.interviewDate ? new Date(job.interviewDate).toISOString().split("T")[0] : undefined,
    } : {
      currentDate: new Date().toISOString().split("T")[0],
      applicationDate: undefined,
      recruiterStatus: "Not Started",
      referralStatus: "Not Started",
      assessmentStatus: "Not Started",
      interviewStatus: "Not Started",
      applicationStatus: "Not Started",
      location: "",
      salaryMin: "",
      salaryMax: "",
      notes: "",
      interviewDate: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      if (!user) throw new Error("Not authenticated");

      const url = job ? `/api/jobs/${job.id}` : "/api/jobs";
      const method = job ? "PUT" : "POST";

      const cleanData = {
        ...data,
        applicationDate: data.applicationDate
          ? new Date(data.applicationDate).toISOString().split('T')[0]
          : null,
        interviewDate: data.interviewDate
          ? new Date(data.interviewDate).toISOString().split('T')[0]
          : null
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.uid
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${job ? 'update' : 'create'} job application`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Success",
        description: `Job application ${job ? 'updated' : 'added'} successfully`
      });
      if (!job) {
        form.reset({
          currentDate: new Date().toISOString().split("T")[0],
          applicationDate: undefined,
          recruiterStatus: "Not Started",
          referralStatus: "Not Started",
          assessmentStatus: "Not Started",
          interviewStatus: "Not Started",
          applicationStatus: "Not Started",
          location: "",
          salaryMin: "",
          salaryMax: "",
          notes: "",
          interviewDate: undefined,
        });
      }
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to ${job ? 'update' : 'add'} job application`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="currentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
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
                <FormLabel>Job Title <span className="text-red-500">*</span></FormLabel>
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
                  <Input {...field} value={field.value || ''} />
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
                  <Input {...field} value={field.value || ''} />
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
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="applicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interviewDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["recruiterStatus", "referralStatus", "assessmentStatus", "interviewStatus", "applicationStatus"].map((status) => (
            <FormField
              key={status}
              control={form.control}
              name={status as keyof JobFormData}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{status.replace(/Status$/, "").replace(/^./, (str) => str.toUpperCase())}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {job ? 'Update Application' : 'Add Application'}
        </Button>
      </form>
    </Form>
  );
}