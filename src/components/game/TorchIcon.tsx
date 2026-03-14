interface TorchIconProps {
  lit: boolean;
  justSnuffed?: boolean;
}

export function TorchIcon({ lit, justSnuffed }: TorchIconProps) {
  return (
    <div className="relative flex flex-col items-center w-8 h-10">
      {lit ? (
        <span
          className="text-2xl leading-none"
          style={{ animation: 'flame-flicker 2s ease-in-out infinite' }}
        >
          🔥
        </span>
      ) : (
        <span
          className="text-2xl leading-none grayscale opacity-40"
          style={justSnuffed ? { animation: 'torch-snuff 500ms ease-out forwards' } : undefined}
        >
          🔥
        </span>
      )}
    </div>
  );
}
