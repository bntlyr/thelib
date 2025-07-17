import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Update manga
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
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

    // Check if manga belongs to user
    const existingManga = await prisma.manga.findFirst({
      where: { 
        id: id,
        userId: session.user.id 
      }
    })

    if (!existingManga) {
      return NextResponse.json(
        { error: "Manga not found or unauthorized" },
        { status: 404 }
      )
    }

    const manga = await prisma.manga.update({
      where: { id: id },
      data: {
        title,
        currentChapter,
        status,
        imgPath,
        rating: rating ? parseFloat(rating) : null,
        source,
        description,
        genres,
        author,
      }
    })

    return NextResponse.json(manga)
  } catch (error) {
    console.error("Error updating manga:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete manga
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if manga belongs to user
    const existingManga = await prisma.manga.findFirst({
      where: { 
        id: id,
        userId: session.user.id 
      }
    })

    if (!existingManga) {
      return NextResponse.json(
        { error: "Manga not found or unauthorized" },
        { status: 404 }
      )
    }

    await prisma.manga.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: "Manga deleted successfully" })
  } catch (error) {
    console.error("Error deleting manga:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
