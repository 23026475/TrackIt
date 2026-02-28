"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Import the Attribute type from next-themes
import { type Attribute } from "next-themes"

// Define proper props interface with correct typing
interface ThemeProviderProps {
  /** The HTML attribute to apply the theme to */
  attribute?: Attribute | Attribute[];
  /** The default theme name */
  defaultTheme?: string;
  /** Whether to enable system theme detection */
  enableSystem?: boolean;
  /** Whether to disable transition on theme change */
  disableTransitionOnChange?: boolean;
  /** Whether to inject theme class in head */
  enableColorScheme?: boolean;
  /** The storage key for theme persistence */
  storageKey?: string;
  /** Child components */
  children?: React.ReactNode;
}

export function ThemeProvider({ 
  children,
  attribute = "class", // Default to "class" which is a valid Attribute
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = true,
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme={enableColorScheme}
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}