import { useState, useRef, useEffect, forwardRef } from 'react';
import { ReactComponent as IconSearch } from 'assets/images/icon-search.svg';
import { Heading } from 'components';
import styles from 'styles/Search.module.scss';

interface Props {
  word: string;
  onSubmit: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
}
type Ref = HTMLFormElement;

export default forwardRef<Ref, Props>(function Search(props, ref) {
  const { word, onSubmit, autoFocus, className } = props;

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(false);
  };

  useEffect(() => {
    setValue(word);

    if (word.trim() === '') {
      setError(true);
    }
  }, [word]);

  return (
    <form
      ref={ref}
      className={`${styles.container} ${className || ''}`}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        className={`${styles.input} ${error ? styles['input--error'] : ''}`}
        value={value}
        onChange={handleInputChange}
        placeholder="Search for any word..."
        autoFocus={autoFocus}
      />
      <button
        tabIndex={-1}
        type="submit"
        className={styles.button}
        onClick={() =>
          (value.trim().length === 0 || word === value) && inputRef.current?.focus()
        }
        aria-label="search"
      >
        <IconSearch className={styles.icon} />
      </button>

      {error && (
        <Heading level="3" className={styles['error-text']}>
          Whoops, can't be empty...
        </Heading>
      )}
    </form>
  );
});
