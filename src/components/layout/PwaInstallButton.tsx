import { Download, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../Context/Languge';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { clsx } from 'clsx';

type PwaInstallButtonProps = {
  /** Icon-only, smaller — e.g. mobile navbar */
  compact?: boolean;
  className?: string;
};

const PwaInstallButton = ({ compact, className }: PwaInstallButtonProps) => {
  const { t } = useLanguage();
  const { visible, showChromeInstall, showIosHint, promptInstall } =
    usePwaInstall();

  if (!visible) return null;

  const handleClick = async () => {
    if (showChromeInstall) {
      await promptInstall();
      return;
    }
    if (showIosHint) {
      toast(t('common.navigation.iosInstallHint'), {
        duration: 6000,
        icon: '📱',
        style: { maxWidth: 360 },
      });
    }
  };

  const label = compact
    ? t('common.navigation.installAppShort')
    : t('common.navigation.installApp');

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={label}
        aria-label={label}
        className={clsx(
          'group relative flex h-11 w-11 items-center justify-center rounded-full',
          'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/25',
          'ring-2 ring-white/20 transition hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-600/35 active:scale-[0.98]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
          className
        )}
      >
        <Download
          className="h-[1.15rem] w-[1.15rem] transition group-hover:translate-y-0.5"
          strokeWidth={2.25}
        />
        <span
          className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] shadow-sm"
          aria-hidden
        >
          <Sparkles className="h-2.5 w-2.5 text-amber-950" strokeWidth={2.5} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-white',
        'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
        'shadow-md shadow-blue-600/30 ring-1 ring-white/25 transition',
        'hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/35',
        'active:scale-[0.98]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        className
      )}
    >
      <span
        className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/30">
        <Download className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="relative">{label}</span>
    </button>
  );
};

export default PwaInstallButton;
