import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";   // User layout with navbar
import AdminLayout from "./components/AdminLayout"; // ✅ Create separate admin layout

import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Gallery from "./pages/Gallery.tsx";
import Projects from "./pages/Projects.tsx";
import Contact from "./pages/Contact.tsx";

import Admin from "./pages/Admin.tsx";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {

  const [role, setRole] = useState<string | null>(null);


  // Load role from localStorage on first render
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {role === "admin" ? (
            // ✅ Show admin layout
            // <AdminLayout>
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            // </AdminLayout>
          ) : (
            // ✅ Show user layout (with navbar)
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
