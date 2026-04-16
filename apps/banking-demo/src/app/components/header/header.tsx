import type { RefObject } from 'react';
import '@temp-nx/smart-search';
import styles from './header.module.css';
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../theme-toggle/ThemeToggle';

interface HeaderProps {
  searchRef: RefObject<HTMLElement | null>;
}

export function Header({ searchRef }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header className={styles['app-header']}>
      <div className={styles['header-content']}>
        <div className={styles.logo}>
          <span>JB</span>
        </div>

        <div className={styles['search-wrapper']}>
          <smart-search
            ref={searchRef}
            placeholder="Search accounts, payments, or people..."
            theme={theme}
          />
        </div>

        <div className={styles['user-profile']}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
