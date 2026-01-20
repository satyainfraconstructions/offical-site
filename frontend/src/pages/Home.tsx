import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Award, Clock } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

const features = [
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Every project meets the highest industry standards with rigorous quality checks.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Skilled professionals with decades of combined construction experience.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description:
      "Recognized for excellence in construction and project delivery.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "Committed to completing projects on schedule and within budget.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/src/assets/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 hero-text">
            We Construct your
            <span className="block text-primary">  DREAM HOME</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 hero-text max-w-2xl mx-auto">
            Professional construction services with over 20 years of experience
            in creating exceptional buildings and infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/projects">
                View Our Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline-construction" size="lg" asChild>
              <Link to="/contact">Get A Quote</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose BuildCorp?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We bring expertise, reliability, and innovation to every
              construction project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-construction transition-smooth transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 construction-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-construction-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-construction-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and let's bring your
            construction vision to life.
          </p>
          <Button
            variant="outline-construction"
            size="lg"
            className="bg-white/10 border-white text-dark"
            asChild
          >
            <Link to="/contact">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
