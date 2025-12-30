// import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getIdToken
} from "firebase/auth";

export const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const fetchIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await getIdToken(user);
  }
  return null;
};