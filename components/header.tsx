"use client"

import { useState } from "react"
import { Menu, X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignIn } from "@/components/sign-in" // Import the SignIn dialog
import { SignUp } from "@/components/sign-up" // Import the SignUp dialog

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false) // State for SignUp dialog

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Anime", href: "#" },
    { name: "Manga", href: "#" },
    { name: "Manhwa", href: "#" },
  ]

  const handleSwitchToSignUp = () => {
    setIsSignInDialogOpen(false) // Close sign-in dialog
    setIsSignUpDialogOpen(true) // Open sign-up dialog
  }

  const handleSwitchToSignIn = () => {
    setIsSignUpDialogOpen(false) // Close sign-up dialog
    setIsSignInDialogOpen(true) // Open sign-in dialog
  }

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              TheLib
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 text-sm font-medium transition-colors"
                  asChild
                >
                  <a href={item.href}>{item.name}</a>
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setIsSignInDialogOpen(true)} // Open SignIn dialog
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800 block px-3 py-2 text-base font-medium w-full justify-start"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <a href={item.href}>{item.name}</a>
                </Button>
              ))}
              <Button
                onClick={() => {
                  setIsSignInDialogOpen(true) // Open SignIn dialog
                  setIsMobileMenuOpen(false) // Close mobile menu
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-base font-medium w-full mt-2"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* SignIn Dialog */}
      <SignIn
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />

      {/* SignUp Dialog */}
      <SignUp
        isOpen={isSignUpDialogOpen}
        onClose={() => setIsSignUpDialogOpen(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </header>
  )
}
