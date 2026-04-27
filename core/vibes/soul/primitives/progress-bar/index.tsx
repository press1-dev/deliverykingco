import { clsx } from 'clsx';

interface Props {
  value: number; // 0 to 100
  variant?: 'white' | 'purple' | 'grey';
  className?: string;
}

export const ProgressBar = ({ value, variant = 'white', className }: Props) => {
  return (
    <div
      className={clsx(
        'h-2 w-full overflow-hidden rounded-full bg-[var(--progress-background,hsl(var(--contrast-100)))]',
        className
      )}
    >
      <div
        className={clsx(
          'h-full transition-all duration-500 ease-out',
          {
            white: 'bg-[var(--progress-fill-white,white)]',
            purple: 'bg-[var(--progress-fill-purple,hsl(var(--secondary)))]',
            grey: 'bg-[var(--progress-fill-grey,hsl(var(--contrast-300)))]',
          }[variant]
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
