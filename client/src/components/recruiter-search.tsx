```tsx
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

  const { data: recruiters, isLoading } = useQuery<Recruiter[]>({
    queryKey: ["/api/search-recruiters", companyName, searchTrigger],
    queryFn: async () => {
      if (!companyName) return [];

      const response = await fetch("/api/search-recruiters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recruiters");
      }

      return response.json();
    },
    enabled: !!companyName && searchTrigger > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTrigger(prev => prev + 1);
  };

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
        <Button type="submit" disabled={isLoading || !companyName}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Search
        </Button>
      </form>

      {recruiters?.length ? (
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
                  <TableCell>{recruiter.name}</TableCell>
                  <TableCell>{recruiter.title}</TableCell>
                  <TableCell>{recruiter.organization_name}</TableCell>
                  <TableCell className="flex gap-2">
                    {recruiter.email && (
                      <a
                        href={`mailto:${recruiter.email}`}
                        className="text-blue-500 hover:text-blue-700"
                        title="Send email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {recruiter.linkedin_url && (
                      <a
                        href={recruiter.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        title="View LinkedIn profile"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : searchTrigger > 0 && !isLoading ? (
        <p className="text-center text-muted-foreground">
          No recruiters found for this company.
        </p>
      ) : null}
    </Card>
  );
}
```
