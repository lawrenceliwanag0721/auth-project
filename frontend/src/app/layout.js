import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Auth App",
  description: "CRUD practice app using MERN stack",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.className} min-h-full flex flex-col`}
    >
      <body className="min-h-full flex flex-col text-lg">{children}</body>
    </html>
  );
}
