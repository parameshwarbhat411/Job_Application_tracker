import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import type { Job } from "@db/schema";
import { motion, AnimatePresence } from "framer-motion";

type FilterType = "role" | "company" | "location";

interface JobAnalyticsProps {
  jobs: Job[];
}

const COLORS = {
  completed: "#22c55e", // green-500
  rejected: "#ef4444", // red-500
  inProgress: "#3b82f6", // blue-500
};

export function JobAnalytics({ jobs }: JobAnalyticsProps) {
  const [filterType, setFilterType] = useState<FilterType>("role");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique values for each filter type
  const filterOptions = useMemo(() => {
    const options = {
      role: Array.from(new Set(jobs.map((job) => job.jobTitle))),
      company: Array.from(new Set(jobs.map((job) => job.companyName))),
      location: Array.from(new Set(jobs.map((job) => job.location || "Not Specified"))),
    };
    return options;
  }, [jobs]);

  // Filter jobs based on search term and filter type
  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;

    return jobs.filter((job) => {
      const value = filterType === "role"
        ? job.jobTitle
        : filterType === "company"
          ? job.companyName
          : job.location || "Not Specified";

      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [jobs, filterType, searchTerm]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const completed = filteredJobs.filter(
      (job) => job.applicationStatus === "Completed"
    ).length;
    const rejected = filteredJobs.filter(
      (job) => job.applicationStatus === "Rejected"
    ).length;
    const inProgress = filteredJobs.filter(
      (job) => job.applicationStatus === "In Progress"
    ).length;
    const total = filteredJobs.length;

    return [
      { name: "Completed", value: completed, color: COLORS.completed },
      { name: "Rejected", value: rejected, color: COLORS.rejected },
      { name: "In Progress", value: inProgress, color: COLORS.inProgress },
    ];
  }, [filteredJobs]);

  const totalApplications = filteredJobs.length;

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Job Application Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value as FilterType);
                setSearchTerm("");
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search by ${filterType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="h-[300px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {statusCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.p
                className="text-3xl font-bold"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                {totalApplications}
              </motion.p>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                Total Applications
              </motion.p>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <AnimatePresence>
              {statusCounts.map((status, index) => (
                <motion.div
                  key={status.name}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${status.color}15` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.p
                    className="text-sm font-medium"
                    style={{ color: status.color }}
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {status.name}
                  </motion.p>
                  <motion.p
                    className="text-2xl font-bold mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {status.value}
                  </motion.p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <AnimatePresence>
            {filterOptions[filterType]
              .filter((option) =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((option, index) => {
                const count = filteredJobs.filter((job) => {
                  const value =
                    filterType === "role"
                      ? job.jobTitle
                      : filterType === "company"
                        ? job.companyName
                        : job.location || "Not Specified";
                  return value === option;
                }).length;

                return (
                  <motion.div
                    key={option}
                    className="p-3 rounded-lg bg-muted/50 flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-medium">{option}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} application{count !== 1 ? "s" : ""}
                    </span>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}