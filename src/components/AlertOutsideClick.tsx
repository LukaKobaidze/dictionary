import { useEffect, useRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onOutsideClick: () => void;
  shouldHandle?: boolean;
  ignore?: React.RefObject<Element>[];
}

export default function AlertOutsideClick(props: Props) {
  const {
    ignore,
    shouldHandle = true,
    onOutsideClick,
    children,
    ...restProps
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      if (
        !ref.current?.contains(target) &&
        (!ignore || ignore.every((ref) => !ref.current?.contains(target)))
      ) {
        onOutsideClick();
      }
    };

    if (shouldHandle) {
      document.addEventListener('click', handleClick);
    } else {
      document.removeEventListener('click', handleClick);
    }

    return () => document.removeEventListener('click', handleClick);
  }, [shouldHandle, onOutsideClick, ignore]);

  return (
    <div ref={ref} {...restProps}>
      {children}
    </div>
  );
}
