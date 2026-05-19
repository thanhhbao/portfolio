interface WordRevealProps {
  text: string
  className?: string
  delay?: number
}

export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  return (
    <span className={className}>
      {text.split(' ').map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="reveal-word"
          style={{ animationDelay: `${delay + index * 0.055}s` }}
        >
          {word}
          {index < text.split(' ').length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  )
}
