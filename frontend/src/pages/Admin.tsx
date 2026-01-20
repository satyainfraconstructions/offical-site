import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Image, Info, Phone, FolderOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button from Shadcn UI
import GalleryAdmin from "@/components/admin/GalleryAdmin";
import AboutAdmin from "@/components/admin/AboutAdmin";
import ContactAdmin from "@/components/admin/ContactAdmin";
import ProjectsAdmin from "@/components/admin/ProjectsAdmin";

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("gallery");
  
  const navigate = useNavigate(); // Hook for navigation
  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    window.location.href = "/";
    // navigate("/"); // Redirect to home page - adjusted to "/home" assuming that's the route path (change if different)
  };

  return (
    <div className="min-h-screen py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="w-16 h-16 construction-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-construction-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your Website Content, Gallery, Projects, and Contact Information.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Admin Tabs */}
        <Card className="shadow-construction">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  About
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery">
                <GalleryAdmin />
              </TabsContent>

              <TabsContent value="about">
                <AboutAdmin />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsAdmin />
              </TabsContent>

              <TabsContent value="contact">
                <ContactAdmin />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}