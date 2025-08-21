
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const AuthForm: React.FC = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken: setAuthToken, setUseDemoMode } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError(t('auth.invalidToken'));
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real app, you might want to validate the token here
      // For now, we'll just store it
      setAuthToken(token.trim());
    } catch (err) {
      setError(t('auth.validationError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    setUseDemoMode(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-end mb-2">
            <LanguageSelector />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {t('app.title')}
          </h2>
          <p className="text-center text-gray-600 mb-8">{t('app.subtitle')}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.title')}
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warehouse-blue focus:border-transparent"
                placeholder={t('auth.placeholder')}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-warehouse-red rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-warehouse-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warehouse-blue disabled:bg-blue-300"
            >
              {isLoading ? t('auth.authenticating') : t('auth.login')}
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">{t('auth.or')}</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warehouse-blue"
            >
              {t('auth.demoModeButton')}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>{t('auth.demoModeInfo')}</p>
            <p className="mt-1">{t('auth.demoModeNoToken')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
