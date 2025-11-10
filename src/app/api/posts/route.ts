import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, category, published, imageUrl, videoUrl, embedCode } = body;

    // اعتبارسنجی فیلدهای اجباری
    if (!title || title.trim().length < 2) {
      return NextResponse.json({ error: "عنوان پست باید حداقل ۲ کاراکتر باشد" }, { status: 400 });
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: "محتوای پست باید حداقل ۱۰ کاراکتر باشد" }, { status: 400 });
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ایجاد پست جدید
    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category?.trim() || null,
        published: published || false,
        imageUrl: imageUrl?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        embedCode: embedCode?.trim() || null,
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        published: true,
        imageUrl: true,
        videoUrl: true,
        embedCode: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}