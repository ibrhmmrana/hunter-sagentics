import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";
import loginBackground from "@/assets/login-background.jpg";
import googleLogo from "@/assets/google-logo.png";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const onAuthWithGoogle = () => {
    console.log("Google auth triggered");
    navigate("/app/home");
  };

  const onCreateAccount = () => {
    console.log("Create account:", email);
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
              className="h-12 rounded-full bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
            
            <Button
              className="w-full h-12 rounded-full text-white"
              style={{ backgroundColor: "#1E4E46" }}
              onClick={onCreateAccount}
            >
              Create account
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
