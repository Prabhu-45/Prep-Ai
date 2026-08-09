import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    /**
     * @description Handle login, returns the error message if any
     */
    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
                return { success: true }
            }
        } catch (err) {
            console.error("Login error:", err.message)
            return { success: false, message: err.message }
        } finally {
            setLoading(false)
        }
    }

    /**
     * @description Handle register, returns the error message if any
     */
    const handleRegister = async ({ username, email, password, role }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password, role })
            if (data?.user) {
                setUser(data.user)
                return { success: true }
            }
        } catch (err) {
            console.error("Register error:", err.message)
            return { success: false, message: err.message }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout error:", err)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout }
}