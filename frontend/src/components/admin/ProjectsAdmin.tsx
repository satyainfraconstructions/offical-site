import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Save, Plus, Edit2, Trash2, X, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OngoingProject {
  _id?: string; // Add _id for MongoDB
  id?: number; // Optional for compatibility
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
  _id?: string; // Add _id for MongoDB
  id?: number; // Optional for compatibility
  title: string;
  location: string;
  budget: string;
  completedDate: string;
  team: number;
  duration: string;
  description: string;
}

const statusOptions = ["On Track", "Delayed", "Ahead of Schedule", "On Hold"];
const API_BASE = "http://localhost:5000";

export default function ProjectsAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>([]);
  const [completedProjects, setCompletedProjects] = useState<
    CompletedProject[]
  >([]);
  const [editingOngoing, setEditingOngoing] = useState<string | null>(null); // Use string for _id
  const [editingCompleted, setEditingCompleted] = useState<string | null>(null); // Use string for _id
  const [isAddingOngoing, setIsAddingOngoing] = useState(false);
  const [isAddingCompleted, setIsAddingCompleted] = useState(false);

  const [newOngoingProject, setNewOngoingProject] = useState<
    Partial<OngoingProject>
  >({
    title: "",
    location: "",
    budget: "",
    completion: 0,
    startDate: "",
    expectedCompletion: "",
    team: 0,
    status: "On Track",
    description: "",
  });

  const [newCompletedProject, setNewCompletedProject] = useState<
    Partial<CompletedProject>
  >({
    title: "",
    location: "",
    budget: "",
    completedDate: "",
    team: 0,
    duration: "",
    description: "",
  });

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched projects:", data);
      setOngoingProjects(data.ongoingProjects || []);
      setCompletedProjects(data.completedProjects || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Ongoing Projects Handlers
  const handleAddOngoingProject = async () => {
    if (
      !newOngoingProject.title ||
      !newOngoingProject.location ||
      !newOngoingProject.description
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/ongoing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOngoingProject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNewOngoingProject({
        title: "",
        location: "",
        budget: "",
        completion: 0,
        startDate: "",
        expectedCompletion: "",
        team: 0,
        status: "On Track",
        description: "",
      });
      setIsAddingOngoing(false);
      await fetchProjects();
      toast({
        title: "Project added",
        description: "New ongoing project has been added successfully",
      });
    } catch (err) {
      console.error("Failed to add ongoing project:", err);
      toast({
        title: "Error",
        description: "Failed to add ongoing project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOngoingProject = async (
    _id: string,
    updatedProject: Partial<OngoingProject>
  ) => {
    console.log("Editing project with _id:", _id, "Data:", updatedProject);
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/ongoing/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("PUT response error:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }
      await response.json();
      setEditingOngoing(null);
      await fetchProjects();
      toast({
        title: "Project updated",
        description: "Changes have been saved successfully",
      });
    } catch (err) {
      console.error("Failed to update ongoing project:", err);
      toast({
        title: "Error",
        description: "Failed to update ongoing project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOngoingProject = async (_id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/ongoing/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchProjects();
      toast({
        title: "Project deleted",
        description: "Ongoing project has been removed",
      });
    } catch (err) {
      console.error("Failed to delete ongoing project:", err);
      toast({
        title: "Error",
        description: "Failed to delete ongoing project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Completed Projects Handlers
  const handleAddCompletedProject = async () => {
    if (
      !newCompletedProject.title ||
      !newCompletedProject.location ||
      !newCompletedProject.description
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/completed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompletedProject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNewCompletedProject({
        title: "",
        location: "",
        budget: "",
        completedDate: "",
        team: 0,
        duration: "",
        description: "",
      });
      setIsAddingCompleted(false);
      await fetchProjects();
      toast({
        title: "Project added",
        description: "New completed project has been added successfully",
      });
    } catch (err) {
      console.error("Failed to add completed project:", err);
      toast({
        title: "Error",
        description: "Failed to add completed project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCompletedProject = async (
    _id: string,
    updatedProject: Partial<CompletedProject>
  ) => {
    console.log(
      "Editing completed project with _id:",
      _id,
      "Data:",
      updatedProject
    );
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE}/api/projects/completed/${_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProject),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("PUT response error:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }
      await response.json();
      setEditingCompleted(null);
      await fetchProjects();
      toast({
        title: "Project updated",
        description: "Changes have been saved successfully",
      });
    } catch (err) {
      console.error("Failed to update completed project:", err);
      toast({
        title: "Error",
        description: "Failed to update completed project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompletedProject = async (_id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE}/api/projects/completed/${_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchProjects();
      toast({
        title: "Project deleted",
        description: "Completed project has been removed",
      });
    } catch (err) {
      console.error("Failed to delete completed project:", err);
      toast({
        title: "Error",
        description: "Failed to delete completed project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { bg: string; text: string; border: string; label: string }
    > = {
      "On Track": {
        bg: "bg-emerald-500/10",
        text: "text-emerald-700",
        border: "border-emerald-500/20",
        label: "On Track",
      },
      Delayed: {
        bg: "bg-red-500/10",
        text: "text-red-700",
        border: "border-red-500/20",
        label: "Delayed",
      },
      "Ahead of Schedule": {
        bg: "bg-blue-500/10",
        text: "text-blue-700",
        border: "border-blue-500/20",
        label: "Ahead",
      },
      "On Hold": {
        bg: "bg-amber-500/10",
        text: "text-amber-700",
        border: "border-amber-500/20",
        label: "On Hold",
      },
    };

    const v = variants[status] ?? {
      bg: "bg-gray-500/10",
      text: "text-gray-700",
      border: "border-gray-500/20",
      label: status,
    };

    return (
      <Badge
        variant="outline"
        className={`${v.bg} ${v.text} ${v.border} border font-medium px-2 py-0.5 text-xs`}
      >
        {v.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ongoing" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ongoing Projects ({ongoingProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed Projects ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        {/* Ongoing Projects Tab */}
        <TabsContent value="ongoing">
          <div className="space-y-6">
            {/* Add New Ongoing Project */}
            <Card>
              <CardHeader>
                <CardTitle>Add Ongoing Project</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAddingOngoing ? (
                  <Button
                    onClick={() => setIsAddingOngoing(true)}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Ongoing Project
                  </Button>
                ) : (
                  <AddOngoingProjectForm
                    project={newOngoingProject}
                    setProject={setNewOngoingProject}
                    onSave={handleAddOngoingProject}
                    onCancel={() => {
                      setIsAddingOngoing(false);
                      setNewOngoingProject({
                        title: "",
                        location: "",
                        budget: "",
                        completion: 0,
                        startDate: "",
                        expectedCompletion: "",
                        team: 0,
                        status: "On Track",
                        description: "",
                      });
                    }}
                    disabled={isLoading}
                  />
                )}
              </CardContent>
            </Card>

            {/* Ongoing Projects List */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Ongoing Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ongoingProjects.map((project) => (
                    <Card key={project._id || project.id} className="p-4">
                      {editingOngoing === (project._id || project.id) ? (
                        <EditOngoingProjectForm
                          project={project}
                          onSave={(updatedProject) =>
                            handleEditOngoingProject(
                              project._id || project.id!,
                              updatedProject
                            )
                          }
                          onCancel={() => setEditingOngoing(null)}
                          disabled={isLoading}
                        />
                      ) : (
                        <OngoingProjectCard
                          project={project}
                          onEdit={() =>
                            setEditingOngoing(project._id || project.id!)
                          }
                          onDelete={() =>
                            handleDeleteOngoingProject(
                              project._id || project.id!
                            )
                          }
                          getStatusBadge={getStatusBadge}
                        />
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Completed Projects Tab */}
        <TabsContent value="completed">
          <div className="space-y-6">
            {/* Add New Completed Project */}
            <Card>
              <CardHeader>
                <CardTitle>Add Completed Project</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAddingCompleted ? (
                  <Button
                    onClick={() => setIsAddingCompleted(true)}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Completed Project
                  </Button>
                ) : (
                  <AddCompletedProjectForm
                    project={newCompletedProject}
                    setProject={setNewCompletedProject}
                    onSave={handleAddCompletedProject}
                    onCancel={() => {
                      setIsAddingCompleted(false);
                      setNewCompletedProject({
                        title: "",
                        location: "",
                        budget: "",
                        completedDate: "",
                        team: 0,
                        duration: "",
                        description: "",
                      });
                    }}
                    disabled={isLoading}
                  />
                )}
              </CardContent>
            </Card>

            {/* Completed Projects List */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Completed Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedProjects.map((project) => (
                    <Card key={project._id || project.id} className="p-4">
                      {editingCompleted === (project._id || project.id) ? (
                        <EditCompletedProjectForm
                          project={project}
                          onSave={(updatedProject) =>
                            handleEditCompletedProject(
                              project._id || project.id!,
                              updatedProject
                            )
                          }
                          onCancel={() => setEditingCompleted(null)}
                          disabled={isLoading}
                        />
                      ) : (
                        <CompletedProjectCard
                          project={project}
                          onEdit={() =>
                            setEditingCompleted(project._id || project.id!)
                          }
                          onDelete={() =>
                            handleDeleteCompletedProject(
                              project._id || project.id!
                            )
                          }
                        />
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
interface FormProps<T> {
  project: Partial<T>;
  setProject: (project: Partial<T>) => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

function AddOngoingProjectForm({
  project,
  setProject,
  onSave,
  onCancel,
  disabled,
}: FormProps<OngoingProject>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Title *</Label>
          <Input
            value={project.title || ""}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="Enter project title"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Location *</Label>
          <Input
            value={project.location || ""}
            onChange={(e) =>
              setProject({ ...project, location: e.target.value })
            }
            placeholder="Enter project location"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Budget</Label>
          <Input
            value={project.budget || ""}
            onChange={(e) => setProject({ ...project, budget: e.target.value })}
            placeholder="e.g., $15.2M"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Team Size</Label>
          <Input
            type="number"
            value={project.team || ""}
            onChange={(e) =>
              setProject({ ...project, team: parseInt(e.target.value) || 0 })
            }
            placeholder="Number of team members"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input
            value={project.startDate || ""}
            onChange={(e) =>
              setProject({ ...project, startDate: e.target.value })
            }
            placeholder="e.g., Jan 2024"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Expected Completion</Label>
          <Input
            value={project.expectedCompletion || ""}
            onChange={(e) =>
              setProject({ ...project, expectedCompletion: e.target.value })
            }
            placeholder="e.g., Dec 2024"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Completion %</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={project.completion || ""}
            onChange={(e) =>
              setProject({
                ...project,
                completion: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0-100"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={project.status || ""}
            onValueChange={(value) => setProject({ ...project, status: value })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Description *</Label>
        <Textarea
          value={project.description || ""}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          placeholder="Enter project description"
          rows={3}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave} disabled={disabled}>
          <Save className="w-4 h-4 mr-2" />
          Add Project
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={disabled}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

function AddCompletedProjectForm({
  project,
  setProject,
  onSave,
  onCancel,
  disabled,
}: FormProps<CompletedProject>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Title *</Label>
          <Input
            value={project.title || ""}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="Enter project title"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Location *</Label>
          <Input
            value={project.location || ""}
            onChange={(e) =>
              setProject({ ...project, location: e.target.value })
            }
            placeholder="Enter project location"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Budget</Label>
          <Input
            value={project.budget || ""}
            onChange={(e) => setProject({ ...project, budget: e.target.value })}
            placeholder="e.g., $18.9M"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Team Size</Label>
          <Input
            type="number"
            value={project.team || ""}
            onChange={(e) =>
              setProject({ ...project, team: parseInt(e.target.value) || 0 })
            }
            placeholder="Number of team members"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Completed Date</Label>
          <Input
            value={project.completedDate || ""}
            onChange={(e) =>
              setProject({ ...project, completedDate: e.target.value })
            }
            placeholder="e.g., Nov 2023"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            value={project.duration || ""}
            onChange={(e) =>
              setProject({ ...project, duration: e.target.value })
            }
            placeholder="e.g., 18 months"
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <Label>Description *</Label>
        <Textarea
          value={project.description || ""}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          placeholder="Enter project description"
          rows={3}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave} disabled={disabled}>
          <Save className="w-4 h-4 mr-2" />
          Add Project
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={disabled}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

function OngoingProjectCard({
  project,
  onEdit,
  onDelete,
  getStatusBadge,
}: {
  project: OngoingProject;
  onEdit: () => void;
  onDelete: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          {getStatusBadge(project.status)}
        </div>
        <p className="text-muted-foreground mb-3">{project.description}</p>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.completion}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="construction-gradient h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.completion}%` }}
            />
          </div>
          {/* <Progress value={project.completion} className="h-2" /> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Location:</strong> {project.location}
          </div>
          <div>
            <strong>Budget:</strong> {project.budget}
          </div>
          <div>
            <strong>Team:</strong> {project.team} members
          </div>
          <div>
            <strong>Due:</strong> {project.expectedCompletion}
          </div>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function CompletedProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: CompletedProject;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <Badge className="bg-success/10 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        </div>
        <p className="text-muted-foreground mb-3">{project.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Location:</strong> {project.location}
          </div>
          <div>
            <strong>Budget:</strong> {project.budget}
          </div>
          <div>
            <strong>Team:</strong> {project.team} members
          </div>
          <div>
            <strong>Duration:</strong> {project.duration}
          </div>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function EditOngoingProjectForm({
  project,
  onSave,
  onCancel,
  disabled,
}: {
  project: OngoingProject;
  onSave: (project: Partial<OngoingProject>) => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const [editedProject, setEditedProject] = useState(project);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Title</Label>
          <Input
            value={editedProject.title}
            onChange={(e) =>
              setEditedProject({ ...editedProject, title: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={editedProject.location}
            onChange={(e) =>
              setEditedProject({ ...editedProject, location: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Budget</Label>
          <Input
            value={editedProject.budget}
            onChange={(e) =>
              setEditedProject({ ...editedProject, budget: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Completion %</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={editedProject.completion}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                completion: parseInt(e.target.value) || 0,
              })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={editedProject.status}
            onValueChange={(value) =>
              setEditedProject({ ...editedProject, status: value })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Expected Completion</Label>
          <Input
            value={editedProject.expectedCompletion}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                expectedCompletion: e.target.value,
              })
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={editedProject.description}
          onChange={(e) =>
            setEditedProject({ ...editedProject, description: e.target.value })
          }
          rows={3}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(editedProject)}
          size="sm"
          disabled={disabled}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          size="sm"
          disabled={disabled}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

function EditCompletedProjectForm({
  project,
  onSave,
  onCancel,
  disabled,
}: {
  project: CompletedProject;
  onSave: (project: Partial<CompletedProject>) => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const [editedProject, setEditedProject] = useState(project);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Title</Label>
          <Input
            value={editedProject.title}
            onChange={(e) =>
              setEditedProject({ ...editedProject, title: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={editedProject.location}
            onChange={(e) =>
              setEditedProject({ ...editedProject, location: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Budget</Label>
          <Input
            value={editedProject.budget}
            onChange={(e) =>
              setEditedProject({ ...editedProject, budget: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Completed Date</Label>
          <Input
            value={editedProject.completedDate}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                completedDate: e.target.value,
              })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            value={editedProject.duration}
            onChange={(e) =>
              setEditedProject({ ...editedProject, duration: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Team Size</Label>
          <Input
            type="number"
            value={editedProject.team}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                team: parseInt(e.target.value) || 0,
              })
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={editedProject.description}
          onChange={(e) =>
            setEditedProject({ ...editedProject, description: e.target.value })
          }
          rows={3}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(editedProject)}
          size="sm"
          disabled={disabled}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          size="sm"
          disabled={disabled}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
