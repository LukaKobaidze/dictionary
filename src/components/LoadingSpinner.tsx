import styles from 'styles/LoadingSpinner.module.scss';

interface Props {
  className?: string;
}

export default function LoadingSpinner(props: Props) {
  const { className } = props;

  return (
    <div className={className || ''}>
      <div className={styles.spinner} />
    </div>
  );
}
