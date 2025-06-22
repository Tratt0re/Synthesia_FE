"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { UserResponse } from "../types/user.type"
import { getBrowserInfo } from "../lib/utils"
import { UserService } from "../services/user.service"

const USER_STORAGE_KEY = "synthesia_user_id"

export function getUserId(): string | null {
    try {
        const storedId = localStorage.getItem(USER_STORAGE_KEY)
        return storedId 
    } catch {
        return null
    }
}

interface UserContextType {
    user: UserResponse | null
    setUser: React.Dispatch<React.SetStateAction<UserResponse | null>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null)

    useEffect(() => {
        async function initUser() {
            const storedId = localStorage.getItem(USER_STORAGE_KEY)

            if (storedId) {
                try {
                    const existingUser = await UserService.getUser(storedId)
                    const browserInfo = getBrowserInfo()
                    const updatedUser = await UserService.updateUser(existingUser.id, { browser_info: browserInfo })
                    setUser(updatedUser)
                    return
                } catch (err) {
                    console.warn("Stored user invalid, creating a new one...")
                    localStorage.removeItem(USER_STORAGE_KEY)
                }
            }

            // No valid stored user, create new one
            try {
                const browserInfo = getBrowserInfo()
                const newUser = await UserService.createUser({ browser_info: browserInfo })
                localStorage.setItem(USER_STORAGE_KEY, newUser.id)
                setUser(newUser)
            } catch (error) {
                console.error("Failed to create user:", error)
            }
        }

        initUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within a UserProvider")
    return context
}
