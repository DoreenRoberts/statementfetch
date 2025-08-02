import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      setMessage("Invalid or expired link");
      setIsError(true);
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
    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage("Password updated successfully! Redirecting to login...");
      setIsError(false);
      setTimeout(() => navigate("/"), 3000); // auto redirect in 3 seconds
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Reset Your Password
          </CardTitle>
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
            <p
              className={`mt-4 text-center text-sm ${
                isError ? "text-destructive" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
