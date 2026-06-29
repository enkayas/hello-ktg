import type { ReactNode } from "react";
import HKFooter from "./Footer";
import HKHeader from "./Header";

export default function HKShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HKHeader />
      <main className="flex-1">{children}</main>
      <HKFooter />
    </>
  );
}
