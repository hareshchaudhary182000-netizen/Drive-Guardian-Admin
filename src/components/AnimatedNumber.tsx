import { useEffect, useState } from 'react';

/** Counts up from 0 to `value` with an ease-out, once, on mount/value change. */
export const AnimatedNumber = ({
  value,
  duration = 900,
}: {
  value: number;
  duration?: number;
}) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{n.toLocaleString()}</>;
};
