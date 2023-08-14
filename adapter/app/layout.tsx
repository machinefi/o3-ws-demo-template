import Providers from "./providers";
import "./globals.css";
import { Navbar } from "./Navbar";

export const metadata = {
  title: "DIMO Demo",
  description: "DIMO integration demo",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-mono">
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
