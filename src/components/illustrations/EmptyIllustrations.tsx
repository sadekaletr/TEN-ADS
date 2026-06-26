export function EmptyCampaignsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="20" y="35" width="80" height="60" rx="8" stroke="#d4a855" strokeWidth="1.5" opacity="0.5" />
      <path d="M20 45h80" stroke="#d4a855" strokeWidth="1.5" opacity="0.35" />
      <path d="M60 35V25" stroke="#f0c97a" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 25h24" stroke="#f0c97a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="68" r="12" stroke="#c8953a" strokeWidth="1.5" opacity="0.6" />
      <path d="M54 68h12M60 62v12" stroke="#f0c97a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function EmptyRedemptionsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden>
      <rect x="28" y="30" width="64" height="40" rx="6" stroke="#d4a855" strokeWidth="1.5" opacity="0.55" />
      <path d="M36 42h48M36 52h32" stroke="#9a6e20" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <rect x="38" y="78" width="44" height="8" rx="2" stroke="#f0c97a" strokeWidth="1.5" opacity="0.4" />
      <circle cx="88" cy="82" r="4" fill="#d4a855" opacity="0.3" />
    </svg>
  );
}

export function EmptySearchIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden>
      <circle cx="52" cy="52" r="24" stroke="#d4a855" strokeWidth="2" opacity="0.6" />
      <path d="M70 70l22 22" stroke="#f0c97a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 52h16M52 44v16" stroke="#c8953a" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function EmptyWalletIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden>
      <rect x="22" y="38" width="76" height="52" rx="10" stroke="#d4a855" strokeWidth="1.5" opacity="0.5" />
      <circle cx="78" cy="64" r="8" stroke="#f0c97a" strokeWidth="1.5" />
      <path d="M22 52h76" stroke="#9a6e20" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
