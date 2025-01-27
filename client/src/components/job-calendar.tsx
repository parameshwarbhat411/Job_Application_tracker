import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format, isFuture } from "date-fns";
import { Loader2 } from "lucide-react";
import type { Job } from "@db/schema";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";

export function JobCalendar() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const response = await fetch("/api/jobs", {
        headers: {
          "X-User-Id": user.uid,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Create event dates map for highlighting
  const eventDates = jobs?.reduce((acc, job) => {
    const now = new Date();

    // Only include future dates
    if (job.interviewDate && isFuture(new Date(job.interviewDate))) {
      const date = new Date(job.interviewDate);
      const key = format(date, "yyyy-MM-dd");
      if (!acc[key]) acc[key] = [];
      acc[key].push({ type: "Interview", job });
    }

    return acc;
  }, {} as Record<string, Array<{ type: string; job: Job }>>);

  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedDateEvents = eventDates?.[selectedDateStr] || [];

  const modifiers = {
    event: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return !!eventDates?.[dateStr];
    },
  };

  const modifiersStyles = {
    event: {
      backgroundColor: "rgb(59 130 246 / 0.1)",
      borderRadius: "100%",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>
            View your upcoming interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events for {format(selectedDate || new Date(), "PP")}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events for this date</p>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map(({ type, job }, index) => (
                <div key={`${job.id}-${type}-${index}`} className="space-y-1">
                  <p className="text-sm font-medium">{type}</p>
                  <p className="text-sm">{job.companyName}</p>
                  <p className="text-sm text-muted-foreground">{job.jobTitle}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}