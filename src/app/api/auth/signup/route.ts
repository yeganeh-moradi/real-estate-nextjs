import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ۱. اعتبارسنجی اولیه
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند." },
        { status: 400 }
      );
    }

    // ۲. بررسی تکراری نبودن ایمیل یا شماره تلفن
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    // ۳. هش رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ۴. ایجاد کاربر جدید
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false, // فعلاً تأیید نشده
        role: "USER", // مقدار پیش‌فرض، ولی می‌تونی بنویسی
      },
    });

    // ۵. پاسخ موفقیت‌آمیز
    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد ✅",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("خطا در ثبت‌نام:", err);
    return NextResponse.json(
      { error: "مشکلی در ثبت‌نام پیش آمد." },
      { status: 500 }
    );
  }
}
