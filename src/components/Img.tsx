import type { CSSProperties, ImgHTMLAttributes } from 'react'
import manifest from '../data/image-manifest.json'

// Written by scripts/prepare-images.py: widths, intrinsic size and focal point per image.
type Entry = { width: number; height: number; widths: number[]; focal: string }
const IMAGES = manifest as Record<keyof typeof manifest, Entry>

export type ImageName = keyof typeof manifest

export const srcSet = (name: ImageName) => IMAGES[name].widths.map(width => `/images/${name}-${width}.webp ${width}w`).join(', ')
const fallback = (name: ImageName) => `/images/${name}-${IMAGES[name].widths[Math.min(1, IMAGES[name].widths.length - 1)]}.webp`

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> & {
  name: ImageName
  alt: string
  sizes: string
  /** Above-the-fold images load eagerly with high priority; everything else is lazy. */
  priority?: boolean
}

export function Img({ name, alt, sizes, priority = false, style, ...rest }: Props) {
  const entry = IMAGES[name]
  return (
    <img
      src={fallback(name)}
      srcSet={srcSet(name)}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ objectPosition: entry.focal, ...style } as CSSProperties}
      {...rest}
    />
  )
}
