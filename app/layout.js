import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "FitAI Coach",
  description: "Your AI-powered personal trainer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
