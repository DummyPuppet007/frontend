import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/utils/validations/authValidations";
import { z } from "zod";
import { login } from "@/services/AuthService";
import { useNavigate } from "react-router-dom";
import useAuthStore, { User } from "@/stores/useAuthStore";

const Login: React.FC = () => {
  // State management with TypeScript types
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const {user, setUser} = useAuthStore();

  useEffect(() => {
    if(user){
      navigate("/dashboard");
    }
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form data
      loginSchema.parse({ username, password });
      setLoading(true);

      // Call API to login
      let data = {
        username,
        password
      };
      
      const loginResponse = await login(data);

      if(loginResponse.statusCode > 300 || !loginResponse.success) {
        setError(loginResponse.message);
        return;
      }
      
      const user: User | null = loginResponse && loginResponse.data ? loginResponse.data : null;

      setUser(user);
      navigate("/dashboard");

    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Invalid username or password");
      }
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-white to-gray-400">
      <div className=" text-center mt-28">
        <img
        src="/images/crm-logo.png"
          alt="Sales CRM Logo"
          className="mx-auto max-w-60"
        />

        <h3 className="inset-0 mt-6 text-2xl font-semibold">
          WELCOME BACK
        </h3>
      </div>

      <div className="flex items-center justify-center mt-10">
        <Card className="w-full max-w-md mx-4 bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Log In</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full border-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-gray-400"
                />
              </div>

              <div className="space-x-2"></div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
