import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';

const ContainerWithVisibilityObserver = ({
  onVisible,
  children
}: PropsWithChildren<{
  onVisible: () => unknown;
}>) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      });
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return <div ref={elementRef}>{children}</div>;
};

export default ContainerWithVisibilityObserver;
