import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const API_BASE = "http://localhost:5000";

export default function ContactAdmin() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
    businessHours: "",
    emergencyContact: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contact information
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE}/api/contact`);
        if (!response.ok) {
          if (response.status === 404) {
            // Set default values if no contact document exists
            setContactInfo({
              email: "info@buildcorp.com",
              phone: "+1 (555) 123-4567",
              address: "123 Construction Ave, Building City, BC 12345",
              businessHours: "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed",
              emergencyContact: "+1 (555) 999-HELP",
              socialLinks: {
                facebook: "https://facebook.com/buildcorp",
                twitter: "https://twitter.com/buildcorp",
                linkedin: "https://linkedin.com/company/buildcorp",
                instagram: "https://instagram.com/buildcorp",
              },
            });
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched contact:", data);
        setContactInfo(data);
      } catch (err) {
        console.error("Failed to fetch contact information:", err);
        setError("Failed to load contact information. Please try again.");
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
  }, []);

  const handleSaveContactInfo = async () => {
    if (!contactInfo.email || !contactInfo.phone || !contactInfo.address || !contactInfo.businessHours || !contactInfo.emergencyContact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("PUT response error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const data = await response.json();
      setContactInfo(data);
      toast({
        title: "Contact information updated",
        description: "Changes have been saved successfully",
      });
    } catch (err) {
      console.error("Failed to update contact information:", err);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contact-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="Enter email address"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="contact-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="contact-phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="Enter phone number"
                disabled={isLoading}
                maxLength="10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact-address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address *
            </Label>
            <Textarea
              id="contact-address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              placeholder="Enter business address"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="business-hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Business Hours *
            </Label>
            <Textarea
              id="business-hours"
              value={contactInfo.businessHours}
              onChange={(e) => setContactInfo({ ...contactInfo, businessHours: e.target.value })}
              placeholder="Enter business hours"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="emergency-contact">Emergency Contact *</Label>
            <Input
              id="emergency-contact"
              value={contactInfo.emergencyContact}
              onChange={(e) => setContactInfo({ ...contactInfo, emergencyContact: e.target.value })}
              placeholder="Enter emergency contact number"
              disabled={isLoading}
              maxLength="10"
            />
          </div>

          <Button onClick={handleSaveContactInfo} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Contact Information
          </Button>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="facebook-link">Facebook</Label>
              <Input
                id="facebook-link"
                type="url"
                value={contactInfo.socialLinks.facebook}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  socialLinks: { ...contactInfo.socialLinks, facebook: e.target.value },
                })}
                placeholder="https://facebook.com/yourpage"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="twitter-link">Twitter</Label>
              <Input
                id="twitter-link"
                type="url"
                value={contactInfo.socialLinks.twitter}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  socialLinks: { ...contactInfo.socialLinks, twitter: e.target.value },
                })}
                placeholder="https://twitter.com/youraccount"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="linkedin-link">LinkedIn</Label>
              <Input
                id="linkedin-link"
                type="url"
                value={contactInfo.socialLinks.linkedin}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  socialLinks: { ...contactInfo.socialLinks, linkedin: e.target.value },
                })}
                placeholder="https://linkedin.com/company/yourcompany"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="instagram-link">Instagram</Label>
              <Input
                id="instagram-link"
                type="url"
                value={contactInfo.socialLinks.instagram}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  socialLinks: { ...contactInfo.socialLinks, instagram: e.target.value },
                })}
                placeholder="https://instagram.com/youraccount"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button onClick={handleSaveContactInfo} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Social Links
          </Button>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Form Configuration</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Form submissions are stored locally (frontend only)</li>
              <li>• Email notifications: Disabled (requires backend)</li>
              <li>• Auto-response: Disabled (requires backend)</li>
              <li>• Form validation: Enabled</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Enhancement Tip</h4>
            <p className="text-blue-700 text-sm">
              To enable email notifications and backend form processing, connect your project to Supabase 
              and set up email integration with services like SendGrid or Resend.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}