import React, { createContext, useEffect, useState, useCallback } from 'react'
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react'

export const AuthContext = createContext(null)

/**
 * AuthProvider - Clerk-based authentication
 * Synchronizes Clerk authentication with local app state
 */
export function AuthProvider({ children }) {
  const clerkUser = useUser()
  const clerk = useClerk()
  const clerkAuth = useClerkAuth()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sync Clerk user to local state
  useEffect(() => {
    try {
      if (!clerkUser || typeof clerkUser.isLoaded === 'undefined') {
        return
      }

      setLoading(!clerkUser.isLoaded)

      if (!clerkUser.isLoaded) {
        return
      }

      if (clerkUser?.isSignedIn && clerkUser.user) {
        const clerkUserObj = clerkUser.user
        const localUser = {
          id: clerkUserObj.id,
          email:
            clerkUserObj.primaryEmailAddress?.emailAddress ||
            (clerkUserObj.emailAddresses && clerkUserObj.emailAddresses[0]?.emailAddress) ||
            clerkUserObj.email,
          firstName: clerkUserObj.firstName || '',
          lastName: clerkUserObj.lastName || '',
          fullName: `${clerkUserObj.firstName || ''} ${clerkUserObj.lastName || ''}`.trim() || clerkUserObj.username || clerkUserObj.id,
          image: clerkUserObj.imageUrl,
        }
        setUser(localUser)
        localStorage.setItem('auth_user', JSON.stringify(localUser))
      } else {
        setUser(null)
        localStorage.removeItem('auth_user')
      }
    } catch (err) {
      console.error('Auth sync error:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [clerkUser?.isLoaded, clerkUser?.isSignedIn, clerkUser?.user])

  // Get Clerk token for API calls
  const getToken = useCallback(async () => {
    try {
      if (clerkAuth?.isSignedIn && clerkAuth.getToken) {
        const token = await clerkAuth.getToken()
        return token
      }
      return null
    } catch (err) {
      console.error('Failed to get Clerk token:', err)
      return null
    }
  }, [clerkAuth?.isSignedIn, clerkAuth?.getToken])

  const logout = useCallback(async () => {
    try {
      if (clerk?.signOut) {
        await clerk.signOut()
      }
      setUser(null)
      localStorage.removeItem('auth_user')
      setError(null)
    } catch (err) {
      setError(err.message || 'Logout failed')
    }
  }, [clerk])

  const value = {
    user,
    loading,
    error,
    isLoaded: clerkUser?.isLoaded ?? false,
    isSignedIn: clerkUser?.isSignedIn || false,
    getToken,
    logout,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export default AuthContext
