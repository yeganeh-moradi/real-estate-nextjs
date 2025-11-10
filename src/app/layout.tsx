import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

export const metadata: Metadata = {
    title: "سامانه خان",
    description: "سامانه مدیریت و خرید و فروش املاک - ساخته شده توسط سعید مرادی",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fa" dir="rtl">
        <body className="bg-gray-50 text-gray-900">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </body>
        </html>
    );
}
