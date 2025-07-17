"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react"

interface SignInProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
}

export function SignIn({ isOpen, onClose, onSwitchToSignUp }: SignInProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt (simulated):", { email: formData.email, password: formData.password })
    // In a real app, you'd send this to your authentication backend
    onClose() // Close dialog on simulated success
  }

  const handleGoogleAuth = () => {
    console.log("Login with Google (simulated)")
    // In a real app, you'd redirect to Google OAuth
    onClose() // Close dialog on simulated success
  }

  const resetForm = () => {
    setFormData({ email: "", password: "" })
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSwitchToSignUp = () => {
    resetForm()
    onSwitchToSignUp() // This will now correctly open the SignUp dialog
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Sign in to your account to continue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Sign In
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <p className="text-center text-sm text-slate-400">
          No account yet?{" "}
          <button
            type="button"
            onClick={handleSwitchToSignUp}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign up now
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
