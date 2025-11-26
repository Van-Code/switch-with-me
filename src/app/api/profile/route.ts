try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { firstName, lastInitial, bio, favoritePlayer } = body

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastInitial && { lastInitial }),
        ...(bio !== undefined && { bio }),
        ...(favoritePlayer !== undefined && { favoritePlayer }),
      },
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}