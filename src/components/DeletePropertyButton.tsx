"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePropertyButtonProps {
    propertyId: number; // تغییر از string به number
    propertyTitle: string;
}

export default function DeletePropertyButton({
                                                 propertyId,
                                                 propertyTitle,
                                             }: DeletePropertyButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/properties/${propertyId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh(); // رفرش لیست
            } else {
                const error = await response.json();
                alert(error.error || "خطا در حذف ملک");
            }
        } catch (error) {
            console.error("Error deleting property:", error);
            alert("خطا در حذف ملک");
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="text-red-600 border p-2 rounded-md hover:text-red-800 text-sm disabled:opacity-50"
            >
                حذف
            </button>

            {/* Modal تایید حذف */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            تایید حذف ملک
                        </h3>
                        <p className="text-gray-600 mb-6">آیا از حذف ملک
                            {propertyTitle} مطمئن هستید؟ این عمل غیرقابل بازگشت است.
                        </p>
                        <div className="flex gap-3 justify-start">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {isDeleting ? "در حال حذف..." : "حذف"}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}