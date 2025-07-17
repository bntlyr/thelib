import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Generate a token for the extension
    const token = jwt.sign(
      { 
        userId: session.user.id,
        email: session.user.email,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "30d" }
    )

    return NextResponse.json({ 
      token,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      }
    })
  } catch (error) {
    console.error("Error generating extension token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      }
    })
  } catch (error) {
    console.error("Error checking auth:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
