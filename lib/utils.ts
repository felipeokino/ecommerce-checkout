import BlackFridayBanner from '@/components/banner/blackfriday.banner';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const activeBanner = {
  active: true,
  component: BlackFridayBanner
};

export const appName = "KimKabum Store";