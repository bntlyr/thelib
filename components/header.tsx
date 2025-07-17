"use client"

import { useState } from "react"
import { Menu, X, BookOpen, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Library", href: "/dashboard" },
  ]

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signin")
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
            {session && (
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
            )}
            
            {session ? (
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || session.user?.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => router.push("/auth/signin")}
                className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium"
              >
                Login
              </Button>
            )}
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
              {session && navItems.map((item) => (
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
              
              {session ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300">
                    <User className="h-4 w-4" />
                    <span>{session.user?.name || session.user?.email}</span>
                  </div>
                  <Button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    router.push("/auth/signin")
                    setIsMobileMenuOpen(false)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-base font-medium w-full mt-2"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
