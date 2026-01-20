import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Award, Building, Calendar } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  description: string;
}

interface CompanyStat {
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
  companyStats: CompanyStat[];
}

// Map backend stats labels to icons
const statIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Projects Completed": Building,
  "Years of Experience": Calendar,
  "Team Members": Users,
  "Industry Awards": Award,
};

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "http://localhost:5000";

  // Fetch About data from backend
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AboutData = await response.json();
        setAboutData(data);
      } catch (err) {
        console.error("Failed to fetch About data:", err);
        setError("Failed to load About page data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">{error || "No data available."}</p>
      </div>
    );
  }

  // Map stats to include icons
  const statsWithIcons = aboutData.companyStats.map(stat => ({
    ...stat,
    icon: statIcons[stat.label] || Users, // Fallback to Users icon if label not mapped
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 ash-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {aboutData.content.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {aboutData.content.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsWithIcons.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-construction transition-smooth">
                <CardContent className="p-6">
                  <div className="w-16 h-16 construction-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-construction-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {aboutData.content.mission}
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Values</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-2 h-2 construction-gradient rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Quality First:</strong> Never compromising on standards</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 construction-gradient rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Safety Always:</strong> Protecting our team and communities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 construction-gradient rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Innovation:</strong> Embracing new technologies and methods</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 construction-gradient rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Sustainability:</strong> Building for future generations</span>
                </li>
              </ul>
            </div>
            <div>
              <Card className="p-8 shadow-ash">
                <h3 className="text-2xl font-bold text-foreground mb-6">Our Vision</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {aboutData.content.vision}
                </p>
                <Button variant="construction" size="lg" asChild>
                  <Link to="/projects">See Our Work</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to delivering exceptional results on every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-construction transition-smooth">
                <CardContent className="p-6">
                  <div className="w-20 h-20 construction-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-construction-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 construction-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-construction-foreground mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-construction-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's discuss your next construction project and how we can bring your vision to life.
          </p>
          <Button variant="outline-construction" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary" asChild>
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}