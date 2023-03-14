import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Logo, IconMoon, IconSearch } from 'assets/images';
import { useLocalStorageState, useVisibility, useFirstRender } from 'hooks';
import { Select, Switch, AlertOutsideClick, Search, Definition } from 'components';
import styles from 'styles/App.module.scss';

export type FontType = { name: string; className: string };

const fonts: FontType[] = [
  { name: 'Sans Serif', className: 'sans-serif' },
  { name: 'Serif', className: 'serif' },
  { name: 'Mono', className: 'mono' },
];

let previousFont: FontType | null = null;

export default function App() {
  const getDefaultWord = () => {
    return localStorage.getItem('dictionary-word') || 'keyboard';
  };
  const getDefaultTheme = (): 'light' | 'dark' => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  };

  const isFirstRender = useFirstRender();
  const [searchParams, setSearchParams] = useSearchParams();
  const [theme, setTheme] = useLocalStorageState(
    'dictionary-theme',
    getDefaultTheme
  );
  const [font, setFont] = useLocalStorageState<FontType>(
    'dictionary-font',
    fonts[1]
  );
  const [popupSearch, setPopupSearch] = useState(false);
  const [isSearchVisible, searchRef] = useVisibility<HTMLFormElement>();
  const headerSearchBtnRef = useRef<HTMLButtonElement>(null);

  const searchParamsWord = searchParams.get('word');
  const word = useMemo(
    () => searchParamsWord || (isFirstRender ? getDefaultWord() : ''),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParamsWord]
  );

  const toggleTheme = () => {
    setTheme((state) => (state === 'light' ? 'dark' : 'light'));
  };

  const handleSearchSubmit = (value: string) => {
    if (value === word) return;

    if (value === '') {
      searchParams.delete('word');
    } else {
      searchParams.set('word', value);
    }

    setSearchParams(searchParams);
  };

  useEffect(() => {
    document.body.classList.add(font.className);

    if (previousFont && font.name !== previousFont.name) {
      document.body.classList.remove(previousFont.className);
    }

    previousFont = font;
  }, [font]);

  useEffect(() => {
    const themeOpposite = theme === 'light' ? 'dark' : 'light';
    document.body.classList.add(theme);
    document.body.classList.remove(themeOpposite);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dictionary-word', word);
  }, [word]);

  useEffect(() => {
    if (isSearchVisible) {
      setPopupSearch(false);
    }
  }, [isSearchVisible]);

  return (
    <>
      <header className={`${styles.header} layout-width`}>
        <Logo className={styles['header__logo']} />
        <button
          className={`${styles['header__search-btn']} ${
            !isSearchVisible && !popupSearch
              ? styles['header__search-btn--show']
              : ''
          }`}
          tabIndex={isSearchVisible ? -1 : undefined}
          onClick={() => setPopupSearch(true)}
          ref={headerSearchBtnRef}
        >
          <IconSearch />
        </button>
        <Select
          className={styles['header__select']}
          data={fonts}
          selected={font}
          onSelect={(font) => setFont(font)}
        />
        <div className={styles['header__line']} />
        <Switch type={theme === 'light' ? 'off' : 'on'} onToggle={toggleTheme} />
        <IconMoon
          className={`${styles['header__moon']} ${
            theme === 'dark' ? styles['header__moon--dark'] : ''
          }`}
          onClick={toggleTheme}
        />
      </header>

      <main className={`${styles.main} layout-width`}>
        {popupSearch && (
          <AlertOutsideClick
            className={`${styles.popupsearch} layout-width`}
            onOutsideClick={() => setPopupSearch(false)}
            shouldHandle={popupSearch}
            ignore={[headerSearchBtnRef]}
          >
            <Search word={word} onSubmit={handleSearchSubmit} autoFocus />
          </AlertOutsideClick>
        )}

        <Search
          ref={searchRef}
          className={styles.search}
          word={word}
          onSubmit={handleSearchSubmit}
        />
        <Definition word={word} />
      </main>
    </>
  );
}
