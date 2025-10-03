import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";

const AuthCollage = () => {
  const tiles = [
    { color: "bg-orange-400", delay: "0s" },
    { color: "bg-purple-600", delay: "0.1s" },
    { color: "bg-pink-400", delay: "0.2s" },
    { color: "bg-green-400", delay: "0.3s" },
    { color: "bg-yellow-300", delay: "0.4s" },
    { color: "bg-primary", delay: "0.5s" },
    { color: "bg-indigo-600", delay: "0.6s" },
    { color: "bg-red-400", delay: "0.7s" },
  ];

  return (
    <div className="hidden lg:flex flex-1 bg-card relative overflow-hidden items-center justify-center p-12">
      <div className="grid grid-cols-3 gap-4 rotate-12 scale-110">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className={`${tile.color} rounded-2xl shadow-lg`}
            style={{
              width: "180px",
              height: "320px",
              animation: `float 6s ease-in-out infinite`,
              animationDelay: tile.delay,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default function Auth() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Mock handlers - no real logic
  const onAuthWithGoogle = () => {
    console.log("Google auth triggered");
    navigate("/app/home");
  };

  const onEmailContinue = () => {
    console.log("Email continue:", email);
    navigate("/app/home");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "hsl(var(--auth-bg))" }}>
      {/* Left: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div>
            <img 
              src={hunterLogoLight} 
              alt="Hunter — by Sagentics" 
              className="h-10 dark:hidden"
            />
            <img 
              src={hunterLogoDark} 
              alt="Hunter — by Sagentics" 
              className="h-10 hidden dark:block"
            />
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "hsl(var(--auth-card))" }}>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Create your free account</h1>
              <p className="text-muted-foreground">
                Search and filter prospect data with Hunter. No credit card required.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={onAuthWithGoogle}
              >
                <Chrome className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[hsl(var(--auth-card))] px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={onEmailContinue}
                >
                  Continue
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to Hunter's{" "}
                <a href="#" className="underline hover:text-foreground">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
                .
              </p>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Log in
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Trusted by */}
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center">Trusted by teams at</p>
            <div className="flex items-center justify-center gap-6 opacity-40">
              <div className="w-24 h-8 bg-muted rounded" />
              <div className="w-24 h-8 bg-muted rounded" />
              <div className="w-24 h-8 bg-muted rounded" />
              <div className="w-24 h-8 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Collage */}
      <AuthCollage />
    </div>
  );
}
