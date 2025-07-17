"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, Chrome } from "lucide-react"

interface SignUpProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

export function SignUp({ isOpen, onClose, onSwitchToSignIn }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!") // Basic alert for frontend-only
      return
    }
    console.log("Signup attempt (simulated):", formData)
    // In a real app, you'd send this to your authentication backend
    onClose() // Close dialog on simulated success
  }

  const handleGoogleAuth = () => {
    console.log("Signup with Google (simulated)")
    // In a real app, you'd redirect to Google OAuth.
    // For this frontend-only example, we'll simulate showing the name prompt.
    setShowNamePrompt(true)
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Name submitted after Google signup (simulated):", formData.name)
    // In a real app, you'd update the user's profile with the name
    onClose() // Close dialog on simulated success
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setShowNamePrompt(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSwitchToSignIn = () => {
    resetForm()
    onSwitchToSignIn()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
        {!showNamePrompt ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-white">Create Account</DialogTitle>
              <DialogDescription className="text-center text-slate-400">
                Sign up to get started with your manga collection
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="signup-email"
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
                <Label htmlFor="signup-password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-300">
                  Re-enter Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Create Account
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
              Sign up with Google
            </Button>
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleSwitchToSignIn}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign in here
              </button>
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-white">Complete Your Profile</DialogTitle>
              <DialogDescription className="text-center text-slate-400">
                Please enter your name to complete the signup process
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-slate-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="profile-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Complete Signup
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
