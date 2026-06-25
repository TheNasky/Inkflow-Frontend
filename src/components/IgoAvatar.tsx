interface IgoAvatarProps {
  size?: 'sm' | 'md' | 'chat' | 'lg'
  className?: string
}

const frameSizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  chat: 'h-[3.25rem] w-[3.25rem]',
  lg: 'h-14 w-14',
}

/** IGO mascot — framed so the SVG sits cleanly on dark UI. */
export function IgoAvatar({ size = 'md', className = '' }: IgoAvatarProps) {
  return (
    <div
      className={`igo-avatar shrink-0 overflow-hidden rounded-2xl border border-flow/25 bg-[#0c0c0e] p-1 shadow-[0_0_18px_rgba(154,230,0,0.14)] ${frameSizes[size]} ${className}`}
      aria-hidden
    >
      <img
        src="/logo-igo.svg"
        alt=""
        className="igo-avatar-img h-full w-full object-contain object-center"
      />
    </div>
  )
}
