import styles from 'styles/Heading.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  level: '1' | '2' | '3';
}

export default function Heading(props: Props) {
  const { level, className, children, ...restProps } = props;

  const HeadingLevel: keyof JSX.IntrinsicElements = `h${level}`;

  return (
    <HeadingLevel
      className={`${styles.heading} ${styles[`heading--${level}`]} ${className}`}
      {...restProps}
    >
      {children}
    </HeadingLevel>
  );
}
