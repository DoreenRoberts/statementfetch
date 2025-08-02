import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setError('Password reset email sent!');
      setShowReset(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{showReset ? 'Reset Password' : 'Sign In'}</CardTitle>
        <CardDescription>
          {showReset ? 'Enter your email to reset password' : 'Enter your credentials to access your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={showReset ? handleReset : handleSubmit} className="space-y-4">
          {error && (
            <Alert variant={error.includes('sent') ? 'default' : 'destructive'}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {!showReset && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : showReset ? 'Send Reset Email' : 'Sign In'}
          </Button>
          
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setShowReset(!showReset)}
            >
              {showReset ? 'Back to Sign In' : 'Forgot Password?'}
            </Button>
            
            {!showReset && (
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={onToggleMode}
              >
                Don't have an account? Sign up
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};