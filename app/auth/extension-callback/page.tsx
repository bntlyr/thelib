"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export default function ExtensionCallback() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      // User is authenticated, get the extension token
      fetch('/api/extension/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          // Store token in localStorage for extension to pick up
          localStorage.setItem('thelibExtensionToken', data.token)
          localStorage.setItem('thelibExtensionAuth', 'true')
          
          // Show success message
          const successEl = document.getElementById('success')
          if (successEl) {
            successEl.classList.remove('hidden')
          }
          
          // Auto-close after 3 seconds
          setTimeout(() => {
            window.close()
          }, 3000)
        }
      })
      .catch(error => {
        console.error('Failed to get extension token:', error)
        const errorEl = document.getElementById('error')
        if (errorEl) {
          errorEl.classList.remove('hidden')
        }
      })
    } else {
      // Not authenticated, redirect to signin
      window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href)
    }
  }, [session, status])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 text-white text-center">
        <h1 className="text-2xl font-bold mb-6">Extension Authentication</h1>
        
        <div id="error" className="hidden mb-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          Failed to authenticate. Please try again.
        </div>

        <div id="success" className="hidden mb-4 p-4 bg-green-900/50 border border-green-500 rounded text-green-200">
          <p className="mb-2">✅ Authentication successful!</p>
          <p className="text-sm">You can now close this tab and return to the extension.</p>
        </div>

        <div id="instructions" className="hidden">
          <p className="mb-4">Copy this token and paste it into your extension:</p>
          <div className="bg-slate-900 p-4 rounded font-mono text-sm break-all border">
            <span id="tokenDisplay"></span>
          </div>
          <p className="text-sm text-slate-400 mt-4">You can close this window after copying the token.</p>
        </div>

        <div className="text-slate-400">
          <p>Please wait while we authenticate your extension...</p>
        </div>
      </div>
    </div>
  )
}
