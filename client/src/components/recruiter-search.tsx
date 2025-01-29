import { useState, useCallback } from "react";
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
import { Loader2, Mail, Linkedin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recruiter {
  name: string;
  title: string;
  email?: string;
  linkedin_url?: string;
  organization_name: string;
}

interface SearchResponse {
  message: string;
  recruiters: Recruiter[];
}

export function RecruiterSearch() {
  const [companyName, setCompanyName] = useState("");
  const { toast } = useToast();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<SearchResponse>({
    queryKey: ["/api/search-recruiters", companyName],
    queryFn: async () => {
      if (!companyName.trim()) return null;

      const response = await fetch("/api/search-recruiters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: companyName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to search recruiters");
      }

      return response.json();
    },
    enabled: false, // Don't auto-fetch, we'll manually trigger with refetch
    retry: false, // Don't retry on failure
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a company name",
      });
      return;
    }
    try {
      await refetch();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to search recruiters",
      });
    }
  }, [companyName, refetch, toast]);

  const recruiters = data?.recruiters || [];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Find Company Recruiters</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Enter company name..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="pl-10"
          />
        </div>
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
              {recruiters.map((recruiter: Recruiter, index: number) => (
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
        <div className="text-center py-8">
          <p className="text-muted-foreground">{data.message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try searching with a different company name or check the spelling
          </p>
        </div>
      ) : null}
    </Card>
  );
}