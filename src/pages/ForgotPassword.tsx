/**
 * Forgot Password Page
 * 
 * Flow: User enters email → Supabase sends reset link → User clicks link → ResetPassword page
 * Testing: Enter a valid email, check your inbox for the reset link
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/config/env";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);

      // Validate email
      const result = forgotPasswordSchema.safeParse({ email });
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              {success ? "Check your email" : "Forgot your password?"}
            </CardTitle>
            <p className="text-muted-foreground">
              {success 
                ? "We've sent a password reset link to your email address."
                : "Enter your email address and we'll send you a link to reset your password."
              }
            </p>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Check your email for a password reset link. If you don't see it, check your spam folder.
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? "Sending reset link..." : "Send reset link"}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
