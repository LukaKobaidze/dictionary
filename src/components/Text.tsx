import styles from 'styles/Text.module.scss';

interface Props
  extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  size: 'S' | 'M';
  tag?: 'p' | 'span';
}

export default function Text(props: Props) {
  const { size, tag = 'p', className, children, ...restProps } = props;

  const Tag: keyof JSX.IntrinsicElements = tag;

  return (
    <Tag
      className={`${size === 'S' ? styles.small : styles.medium} ${className}`}
      {...restProps}
    >
      {children}
    </Tag>
  );
}
