import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import DeletePropertyButton from "@/components/DeletePropertyButton";

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        برای مشاهده املاک باید وارد شوید.
      </div>
    );
  }

  // دریافت لیست املاک از دیتابیس
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت املاک</h1>
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← بازگشت به داشبورد
        </Link>
      </div>

      {/* دکمه افزودن ملک جدید */}
      <div className="mb-6">
        <Link
          href="/dashboard/properties/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          افزودن ملک جدید +
        </Link>
      </div>

      {/* جدول املاک */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-right">#</th>
              <th className="py-3 px-4 text-right">عنوان</th>
              <th className="py-3 px-4 text-right">موقعیت</th>
              <th className="py-3 px-4 text-right">قیمت</th>
              <th className="py-3 px-4 text-right">تاریخ ثبت</th>
              <th className="py-3 px-4 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  هیچ ملکی ثبت نشده است.
                </td>
              </tr>
            ) : (
              properties.map((property, index) => (
                <tr
                  key={property.id}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{property.title}</td>
                  <td className="py-3 px-4">{property.location || "—"}</td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">
                    {property.price
                      ? property.price.toLocaleString("fa-IR") + " تومان"
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(property.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="py-3 px-4 space-x-2 flex gap-2 justify-end">
                    <Link
                      href={`/properties/${property.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      مشاهده
                    </Link>
                    <Link
                      href={`/dashboard/properties/edit/${property.id}`}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ویرایش
                    </Link>
                    <DeletePropertyButton
                      propertyId={property.id} // ID از نوع number
                      propertyTitle={property.title}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
