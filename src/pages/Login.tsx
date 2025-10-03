import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthProvider";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";
import loginBackground from "@/assets/login-background.jpg";
import googleLogo from "@/assets/google-logo.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = (location.state as any)?.from?.pathname || "/app/results";

  const onAuthWithGoogle = () => {
    console.log("Google auth triggered");
    navigate(from, { replace: true });
  };

  const onSignIn = async () => {
    try {
      setError("");
      setLoading(true);

      // Validate form
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }

      // Sign in with Supabase
      await signIn(email, password);
      
      // Navigate to intended destination
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Auth Panel */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: "#0E1116" }}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={hunterLogoDark} 
              alt="Hunter — by Sagentics" 
              className="h-20 dark:hidden"
            />
            <img 
              src={hunterLogoLight} 
              alt="Hunter — by Sagentics" 
              className="h-12 hidden dark:block"
            />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-700/30 hover:text-white"
              onClick={onAuthWithGoogle}
            >
              <img src={googleLogo} alt="Google" className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0E1116] px-2 text-gray-500">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSignIn()}
                className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              <Button
                className="w-full h-12 rounded-full text-white"
                style={{ backgroundColor: "#1E4E46" }}
                onClick={onSignIn}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => navigate("/forgot-password")} 
                className="text-sm text-gray-400 hover:text-gray-300 block"
              >
                Forgot your password?
              </button>
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <button 
                  onClick={() => navigate("/signup")} 
                  className="text-gray-200 hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to Hunter's{" "}
              <a href="#" className="underline hover:text-gray-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-gray-400">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img 
          src={loginBackground} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
