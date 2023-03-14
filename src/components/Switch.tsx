import styles from 'styles/Switch.module.scss';

interface Props {
  type: 'off' | 'on';
  onToggle: () => void;
  className?: string;
  ariaLabel: string;
}

export default function Switch(props: Props) {
  const { type, onToggle, className, ariaLabel } = props;

  return (
    <button
      className={`${styles.switch} ${type === 'on' ? styles['switch--on'] : ''} ${
        className || ''
      }`}
      onClick={onToggle}
      aria-label={ariaLabel}
    />
  );
}
