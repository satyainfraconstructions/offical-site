import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Plus, Edit2, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  description: string;
}

interface CompanyStats {
  id: number;
  label: string;
  value: string;
}

interface AboutData {
  content: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };
  teamMembers: TeamMember[];
  companyStats: CompanyStats[];
}

const VITE_API_URL = "http://localhost:5000"; // Adjust for your backend URL

export default function AboutAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // About Content State
  const [aboutContent, setAboutContent] = useState({
    title: "",
    description: "",
    mission: "",
    vision: ""
  });

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Company Stats State
  const [companyStats, setCompanyStats] = useState<CompanyStats[]>([]);

  const [editingTeamMember, setEditingTeamMember] = useState<number | null>(null);
  const [editingStats, setEditingStats] = useState<number | null>(null);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
  const [isAddingStats, setIsAddingStats] = useState(false);
  
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({
    name: "",
    position: "",
    description: ""
  });

  const [newStat, setNewStat] = useState<Partial<CompanyStats>>({
    label: "",
    value: ""
  });

  // Fetch About data from backend
  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AboutData = await response.json();
      
      setAboutContent(data.content);
      setTeamMembers(data.teamMembers || []);
      setCompanyStats(data.companyStats || []);
    } catch (error) {
      console.error("Failed to fetch About data:", error);
      toast({
        title: "Error",
        description: "Failed to load About data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleSaveAboutContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutContent),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      toast({
        title: "About content updated",
        description: "Changes have been saved successfully",
      });
    } catch (error) {
      console.error("Failed to save About content:", error);
      toast({
        title: "Error",
        description: "Failed to save About content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeamMember = async () => {
    if (!newTeamMember.name || !newTeamMember.position || !newTeamMember.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeamMember),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNewTeamMember({ name: "", position: "", description: "" });
      setIsAddingTeamMember(false);
      await fetchAboutData(); // Refetch to sync team members
      
      toast({
        title: "Team member added",
        description: "New team member has been added successfully",
      });
    } catch (error) {
      console.error("Failed to add team member:", error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTeamMember = async (id: number, updatedMember: Partial<TeamMember>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/team/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMember),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setEditingTeamMember(null);
      await fetchAboutData(); // Refetch to sync
      
      toast({
        title: "Team member updated",
        description: "Changes have been saved successfully",
      });
    } catch (error) {
      console.error("Failed to update team member:", error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/team/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchAboutData(); // Refetch to sync
      
      toast({
        title: "Team member deleted",
        description: "Team member has been removed",
      });
    } catch (error) {
      console.error("Failed to delete team member:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStats = async () => {
    if (!newStat.label || !newStat.value) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStat),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNewStat({ label: "", value: "" });
      setIsAddingStats(false);
      await fetchAboutData(); // Refetch to sync
      
      toast({
        title: "Statistic added",
        description: "New statistic has been added successfully",
      });
    } catch (error) {
      console.error("Failed to add statistic:", error);
      toast({
        title: "Error",
        description: "Failed to add statistic",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStats = async (id: number, updatedStat: Partial<CompanyStats>) => {
  const label = updatedStat.label?.trim();
  const value = updatedStat.value?.trim();

  if (!label || !value) {
    toast({
      title: "Error",
      description: "Label and value are required",
      variant: "destructive"
    });
    return;
  }

  try {
    setIsLoading(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label, value }), // Only send what backend expects
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${response.status}`);
    }

    await response.json();
    setEditingStats(null);
    await fetchAboutData();

    toast({
      title: "Statistic updated",
      description: "Changes saved successfully",
    });
  } catch (error: any) {
    console.error("Failed to update statistic:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to update",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleDeleteStats = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchAboutData(); // Refetch to sync
      
      toast({
        title: "Statistic deleted",
        description: "Statistic has been removed",
      });
    } catch (error) {
      console.error("Failed to delete statistic:", error);
      toast({
        title: "Error",
        description: "Failed to delete statistic",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* About Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="about-title">Page Title</Label>
                <Input
                  id="about-title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-description">Main Description</Label>
                <Textarea
                  id="about-description"
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-mission">Mission Statement</Label>
                <Textarea
                  id="about-mission"
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="about-vision">Vision Statement</Label>
                <Textarea
                  id="about-vision"
                  value={aboutContent.vision}
                  onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <Button onClick={handleSaveAboutContent} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="space-y-6">
            {/* Add New Team Member */}
            <Card>
              <CardHeader>
                <CardTitle>Add Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAddingTeamMember ? (
                  <Button onClick={() => setIsAddingTeamMember(true)} disabled={isLoading} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Team Member
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={newTeamMember.name || ""}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                          placeholder="Enter full name"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={newTeamMember.position || ""}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, position: e.target.value })}
                          placeholder="Enter job title"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTeamMember.description || ""}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, description: e.target.value })}
                        placeholder="Enter member description"
                        rows={3}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddTeamMember} disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingTeamMember(false);
                          setNewTeamMember({ name: "", position: "", description: "" });
                        }}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Members List */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({teamMembers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="p-4">
                      {editingTeamMember === member.id ? (
                        <EditTeamMemberForm 
                          member={member}
                          onSave={(updatedMember) => handleEditTeamMember(member.id, updatedMember)}
                          onCancel={() => setEditingTeamMember(null)}
                          disabled={isLoading}
                        />
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-primary font-medium">{member.position}</p>
                            <p className="text-muted-foreground mt-1">{member.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTeamMember(member.id)}
                              disabled={isLoading}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTeamMember(member.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="space-y-6">
            {/* Add New Statistic */}
            <Card>
              <CardHeader>
                <CardTitle>Add Company Statistic</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAddingStats ? (
                  <Button onClick={() => setIsAddingStats(true)} disabled={isLoading} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Statistic
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={newStat.label || ""}
                          onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                          placeholder="e.g., Projects Completed"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label>Value</Label>
                        <Input
                          value={newStat.value || ""}
                          onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                          placeholder="e.g., 500+"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddStats} disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Add Statistic
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingStats(false);
                          setNewStat({ label: "", value: "" });
                        }}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics List */}
            <Card>
              <CardHeader>
                <CardTitle>Company Statistics ({companyStats.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyStats.map((stat) => (
                    <Card key={stat.id} className="p-4">
                      {editingStats === stat.id ? (
                        <EditStatsForm 
                          stat={stat}
                          onSave={(updatedStat) => handleEditStats(stat.id, updatedStat)}
                          onCancel={() => setEditingStats(null)}
                          disabled={isLoading}
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingStats(stat.id)}
                              disabled={isLoading}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStats(stat.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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

// Helper Components (updated to accept disabled prop)
function EditTeamMemberForm({ 
  member, 
  onSave, 
  onCancel,
  disabled 
}: { 
  member: TeamMember; 
  onSave: (member: Partial<TeamMember>) => void; 
  onCancel: () => void;
  disabled: boolean;
}) {
  const [editedMember, setEditedMember] = useState(member);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={editedMember.name}
            onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Position</Label>
          <Input
            value={editedMember.position}
            onChange={(e) => setEditedMember({ ...editedMember, position: e.target.value })}
            disabled={disabled}
          />
        </div>
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea
          value={editedMember.description}
          onChange={(e) => setEditedMember({ ...editedMember, description: e.target.value })}
          rows={3}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(editedMember)} size="sm" disabled={disabled}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm" disabled={disabled}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

function EditStatsForm({ 
  stat, 
  onSave, 
  onCancel,
  disabled 
}: { 
  stat: CompanyStats; 
  onSave: (stat: Partial<CompanyStats>) => void; 
  onCancel: () => void;
  disabled: boolean;
}) {
  const [editedStat, setEditedStat] = useState({
    label: stat.label || "",
    value: stat.value || ""
  });

  const handleSave = () => {
    if (!editedStat.label.trim() || !editedStat.value.trim()) {
      toast({
        title: "Error",
        description: "Both label and value are required",
        variant: "destructive"
      });
      return;
    }
    onSave(editedStat);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Label</Label>
        <Input
          value={editedStat.label}
          onChange={(e) => setEditedStat({ ...editedStat, label: e.target.value })}
          placeholder="e.g., Projects Completed"
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Value</Label>
        <Input
          value={editedStat.value}
          onChange={(e) => setEditedStat({ ...editedStat, value: e.target.value })}
          placeholder="e.g., 500+"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" disabled={disabled}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm" disabled={disabled}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}