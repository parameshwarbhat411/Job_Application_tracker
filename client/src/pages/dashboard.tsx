import { JobForm } from "@/components/job-form";
import { JobList } from "@/components/job-list";
import { JobCalendar } from "@/components/job-calendar";
import { JobAnalytics } from "@/components/job-analytics";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@db/schema";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user, logout } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const { data: jobs = [] } = useQuery<Job[]>({
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

  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        className="border-b bg-background/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Track</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.displayName || user?.email}
            </span>
            <ThemeSwitcher />
            <Button variant="outline" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <motion.main 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <motion.h2 
              className="text-xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Your Applications
            </motion.h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl w-[90vw] p-6 overflow-hidden">
                <JobForm onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs 
            defaultValue="list" 
            className="space-y-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="list" forceMount={activeTab === "list"}>
                  <JobList jobs={jobs} />
                </TabsContent>
                <TabsContent value="calendar" forceMount={activeTab === "calendar"}>
                  <JobCalendar />
                </TabsContent>
                <TabsContent value="analytics" forceMount={activeTab === "analytics"}>
                  <JobAnalytics jobs={jobs} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.main>
    </div>
  );
}