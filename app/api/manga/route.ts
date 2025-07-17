import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

// Helper function to get user from session or extension token
async function getAuthenticatedUser(req: NextRequest) {
  // First try NextAuth session
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return { id: session.user.id, email: session.user.email }
  }

  // Then try extension token
  const authHeader = req.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
        userId: string
        email: string
        iat: number
        exp: number
      }
      if (decoded.userId) {
        return { id: decoded.userId, email: decoded.email }
      }
    } catch (error) {
      console.error("Invalid extension token:", error)
    }
  }

  return null
}

// GET - Fetch user's manga
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const manga = await prisma.manga.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(manga)
  } catch (error) {
    console.error("Error fetching manga:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Add new manga
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { 
      title, 
      currentChapter, 
      status, 
      imgPath, 
      rating, 
      source, 
      description, 
      genres, 
      author 
    } = await req.json()

    if (!title || !currentChapter) {
      return NextResponse.json(
        { error: "Title and current chapter are required" },
        { status: 400 }
      )
    }

    const manga = await prisma.manga.create({
      data: {
        title,
        currentChapter,
        status: status || 'ONGOING',
        imgPath,
        rating: rating ? parseFloat(rating) : null,
        source,
        description,
        genres: genres || [],
        author,
        userId: user.id,
      }
    })

    return NextResponse.json(manga, { status: 201 })
  } catch (error) {
    console.error("Error creating manga:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
