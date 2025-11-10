import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "عدم دسترسی" }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "شناسه پست نامعتبر است" }, { status: 400 });
    }

    // بررسی وجود پست
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "پست با این شناسه پیدا نشد" }, { status: 404 });
    }

    // حذف پست
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "پست با موفقیت حذف شد" });
  } catch (err: any) {
    console.error("DELETE /api/posts/[id] error:", err);

    if (err.code === 'P2025') {
      return NextResponse.json({ error: "پست با این شناسه پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "خطا در حذف پست" },
      { status: 500 }
    );
  }
}