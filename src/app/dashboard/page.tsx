import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogOut, Home, Users, Building, FileText, ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-700 px-4">
                برای دیدن داشبورد باید وارد شوید.
            </div>
        );
    }

    // بررسی ایمن برای مقادیر session
    const userName = session.user?.name || session.user?.email?.split('@')[0] || "کاربر";
    const userEmail = session.user?.email;

    return <DashboardClient userName={userName} userEmail={userEmail} />;
}