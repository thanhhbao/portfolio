import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8D4E4]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EF]',
          // Primary
          variant === 'primary' && [
            'bg-[#051A24] text-white',
            'shadow-[0_12px_42px_rgba(5,26,36,0.22),inset_0_1px_0_rgba(255,255,255,0.26)]',
            'hover:-translate-y-0.5 hover:bg-[#082838] hover:shadow-[0_18px_58px_rgba(5,26,36,0.28),0_0_34px_rgba(168,212,228,0.18),inset_0_1px_0_rgba(255,255,255,0.32)]',
          ],
          // Secondary
          variant === 'secondary' && [
            'border border-white/55 bg-white/62 text-[#051A24] backdrop-blur-md',
            'shadow-[0_10px_34px_rgba(5,26,36,0.08),inset_0_1px_0_rgba(255,255,255,0.72)]',
            'hover:-translate-y-0.5 hover:bg-white/82 hover:shadow-[0_16px_46px_rgba(5,26,36,0.12)]',
          ],
          // Tertiary
          variant === 'tertiary' && [
            'bg-transparent text-[#051A24]',
            'hover:opacity-70',
          ],
          // Sizes
          size === 'default' && 'px-7 py-3 text-sm',
          size === 'sm' && 'px-5 py-2 text-sm',
          size === 'lg' && 'px-8 py-4 text-base',
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
