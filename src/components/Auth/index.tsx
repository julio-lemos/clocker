import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebaseClient, persistanceMode } from '../../config/firebase/client';

type Credentials = {
  email: string;
  password: string;
  username?: string;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthProps {
  loading: boolean;
  user: any;
}

const AuthContext = createContext<any>([{}, () => {}]);

export const login = async (credentials: Credentials) => {
  const { email, password } = credentials;
  firebaseClient.auth().setPersistence(persistanceMode);

  try {
    await firebaseClient.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.log('LOGIN ERROR: ', err);
  }
};

export const signup = async (credentials: Credentials) => {
  const { email, password, username } = credentials;

  try {
    await firebaseClient.auth().createUserWithEmailAndPassword(email, password);
    await login({ email, password });
  } catch (err) {
    console.log('SIGNUP ERROR: ', err);
  }
};

export const logout = () => {
  firebaseClient.auth().signOut();
};

export const useAuth = () => {
  const [auth] = useContext(AuthContext);
  return [auth, { login, logout, signup }];
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthProps>({
    loading: true,
    user: null,
  });

  useEffect(() => {
    const unsubscribe = firebaseClient.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user,
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
