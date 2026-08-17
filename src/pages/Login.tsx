import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AuthInputField from '../components/auth/AuthInputField';
import AuthButton from '../components/auth/AuthButton';
import FacebookLoginButton from '../components/auth/FacebookLoginButton';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLoginModule from 'react-facebook-login/dist/facebook-login-render-props';

// Handle CommonJS / ESM interop for Vite
const FacebookLogin = (FacebookLoginModule as any).default || FacebookLoginModule;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setError('');
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle(credentialResponse.credential);
        console.log("Login success: true");
        window.location.replace('/');
      } catch (err: any) {
        setError('Google login failed. Please try again.');
        setIsGoogleLoading(false);
      }
    }
  };

  const handleFacebookCallback = async (response: any) => {
    if (response?.accessToken) {
      setError('');
      setIsFacebookLoading(true);
      try {
        await loginWithFacebook({ access_token: response.accessToken });
        console.log("Login success: true");
        window.location.replace('/');
      } catch (err: any) {
        setError('Facebook login failed. Please try again.');
        setIsFacebookLoading(false);
      }
    } else {
      setError('Facebook login was unsuccessful.');
      setIsFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center space-x-2">
        <img src="/logo.png" alt="NutriSLM Logo" className="h-12 w-12 object-contain" />
        <span className="text-3xl font-bold text-gray-900 dark:text-white">NutriSLM</span>
      </div>

      <AuthCard title="Welcome back" subtitle="Please enter your details to sign in">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <AuthInputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot password?
              </a>
            </div>
          </div>

          <AuthButton type="submit" isLoading={isLoading}>
            Sign in
          </AuthButton>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-center w-full relative">
              {isGoogleLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded">
                  <span className="text-sm font-medium text-gray-700">Connecting...</span>
                </div>
              )}
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => { setError('Google login was unsuccessful.'); setIsGoogleLoading(false); }}
                shape="rectangular"
                width="100%"
                logo_alignment="center"
              />
            </div>
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID'}
              callback={handleFacebookCallback}
              render={(renderProps: any) => (
                <FacebookLoginButton onClick={renderProps.onClick} isLoading={isFacebookLoading} />
              )}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </div>
  );
};

export default Login;
