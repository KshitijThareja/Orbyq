import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useReducedMotion, Variants } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isValidating } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex items-center gap-2 text-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-6 h-6 border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full"
          />
          Loading...
        </div>
      </div>
    );
  }

  // Animation variants for shapes
  const shapeVariants: Variants = {
    animate: {
      x: [0, 20, -20, 0],
      y: [0, -30, 30, 0],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut',
      },
    },
    static: {
      x: 0,
      y: 0,
      rotate: 0,
    },
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-br from-background via-primary to-background overflow-hidden">
      {/* Background Shapes */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full opacity-50 blur-2xl"
        variants={shapeVariants}
        animate={shouldReduceMotion ? 'static' : 'animate'}
        initial={{ x: 0, y: 0 }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-60 h-60 bg-ring rounded-[20px] opacity-50 blur-2xl"
        variants={shapeVariants}
        animate={shouldReduceMotion ? 'static' : 'animate'}
        initial={{ x: 0, y: 0 }}
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-32 bg-ring rounded-full opacity-100 blur-2xl"
        variants={shapeVariants}
        animate={shouldReduceMotion ? 'static' : 'animate'}
        initial={{ x: 0, y: 0 }}
        transition={{ delay: 1 }}
      />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md bg-background backdrop-blur-sm border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-foreground">Login</CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary"
              disabled={isValidating}
            >
              Login
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline">Register</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;