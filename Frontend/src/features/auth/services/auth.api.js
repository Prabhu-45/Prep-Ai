import axios from "axios";


const api = axios.create({
    baseURL: "",
    withCredentials: true
})


export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })
        return response.data
    } catch (err) {
        // Throw the error message or a generic one so the UI can catch it
        const message = err.response?.data?.message || "Login failed. Please check your credentials."
        throw new Error(message)
    }
}

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username, email, password
        })
        return response.data
    } catch (err) {
        // Throw the error message or a generic one so the UI can catch it
        const message = err.response?.data?.message || "Registration failed. Please try again."
        throw new Error(message)
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (err) {
        console.error("Logout error:", err)
        throw new Error("Logout failed")
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        // For getMe, we don't necessarily want to throw an error that breaks the app
        // just return null if not logged in
        return null
    }
}