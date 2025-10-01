import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onAuthWithGoogle = () => {
    console.log("Google auth triggered");
    navigate("/app/home");
  };

  const onSignIn = () => {
    console.log("Sign in:", email);
    navigate("/app/home");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Auth Panel */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: "#0E1116" }}>
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

          {/* Form */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/50"
              onClick={onAuthWithGoogle}
            >
              <Chrome className="mr-2 h-5 w-5" />
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
                className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
              <Button
                className="w-full h-12 rounded-full text-white"
                style={{ backgroundColor: "#1E4E46" }}
                onClick={onSignIn}
              >
                Sign in
              </Button>
            </div>

            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300 block">
                Forgot your password?
              </a>
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
      <div className="hidden lg:flex flex-1 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #1E4E46 0%, #2D7A6E 25%, #1E4E46 50%, #0F2F2A 75%, #0A1F1C 100%)"
      }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 30% 50%, rgba(45, 122, 110, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(30, 78, 70, 0.3) 0%, transparent 50%)",
          filter: "blur(60px)"
        }} />
      </div>
    </div>
  );
}
