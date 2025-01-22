"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Save, Eye, EyeOff } from "lucide-react";
import { Navbar } from "./Navbar1";
import toast from "react-hot-toast";

export default function OwnApi() {
  const [rapidApiKey, setRapidApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [saveStatus, setSaveStatus] = useState({ rapid: false, gemini: false });
  const [showPassword, setShowPassword] = useState({
    rapid: false,
    gemini: false,
  });

  useEffect(() => {
    setRapidApiKey(localStorage.getItem("NEXT_PUBLIC_RAPID_API_KEY") || "");
    setGeminiApiKey(localStorage.getItem("NEXT_PUBLIC_GEMINI_API_KEY") || "");
  }, []);

  const handleSaveRapid = (e: any) => {
    e.preventDefault();
    if(rapidApiKey === ""){
      toast.error("Please enter a valid Rapid API key");
      return;
    }
    localStorage.setItem("NEXT_PUBLIC_RAPID_API_KEY", rapidApiKey);
    setSaveStatus((prev) => ({ ...prev, rapid: true }));
    setTimeout(
      () => setSaveStatus((prev) => ({ ...prev, rapid: false })),
      2000
    );
  };

  const handleSaveGemini = (e: any) => {
    e.preventDefault();
    if(geminiApiKey === ""){
      toast.error("Please enter a valid Gemini API key");
      return;
    }
    localStorage.setItem("NEXT_PUBLIC_GEMINI_API_KEY", geminiApiKey);
    setSaveStatus((prev) => ({ ...prev, gemini: true }));
    setTimeout(
      () => setSaveStatus((prev) => ({ ...prev, gemini: false })),
      2000
    );
  };

  return (
    <>
      <Navbar homepage={false} />

      <div className="h-[70vh] bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <KeyRound className="w-6 h-6" />
              Use Your Own API Keys Here...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rapidApi" className="text-sm font-semibold">
                  Judge0 API Key
                </Label>
                <div className="flex gap-2 relative">
                  <Input
                    id="rapidApi"
                    type={showPassword.rapid ? "text" : "password"}
                    value={rapidApiKey}
                    onChange={(e) => setRapidApiKey(e.target.value)}
                    className=" text-md pr-12"
                    placeholder="Enter your Rapid API key"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-24 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        rapid: !prev.rapid,
                      }))
                    }
                  >
                    {showPassword.rapid ? (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveRapid}
                    className={`w-24 transition-colors ${
                      saveStatus.rapid
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saveStatus.rapid ? "Saved!" : "Save"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="geminiApi" className="text-sm font-semibold">
                  Gemini API Key
                </Label>
                <div className="flex gap-2 relative">
                  <Input
                    id="geminiApi"
                    type={showPassword.gemini ? "text" : "password"}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className=" text-md pr-12"
                    placeholder="Enter your Gemini API key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-24 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        gemini: !prev.gemini,
                      }))
                    }
                  >
                    {showPassword.gemini ? (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveGemini}
                    className={`w-24 transition-colors ${
                      saveStatus.gemini
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saveStatus.gemini ? "Saved!" : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
