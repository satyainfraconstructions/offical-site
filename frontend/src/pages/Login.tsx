import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Save auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // admin or user

        alert("Login successful!");

        // CRITICAL FIX: Full reload to trigger App.tsx useEffect
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(`Error: ${data.message || "Login failed"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background + Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--construction))_0%,transparent_50%)] opacity-20 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,hsl(var(--primary))_0%,transparent_50%)] opacity-15 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-construction-gradient rounded-2xl blur-lg opacity-25 animate-pulse"></div>

          <Card className="relative border-0 bg-black/40 backdrop-blur-xl shadow-2xl animate-fade-in">
            <CardHeader className="space-y-4 text-center pb-8 relative">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white via-construction to-white bg-clip-text text-transparent drop-shadow-2xl">
                LOGIN PORTAL
              </CardTitle>

              <CardDescription className="text-white/70 text-lg font-medium">
                Access your dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-white/90 font-semibold text-sm uppercase tracking-wider"
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-construction/70 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 bg-white/5 text-white rounded-xl border-white/10 focus:border-construction/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-white/90 font-semibold text-sm uppercase tracking-wider"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-construction/70 h-5 w-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 bg-white/5 text-white rounded-xl border-white/10 focus:border-construction/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-construction-gradient text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-construction/50 transition-all duration-300 disabled:opacity-70"
                  >
                    {loading ? "Logging in..." : "ACCESS DASHBOARD"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;