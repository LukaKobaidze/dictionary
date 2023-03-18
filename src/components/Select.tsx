import { useState, useRef, useEffect } from 'react';
import { ReactComponent as IconArrowDown } from 'assets/images/icon-arrow-down.svg';
import { Text, AlertOutsideClick } from 'components';
import { FontType } from 'App';
import styles from 'styles/Select.module.scss';

interface Props {
  data: FontType[];
  selected: FontType;
  onSelect: (value: FontType) => void;
  className?: string;
}

export default function Select(props: Props) {
  const { data, selected, onSelect, className } = props;

  const [extended, setExtended] = useState(false);
  const [itemFocused, setItemFocused] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault();

        setItemFocused((state) => {
          if (state === null) return 0;
          return Math.min(state + 1, data.length - 1);
        });
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault();

        setItemFocused((state) => {
          if (state === null) return 0;
          return Math.max(state - 1, 0);
        });
      } else if (e.key === 'Escape') {
        setExtended(false);
        buttonRef.current?.focus();
      }
    };

    if (extended) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      setItemFocused(null);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [extended, data.length]);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <button
        ref={buttonRef}
        className={styles.button}
        onClick={() => setExtended((state) => !state)}
      >
        <Text
          size="M"
          tag="span"
          className={`${styles['text-main']} ${selected.className}`}
        >
          {selected.name}
        </Text>
        <IconArrowDown className={styles['button__icon']} />
      </button>

      {extended && (
        <AlertOutsideClick
          onOutsideClick={() => setExtended(false)}
          ignore={[buttonRef]}
          className={styles.extend}
        >
          {data.map((item, i) => {
            return (
              <button
                key={item.name}
                ref={(node) =>
                  ((itemFocused === null && item.name === selected.name) ||
                    itemFocused === i) &&
                  node?.focus()
                }
                className={`${styles['extend__button']} ${item.className}`}
                onClick={(e) => {
                  onSelect(item);
                  setExtended(false);
                  buttonRef.current?.focus();
                }}
                onFocus={() => setItemFocused(i)}
              >
                {item.name}
              </button>
            );
          })}
        </AlertOutsideClick>
      )}
    </div>
  );
}
