/** Fixed backdrop behind every section: tinted wash, drifting light and a faint blueprint dot grid. */
export function PageBackground() {
  return (
    <div className="page-bg" aria-hidden="true">
      <div className="page-bg-wash" />
      <div className="page-bg-orb page-bg-orb-teal" />
      <div className="page-bg-orb page-bg-orb-gold" />
      <div className="page-bg-orb page-bg-orb-blue" />
      <div className="page-bg-grid" />
    </div>
  )
}
