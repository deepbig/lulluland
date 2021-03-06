import { auth } from '..';
import {
  signInWithRedirect,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  getRedirectResult,
} from 'firebase/auth';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  
  await signInWithRedirect(auth, provider);
};

export const checkRedirectResult = async (): Promise<any> => {
    let result;
    await getRedirectResult(auth).then((res) => {
        result = res;
    }).catch((err) => {
        result = null;
    });
    return result;
}

export const onAuthChange = (callback: any) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  return signOut(auth);
};

export const delUser = async () => {
  const user = auth.currentUser;

  if (user) {
    return deleteUser(user);
  } else {
    return 'You need to login again to delete your account.';
  }
};

export const reauthWithCredential = async (password: string) => {
  const user = auth.currentUser;

  if (user?.email) {
    const credential = EmailAuthProvider.credential(user.email, password);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // User re-authenticated.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  } else {
    return 'You need to login again to delete your account.';
  }
};
