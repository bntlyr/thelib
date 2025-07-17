import { BookOpen, Github, Twitter, DiscIcon as Discord } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Browse", href: "#" },
      { name: "Popular", href: "#" },
      { name: "Latest", href: "#" },
      { name: "Random", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Bug Report", href: "#" },
      { name: "Feature Request", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "DMCA", href: "#" },
      { name: "Disclaimer", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Discord", icon: Discord, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
  ]

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                TheLib
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-md">
              Your ultimate destination for manga, manhwa, and anime. Discover, read, and stay updated with the latest
              releases.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  asChild
                >
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© {currentYear} TheLib. All rights reserved.</p>
          <p className="text-slate-500 text-xs mt-2 sm:mt-0">Made with ❤️ for manga and anime lovers</p>
        </div>
      </div>
    </footer>
  )
}
