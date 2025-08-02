import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      setMessage("Invalid or expired link");
    } else {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: accessToken,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else setMessage("Password updated successfully!");
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-destructive">{message}</p>
        )}
      </CardContent>
    </Card>
  </div>
);


