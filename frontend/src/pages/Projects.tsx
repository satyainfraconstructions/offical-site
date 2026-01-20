import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, DollarSign, Users, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";


interface OngoingProject {
  id: number;
  title: string;
  location: string;
  budget: string;
  completion: number;
  startDate: string;
  expectedCompletion: string;
  team: number;
  status: string;
  description: string;
}

interface CompletedProject {
  id: number;
  title: string;
  location: string;
  budget: string;
  completedDate: string;
  team: number;
  duration: string;
  description: string;
}

interface ProjectsData {
  ongoingProjects: OngoingProject[];
  completedProjects: CompletedProject[];
}

const API_BASE = "http://localhost:5000";

export default function Projects() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE}/api/projects`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProjectsData = await response.json();
        setProjectsData(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-success/10 text-success";
      case "Delayed":
        return "bg-destructive/10 text-destructive";
      case "Ahead of Schedule":
        return "bg-primary/10 text-primary";
      case "On Hold":
        return "bg-muted/10 text-muted-foreground";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !projectsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">{error || "No projects available."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our current construction projects and explore our portfolio of successfully completed developments.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
            <TabsTrigger value="ongoing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Ongoing Projects
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed Projects
            </TabsTrigger>
          </TabsList>

          {/* Ongoing Projects */}
          <TabsContent value="ongoing">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {projectsData.ongoingProjects.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full">
                  No ongoing projects at the moment.
                </p>
              ) : (
                projectsData.ongoingProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-construction transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{project.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{project.completion}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="construction-gradient h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${project.completion}%` }}
                            />
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.budget}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.team} team members</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            <strong>Expected Completion:</strong> {project.expectedCompletion}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Completed Projects */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projectsData.completedProjects.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full">
                  No completed projects at the moment.
                </p>
              ) : (
                projectsData.completedProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-construction transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{project.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.budget}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.completedDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{project.team} team members</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            <strong>Project Duration:</strong> {project.duration}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="p-8 construction-gradient">
            <h2 className="text-3xl font-bold text-construction-foreground mb-4">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-construction-foreground/90 mb-8 max-w-2xl mx-auto">
              From concept to completion, we deliver exceptional construction projects on time and within budget.
            </p>
            <Link to="/contact">
            <Button variant="outline-construction" size="lg" className="bg-white/10 border-white text-dark">
              Discuss Your Project
            </Button>
            </Link> 
          </Card>
        </div>
      </div>
    </div>
  );
}