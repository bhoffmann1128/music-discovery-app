import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
	authState: false,
	setAuthState: async(authState) => null
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(false);

  return (
    <AuthContext.Provider value={{authState, setAuthState}}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuthContext() {
  return useContext(AuthContext);
}