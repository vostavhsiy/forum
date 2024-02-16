"use client";

import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Provider } from "react-redux";
import store from "@/store/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        //disableTransitionOnChange
      >
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </NextAuthProvider>
  );
};
