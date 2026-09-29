import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const imageStyle = (image: string) => ({ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(18,31,28,.82) 100%), url(${image})` })
