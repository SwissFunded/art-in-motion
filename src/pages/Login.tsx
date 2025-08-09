import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(email.trim(), password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const name = email.split("@")[0];
    const result = await register(name, email.trim(), password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Sign up failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 bg-card/70 backdrop-blur-sm shadow-ios">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-xs text-muted-foreground">
            <p className="mb-1 font-medium">Demo accounts:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>admin@artinmotion.com / admin123</li>
              <li>curator@artinmotion.com / curator123</li>
              <li>viewer@artinmotion.com / viewer123</li>
            </ul>
          </div>

          <div className="mt-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <form onSubmit={onSignUp} className="space-y-3">
              <Button type="submit" variant="outline" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create new account"}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-primary hover:underline">Back to app</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


