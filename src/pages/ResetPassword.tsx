/**
 * Reset Password Page
 * 
 * Flow: User clicks reset link from email → This page validates recovery session → User sets new password
 * Testing: Use the link from the forgot password email, or manually navigate with recovery tokens in URL hash
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRecoverySession = async () => {
      try {
        // Check if we have a valid recovery session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setValidSession(false);
          return;
        }

        // Check if this is a recovery session
        // Supabase recovery sessions don't have a specific type, but we can check the URL hash
        const hash = window.location.hash;
        const hasRecoveryTokens = hash.includes('access_token=') && hash.includes('type=recovery');
        
        if (!hasRecoveryTokens) {
          setValidSession(false);
          return;
        }

        setValidSession(true);
      } catch (err) {
        console.error("Session check error:", err);
        setValidSession(false);
      }
    };

    checkRecoverySession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);

      // Validate passwords
      const result = resetPasswordSchema.safeParse({ password, confirmPassword });
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Show success and redirect
      toast.success("Password updated successfully!");
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

    } catch (err: any) {
      console.error("Password update error:", err);
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (validSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Invalid session state
  if (validSession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={hunterLogoLight} 
              alt="Hunter — by Sagentics" 
              className="h-12 dark:hidden"
            />
            <img 
              src={hunterLogoDark} 
              alt="Hunter — by Sagentics" 
              className="h-12 hidden dark:block"
            />
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-destructive">
                Invalid Reset Link
              </CardTitle>
              <p className="text-muted-foreground">
                This link is invalid or expired. Request a new reset link.
              </p>
            </CardHeader>
            
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate("/forgot-password")}
                className="w-full"
              >
                Request New Reset Link
              </Button>
              
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="text-sm"
                >
                  Back to sign in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={hunterLogoLight} 
            alt="Hunter — by Sagentics" 
            className="h-12 dark:hidden"
          />
          <img 
            src={hunterLogoDark} 
            alt="Hunter — by Sagentics" 
            className="h-12 hidden dark:block"
          />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Set New Password
            </CardTitle>
            <p className="text-muted-foreground">
              Enter your new password below.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12"
                disabled={loading}
              >
                {loading ? "Updating password..." : "Update password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                This page was opened from the reset email. If you reached here directly, 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs ml-1"
                  onClick={() => navigate("/forgot-password")}
                >
                  request a new link
                </Button>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
