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
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300',
          // Primary
          variant === 'primary' && [
            'bg-[#051A24] text-white',
            'shadow-[0_1px_2px_0_rgba(5,26,36,0.1),0_4px_4px_0_rgba(5,26,36,0.09),0_9px_6px_0_rgba(5,26,36,0.05),0_17px_7px_0_rgba(5,26,36,0.01),0_26px_7px_0_rgba(5,26,36,0),inset_0_2px_8px_0_rgba(255,255,255,0.5)]',
            'hover:scale-[1.02] hover:shadow-[0_1px_2px_0_rgba(5,26,36,0.15),0_6px_6px_0_rgba(5,26,36,0.12),0_12px_8px_0_rgba(5,26,36,0.08),0_20px_10px_0_rgba(5,26,36,0.03),0_30px_10px_0_rgba(5,26,36,0),inset_0_2px_8px_0_rgba(255,255,255,0.6)]',
          ],
          // Secondary
          variant === 'secondary' && [
            'bg-white text-[#051A24]',
            'shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_4px_30px_rgba(0,0,0,0.08)]',
            'hover:scale-[1.02] hover:shadow-[0_0_0_0.5px_rgba(0,0,0,0.08),0_6px_35px_rgba(0,0,0,0.12)]',
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
