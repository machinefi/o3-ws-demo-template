import Providers from "./providers";
import "./globals.css";
import { Navbar } from "./Navbar";
import { INTEGRATION_NAME } from "./config";

export const metadata = {
  title: `${INTEGRATION_NAME} Demo`,
  description: `${INTEGRATION_NAME} integration demo`,
};

export default async function RootLayout ({
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
