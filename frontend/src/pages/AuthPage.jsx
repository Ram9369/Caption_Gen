import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Lock, User, Sparkles, AlertCircle, Loader } from 'lucide-react';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when toggling modes
  useEffect(() => {
    clearError();
    setFormError('');
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim()) {
      setFormError('Username is required.');
      return;
    }

    if (password.length < 4) {
      setFormError('Password must be at least 4 characters long.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} fade-in`}>
      {/* Background orbs for premium aesthetics */}
      <div className="bg-orb orb-primary"></div>
      <div className="bg-orb orb-secondary"></div>

      <div className={`${styles.authCard} glass-panel`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Sparkles className="text-gradient-neon" size={28} />
            <span className="text-gradient-neon">CaptionCraft</span>
          </div>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Generate AI captions for your pictures in seconds' 
              : 'Join CaptionCraft and elevate your social media'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Validation or API Error Banner */}
          {(formError || error) && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{formError || error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Username</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
              <User className={styles.inputIcon} size={18} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                className={styles.inputField}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <Lock className={styles.inputIcon} size={18} />
            </div>
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <Lock className={styles.inputIcon} size={18} />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className={styles.spinner} size={18} />
                <span>Processing...</span>
              </>
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                <span>Log In</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className={styles.footerText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className={styles.toggleLink}
            onClick={() => setIsLogin(!isLogin)}
            disabled={isSubmitting}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
