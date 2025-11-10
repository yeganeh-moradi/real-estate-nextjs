// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'فایلی آپلود نشده است' },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'فایل باید یک تصویر باشد' },
        { status: 400 }
      );
    }

    // بررسی حجم فایل (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم فایل نباید بیشتر از 5MB باشد' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // تولید نام فایل منحصر به فرد
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${timestamp}-${random}.${fileExtension}`;

    // مسیر ذخیره‌سازی در دیسک لیارا
    const storageDir = '/storage/images/profiles';
    
    // اطمینان از وجود پوشه
    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true });
    }

    const filePath = join(storageDir, fileName);

    // ذخیره فایل در دیسک لیارا
    await writeFile(filePath, buffer);

    // فقط نام فایل را برگردانید
    return NextResponse.json({
      success: true,
      fileName: fileName,
      message: 'فایل با موفقیت آپلود شد'
    });

  } catch (error: any) {
    console.error('خطا در آپلود فایل:', error);
    return NextResponse.json(
      { error: 'خطای سرور در آپلود فایل' },
      { status: 500 }
    );
  }
}