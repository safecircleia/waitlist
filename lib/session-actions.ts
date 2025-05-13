"use server"

import { auth } from "./auth"
import { authClient } from "./auth-client"
import { Session } from "../components/account/types"

// Function to get all device sessions for the current user
export async function getDeviceSessions(): Promise<Session[]> {
  try {
    const sessionsResponse = await auth.api.listDeviceSessions()
    
    if (!sessionsResponse || !Array.isArray(sessionsResponse)) {
      console.error("Invalid sessions response:", sessionsResponse)
      return []
    }
    
    // Format the sessions to match our Session interface
    return sessionsResponse.map((session: any) => {
      const device = getUserAgentInfo(session.userAgent || "")
      const location = session.ip 
        ? `${session.ip.city || 'Unknown'}, ${session.ip.country || 'Unknown'}` 
        : 'Unknown'
      const lastActive = formatLastActive(session.lastActive || new Date())
      
      return {
        device,
        location,
        lastActive,
        current: session.current || false,
        sessionToken: session.sessionToken
      }
    })
  } catch (error) {
    console.error("Error fetching device sessions:", error)
    return []
  }
}

// Function to revoke a specific session
export async function revokeSession(sessionToken: string): Promise<boolean> {
  try {
    if (!sessionToken) {
      console.error("No sessionToken provided")
      return false
    }
    
    const response = await auth.api.revokeSession({
      sessionToken
    })
    
    return !response?.error
  } catch (error) {
    console.error("Error revoking session:", error)
    return false
  }
}

// Helper function to parse user agent
function getUserAgentInfo(userAgent: string): string {
  if (!userAgent) return "Unknown Device"
  
  // Check for mobile devices
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)
  
  // Check for browsers
  let browser = "Unknown Browser"
  if (userAgent.includes("Chrome")) browser = "Chrome"
  else if (userAgent.includes("Firefox")) browser = "Firefox"
  else if (userAgent.includes("Safari")) browser = "Safari"
  else if (userAgent.includes("Edge")) browser = "Edge"
  
  // Check for operating system
  let os = "Unknown OS"
  if (userAgent.includes("Windows")) os = "Windows"
  else if (userAgent.includes("Mac")) os = "MacOS"
  else if (userAgent.includes("Linux")) os = "Linux"
  else if (userAgent.includes("Android")) os = "Android"
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS"
  
  if (isMobile) {
    return `${browser} on ${os} Mobile`
  } else {
    return `${browser} on ${os}`
  }
}

// Helper function to format last active time
function formatLastActive(lastActive: string | Date): string {
  const date = typeof lastActive === 'string' ? new Date(lastActive) : lastActive
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minutes ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} days ago`
  
  // For older sessions, return the actual date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
