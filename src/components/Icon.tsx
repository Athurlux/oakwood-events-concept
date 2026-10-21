// Interface glyphs on a 24px grid, stroked in currentColor.
const paths = {
  check: 'M4 12l5 5L20 6',
  back: 'M19 12H5m5-5-5 5 5 5',
  edit: 'M4 20h4L19 9l-4-4L4 16v4Z',
  menu: 'M4 8h16M4 16h16',
  close: 'M6 6l12 12M18 6 6 18',
  print: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  )
}
