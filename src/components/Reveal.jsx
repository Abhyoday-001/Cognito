import useReveal from '../hooks/useReveal';

// Wraps any element so it fades/slides/scales into view once scrolled
// into the viewport. `variant` matches the [data-reveal="..."] CSS
// variants (up, drop, scale, left, right, stagger). `delay` (seconds)
// replicates the original site's per-section stagger, where each
// element in a section revealed slightly after the last.
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={className}
      style={{ transitionDelay: `${Math.min(delay, 0.5)}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
