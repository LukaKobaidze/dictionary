import styles from 'styles/Switch.module.scss';

interface Props {
  type: 'off' | 'on';
  onToggle: () => void;
  className?: string;
}

export default function Switch(props: Props) {
  const { type, onToggle, className } = props;

  return (
    <button
      className={`${styles.switch} ${
        type === 'on' ? styles['switch--on'] : ''
      } ${className || ''}`}
      onClick={onToggle}
    />
  );
}
