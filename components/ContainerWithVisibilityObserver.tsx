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
    const element = elementRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      });
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={elementRef}>{children}</div>;
};

export default ContainerWithVisibilityObserver;
