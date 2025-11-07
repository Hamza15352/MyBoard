// import React, { useState } from 'react';
// import '../styles/Signup.scss';

// interface SignupProps {
//   onSignup: (name: string, email: string, password: string) => void;
//   onSwitchToLogin: () => void;
// }

// const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords don't match!");
//       return;
//     }
//     onSignup(name, email, password);
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <h2>Create Account</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               placeholder="Enter your full name"
//             />
//           </div>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Create a password"
//               minLength={6}
//             />
//           </div>
//           <div className="form-group">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               placeholder="Confirm your password"
//               minLength={6}
//             />
//           </div>
//           <button type="submit" className="signup-button">Sign Up</button>
//         </form>
//         <p className="auth-switch">
//           Already have an account? 
//           <button onClick={onSwitchToLogin} className="link-button">Login</button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// // import { auth } from '../firebase/config'; // Make sure this path matches your Firebase config
// import '../styles/Signup.scss';

// interface SignupProps {
//   onSignup: (name: string, email: string, password: string) => void;
//   onSwitchToLogin: () => void;
// }

// const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Client-side validation
//     if (password !== confirmPassword) {
//       setError("Passwords don't match!");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Create user with Firebase authentication
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Update user profile with display name
//       await updateProfile(user, {
//         displayName: name
//       });

//       // Call the parent component's onSignup callback if needed
//       onSignup(name, email, password);
      
//     } catch (error: any) {
//       console.error('Signup error:', error);
      
//       // Handle specific Firebase auth errors
//       switch (error.code) {
//         case 'auth/email-already-in-use':
//           setError('An account with this email already exists');
//           break;
//         case 'auth/invalid-email':
//           setError('Invalid email address');
//           break;
//         case 'auth/operation-not-allowed':
//           setError('Email/password accounts are not enabled');
//           break;
//         case 'auth/weak-password':
//           setError('Password is too weak');
//           break;
//         case 'auth/network-request-failed':
//           setError('Network error. Please check your connection');
//           break;
//         case 'auth/too-many-requests':
//           setError('Too many attempts. Please try again later');
//           break;
//         default:
//           setError('Failed to create account. Please try again');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <h2>Create Account</h2>
        
//         {error && (
//           <div className="error-message">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               placeholder="Enter your full name"
//               disabled={loading}
//             />
//           </div>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter your email"
//               disabled={loading}
//             />
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Create a password (min. 6 characters)"
//               minLength={6}
//               disabled={loading}
//             />
//           </div>
//           <div className="form-group">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               placeholder="Confirm your password"
//               minLength={6}
//               disabled={loading}
//             />
//           </div>
//           <button 
//             type="submit" 
//             className="signup-button"
//             disabled={loading}
//           >
//             {loading ? 'Creating Account...' : 'Sign Up'}
//           </button>
//         </form>
//         <p className="auth-switch">
//           Already have an account? 
//           <button 
//             onClick={onSwitchToLogin} 
//             className="link-button"
//             disabled={loading}
//           >
//             Login
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import '../styles/Signup.scss';

interface SignupProps {
  onSignup: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkFirebaseConfig = () => {
    console.log('Firebase Config Check:');
    console.log('Auth Object:', auth);
    console.log('Auth App:', auth.app);
    console.log('Current User:', auth.currentUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to create user...');
      console.log('Email:', email);
      console.log('Password Length:', password.length);
      
      checkFirebaseConfig();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User created successfully:', user);

      await updateProfile(user, {
        displayName: name
      });

      console.log('Profile updated successfully');

      onSignup(name, email, password);
      
    } catch (error: any) {
      console.error('Full Signup Error:', error);
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError(' An account with this email already exists');
          break;
        case 'auth/invalid-email':
          setError(' Invalid email address format');
          break;
        case 'auth/operation-not-allowed':
          setError(' Email/password accounts are not enabled. Please check Firebase Console → Authentication → Sign-in methods');
          break;
        case 'auth/weak-password':
          setError(' Password is too weak. Use at least 6 characters');
          break;
        case 'auth/network-request-failed':
          setError(' Network error. Please check your internet connection');
          break;
        case 'auth/too-many-requests':
          setError(' Too many attempts. Please try again later');
          break;
        case 'auth/missing-config':
          setError(' Firebase configuration missing. Please check your Firebase setup');
          break;
        default:
          setError(`Failed to create account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password (min. 6 characters)"
              minLength={6}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              minLength={6}
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? 
          <button 
            onClick={onSwitchToLogin} 
            className="link-button"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;