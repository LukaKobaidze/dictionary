import { useState, useRef } from 'react';
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={`${styles.container} ${className}`}>
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
          {data.map((item) => {
            return (
              <button
                key={item.name}
                className={`${styles['extend__button']} ${item.className}`}
                onClick={(e) => {
                  onSelect(item);
                  setExtended(false);
                }}
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
