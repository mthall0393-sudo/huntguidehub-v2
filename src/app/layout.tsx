import type { Metadata } from "next";
import { Oswald, Source_Serif_4 } from "next/font/google"; // Import fonts
import "./globals.css";

// Load fonts with appropriate weights and styles
const oswald = Oswald({ 
  subsets: ["latin"], 
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: '--font-oswald', // Define variable for tailwind
});
const sourceSerif4 = Source_Serif_4({ 
  subsets: ["latin"], 
  style: ["normal", "italic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-source-serif-4', // Define variable for tailwind
});


export const metadata: Metadata = {
  title: "HuntGuideHub v2",
  description: "Your ultimate guide to hunting outfitters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply font variables to the body */}
      <body className={`${oswald.variable} ${sourceSerif4.variable} font-sans`}> 
        {children}
        {/* Added a very visible test element */}
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          backgroundColor: 'orange', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px', 
          zIndex: 1000,
          fontSize: '12px' 
        }}>
          DEPLOYMENT CHECK 123
        </div>
      </body>
    </html>
  );
}
