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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Linkedin, Search, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Company {
  name: string;
  domain: string;
  website_url?: string;
  logo_url?: string;
}

interface Recruiter {
  name: string;
  title: string;
  email?: string;
  linkedin_url?: string;
  organization_name: string;
}

interface SearchResponse {
  message: string;
  companies?: Company[];
  recruiters?: Recruiter[];
}

export function RecruiterSearch() {
  const [companyName, setCompanyName] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const { toast } = useToast();

  const {
    data: companyData,
    isLoading: isLoadingCompanies,
    refetch: searchCompanies
  } = useQuery<SearchResponse>({
    queryKey: ["/api/search-recruiters/companies", companyName],
    queryFn: async () => {
      if (!companyName.trim()) return null;

      const response = await fetch("/api/search-recruiters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          companyName: companyName.trim(),
          type: "company_search"
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to search companies");
      }

      return response.json();
    },
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: recruiterData,
    isLoading: isLoadingRecruiters,
    refetch: searchRecruiters
  } = useQuery<SearchResponse>({
    queryKey: ["/api/search-recruiters/recruiters", selectedDomain],
    queryFn: async () => {
      if (!selectedDomain) return null;

      const response = await fetch("/api/search-recruiters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          domain: selectedDomain,
          type: "recruiter_search"
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to search recruiters");
      }

      return response.json();
    },
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedDomain("");  // Reset domain selection when searching new company

    if (!companyName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a company name",
      });
      return;
    }
    try {
      await searchCompanies();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to search companies",
      });
    }
  }, [companyName, searchCompanies, toast]);

  const handleDomainSelect = async (domain: string) => {
    setSelectedDomain(domain);
    try {
      await searchRecruiters();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to search recruiters",
      });
    }
  };

  const companies = companyData?.companies || [];
  const recruiters = recruiterData?.recruiters || [];
  const isLoading = isLoadingCompanies || isLoadingRecruiters;

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
          {isLoadingCompanies ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : companies.length > 0 ? (
        <div className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {company.logo_url && (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="w-6 h-6 rounded"
                          />
                        )}
                        {company.name}
                      </div>
                    </TableCell>
                    <TableCell>{company.domain}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDomainSelect(company.domain)}
                        disabled={selectedDomain === company.domain}
                      >
                        {selectedDomain === company.domain ? 'Selected' : 'Select'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {recruiters.length > 0 && (
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
          )}
        </div>
      ) : companyData?.message ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{companyData.message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try searching with a different company name or check the spelling
          </p>
        </div>
      ) : null}
    </Card>
  );
}