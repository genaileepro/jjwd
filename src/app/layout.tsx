import './globals.css';
import 'animate.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: '좌중우돌 - 정치성향 테스트',
    description: '당신의 정치성향을 알아보는 테스트입니다.',
    icons: {
        icon: '/favicon-emoji.svg',
    },
    openGraph: {
        title: '좌중우돌 - 정치성향 테스트',
        description: '당신의 정치성향을 알아보는 테스트입니다.',
        type: 'website',
        images: [
            {
                url: '/jjwdOgImage.png',
                width: 1200,
                height: 630,
                alt: '좌중우돌 - 정치성향 테스트',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <link rel="preconnect" href="https://cdn.jsdelivr.net" />
                <link
                    rel="stylesheet"
                    as="style"
                    crossOrigin="anonymous"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css"
                />
                <link
                    rel="icon"
                    href="/favicon-emoji.svg"
                    type="image/svg+xml"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
