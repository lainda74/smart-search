import { useTheme } from '../../hooks/useTheme';
import styles from './theme-toggle.module.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={styles.toggle} onClick={toggleTheme}>
      {theme === 'light' ? (
        <span className="material-icons">dark_mode</span>
      ) : (
        <span className="material-icons">light_mode</span>
      )}
    </div>
  );
}
