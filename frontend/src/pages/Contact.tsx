import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  _id?: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  emergencyContact: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
  // to: string; // hidden, auto-filled
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  form?: string; // server-side error
}

const API_BASE = "http://localhost:5000";

export default function Contact() {
  const { toast } = useToast();

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
    // to: "", // will be set from contactInfo.email
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch contact info from backend
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ContactInfo = await response.json();
        console.log("Fetched contact:", data);
        setContactInfo(data);

        // Auto-fill the "to" field with company email
        setFormData((prev) => ({ ...prev, to: data.email }));
      } catch (err: any) {
        console.error("Failed to fetch contact information:", err);
        setError("Failed to load contact information. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load contact information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContact();
  }, [toast]);

  const validateField = (
    name: keyof ContactForm,
    value: string
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters.";
        return undefined;

      case "email":
        if (!value.trim()) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim()))
          return "Please enter a valid email address.";
        return undefined;

      case "message":
        if (!value.trim()) return "Message is required.";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters.";
        if (value.trim().length > 1000)
          return "Message cannot exceed 1000 characters.";
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as {
      name: keyof ContactForm;
      value: string;
    };
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field as soon as the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Blur handler – show error immediately when user leaves the field
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as {
      name: keyof ContactForm;
      value: string;
    };
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof ContactForm)[]).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. client-side validation
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: undefined })); // clear any previous server error

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to send");
      }

      toast({
        title: "Message Sent!",
        description: "A confirmation has been sent to your email.",
      });

      // Reset
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err: any) {
      const msg = err.message || "Failed to send message.";
      setErrors((prev) => ({ ...prev, form: msg }));
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading contact info...</p>
      </div>
    );
  }

  // Error state
  if (error || !contactInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">
          {error || "Contact information not available."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your construction project? Get in touch with our team
            for a free consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-ash">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">Get In Touch</CardTitle>
                <p className="text-muted-foreground">
                  We're here to help bring your construction vision to life.
                  Reach out using any method below.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 construction-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-construction-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Phone
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Call for immediate assistance
                    </p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 construction-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-construction-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Send us an email anytime
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 construction-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-construction-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Office
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Visit our headquarters
                    </p>
                    <address className="text-muted-foreground not-italic whitespace-pre-line">
                      {contactInfo.address}
                    </address>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 construction-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-construction-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Business Hours
                    </h3>
                    <div className="text-muted-foreground space-y-1 whitespace-pre-line">
                      {contactInfo.businessHours}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 construction-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-construction-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Follow Us
                    </h3>
                    <div className="flex space-x-4">
                      {contactInfo.socialLinks.facebook && (
                        <a
                          href={contactInfo.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="w-6 h-6 text-primary hover:text-primary/80" />
                        </a>
                      )}
                      {contactInfo.socialLinks.twitter && (
                        <a
                          href={contactInfo.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="w-6 h-6 text-primary hover:text-primary/80" />
                        </a>
                      )}
                      {contactInfo.socialLinks.linkedin && (
                        <a
                          href={contactInfo.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-6 h-6 text-primary hover:text-primary/80" />
                        </a>
                      )}
                      {contactInfo.socialLinks.instagram && (
                        <a
                          href={contactInfo.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="w-6 h-6 text-primary hover:text-primary/80" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="construction-gradient">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-construction-foreground mb-2">
                  24/7 Emergency Support
                </h3>
                <p className="text-construction-foreground/90 mb-4">
                  For urgent construction issues, call our emergency hotline:
                </p>
                <a
                  href={`tel:${contactInfo.emergencyContact}`}
                  className="text-construction-foreground font-bold text-lg hover:text-construction-foreground/80"
                >
                  {contactInfo.emergencyContact}
                </a>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Contact Form */}
          <Card className="shadow-ash">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Send us a Message</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    className={`transition-smooth focus:ring-primary ${
                      errors.name ? "border-destructive" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* User's Email (Only ONE visible email field) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    className={`transition-smooth focus:ring-primary ${
                      errors.name ? "border-destructive" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    className={`transition-smooth focus:ring-primary ${
                      errors.name ? "border-destructive" : ""
                    }`}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="construction"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  * Required fields. We respect your privacy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <Card className="overflow-hidden shadow-ash">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Find Our Office</CardTitle>
              <p className="text-muted-foreground">
                Located in the heart of the business district.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {/* ---- Google Maps iframe ---- */}
              <div className="relative w-full h-96">
                {/* 1. iframe with the address URL-encoded */}
                <iframe
                  title="Company location on Google Maps"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.9422283498393!2d78.3571391!3d17.462479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xac243d170ad5e549%3A0x8af3a297b1254d22!2sSATYA%20INFRA%20CONSTRUCTIONS!5e0!3m2!1sen!2sin!4v1761821595285!5m2!1sen!2sin"
                ></iframe>
                
                {/* 2. Fallback message (if iframe fails to load) */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-muted/80 hidden"
                  id="map-fallback"
                >
                  <p className="text-muted-foreground">
                    Unable to load map.{" "}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        contactInfo.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary"
                    >
                      Open in Google Maps
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
