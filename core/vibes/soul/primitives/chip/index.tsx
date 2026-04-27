import { clsx } from 'clsx';
import { X, LucideIcon } from 'lucide-react';

interface Props {
  name?: string;
  value?: string;
  children?: React.ReactNode;
  removeLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'contrast';
  icon?: LucideIcon;
}

export const Chip = function Chip({
  name,
  value,
  children,
  removeLabel = 'Remove',
  onClick,
  variant = 'contrast',
  icon: Icon,
}: Props) {
  return (
    <span className={clsx(
      'flex h-9 items-center gap-1.5 rounded-lg py-2 pe-2 ps-3 text-sm font-semibold leading-5',
      {
        primary: 'bg-primary text-primary-shadow',
        secondary: 'bg-secondary text-white',
        success: 'bg-success text-success-shadow',
        error: 'bg-error text-white',
        info: 'bg-info text-white',
        contrast: 'bg-contrast-100 text-foreground',
      }[variant]
    )}>
      {Icon && <Icon size={14} className="shrink-0" />}
      {children}
      {onClick && (
        <button
          className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-foreground"
          name={name}
          onClick={onClick}
          title={removeLabel}
          value={value}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};
