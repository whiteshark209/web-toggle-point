import { Didact_Gothic } from "next/font/google";
import styles from "./styles.module.css";
import { ReactNode } from "react";

const didactGothic = Didact_Gothic({
  display: "swap",
  weight: "400",
  subsets: ["latin"]
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={didactGothic.className}>
      <body className={styles.body}>{children}</body>
    </html>
  );
}
