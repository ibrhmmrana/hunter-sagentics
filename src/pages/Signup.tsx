import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthProvider";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";
import loginBackground from "@/assets/login-background.jpg";
import googleLogo from "@/assets/google-logo.png";

const signupSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const onAuthWithGoogle = () => {
    console.log("Google auth triggered");
    navigate("/app/results");
  };

  const onCreateAccount = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      // Validate form
      const result = signupSchema.safeParse({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }

      // Sign up with Supabase
      await signUp(email, password, { firstName, lastName });
      
      // Show success message or navigate
      setSuccess("Account created successfully! Please check your email to confirm your account.");
      
      // Navigate after a delay to show success message
      setTimeout(() => {
        navigate("/app/results");
      }, 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
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
              src={hunterLogoDark} 
              alt="Hunter — by Sagentics" 
              className="h-20 hidden dark:block"
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

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
              <Input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            
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
              className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
            
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onCreateAccount()}
              className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
            
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-400 text-center">{success}</p>
            )}
            
            <Button
              className="w-full h-12 rounded-full text-white"
              style={{ backgroundColor: "#1E4E46" }}
              onClick={onCreateAccount}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate("/login")} 
                  className="text-gray-200 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to Hunter's{" "}
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
