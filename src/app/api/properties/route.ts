// app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // اعتبارسنجی فیلدهای ضروری
        if (!body.title || !body.description || !body.propertyType || !body.dealType || !body.area || !body.location) {
            return NextResponse.json(
                { error: "فیلدهای ضروری را پر کنید" },
                { status: 400 }
            );
        }

        const property = await prisma.property.create({
            data: {
                title: body.title,
                description: body.description,
                propertyType: body.propertyType,
                dealType: body.dealType,
                price: body.price,
                rentPrice: body.rentPrice,
                depositPrice: body.depositPrice,
                area: body.area,
                roomCount: body.roomCount,
                bathroomCount: body.bathroomCount,
                floor: body.floor,
                totalFloors: body.totalFloors,
                yearBuilt: body.yearBuilt,
                parking: body.parking || false,
                elevator: body.elevator || false,
                storage: body.storage || false,
                furnished: body.furnished || false,
                status: body.status || "active",
                location: body.location,
                images: body.images || [],
                ownerId: body.ownerId || 1, // در حالت واقعی از authentication استفاده می‌شود
            },
        });

        return NextResponse.json(property, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/properties error:", err);
        return NextResponse.json(
            { error: "خطا در ایجاد ملک جدید" },
            { status: 500 }
        );
    }
}