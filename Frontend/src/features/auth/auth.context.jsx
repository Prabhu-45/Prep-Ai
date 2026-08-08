/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Run getMe exactly ONCE on app startup to restore session from cookie
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch {
                // No active session — user stays null
            } finally {
                setLoading(false)
            }
        }
        restoreSession()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}