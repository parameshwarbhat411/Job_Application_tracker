import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recruiter {
  name: string;
  title: string;
  email?: string;
  linkedin_url?: string;
  organization_name: string;
}

export function RecruiterSearch() {
  const [companyName, setCompanyName] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/search-recruiters", companyName, searchTrigger],
    queryFn: async () => {
      if (!companyName) return null;

      const response = await fetch("/api/search-recruiters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to search recruiters");
      }

      return response.json();
    },
    enabled: !!companyName && searchTrigger > 0,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a company name",
      });
      return;
    }
    setSearchTrigger(prev => prev + 1);
  };

  const recruiters = data?.recruiters || [];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Find Company Recruiters</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Enter company name..."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !companyName.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : recruiters.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recruiters.map((recruiter, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{recruiter.name}</TableCell>
                  <TableCell>{recruiter.title}</TableCell>
                  <TableCell>{recruiter.organization_name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {recruiter.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                        >
                          <a
                            href={`mailto:${recruiter.email}`}
                            title="Send email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {recruiter.linkedin_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                        >
                          <a
                            href={recruiter.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View LinkedIn profile"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : data?.message ? (
        <p className="text-center text-muted-foreground py-8">
          {data.message}
        </p>
      ) : null}
    </Card>
  );
}