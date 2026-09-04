import { useLayoutEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/** A textarea that grows with its content — the area-note behaviour from the MVP. */
export function AutoGrowTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [props.value]);

  return <textarea ref={ref} {...props} />;
}
