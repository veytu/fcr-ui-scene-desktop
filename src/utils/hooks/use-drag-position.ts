import { useEffect, useRef, useState } from 'react';

export const useDraggablePosition = ({
  initPosition = { x: 0, y: 0 },
  centered = false,
}: {
  initPosition?: { x: number; y: number };
  centered?: boolean;
}) => {
  const [position, setPosition] = useState(initPosition);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    centered &&
      setPosition({
        x: document.body.getBoundingClientRect().width / 2 - (ref.current?.offsetWidth || 0) / 2,
        y: document.body.getBoundingClientRect().height / 2 - (ref.current?.offsetHeight || 0) / 2,
      });
  }, []);
  return { position, setPosition, ref };
};
