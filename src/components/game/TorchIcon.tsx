interface TorchIconProps {
  lit: boolean;
  justSnuffed?: boolean;
  justAppeared?: boolean;
}

export function TorchIcon({ lit, justSnuffed, justAppeared }: TorchIconProps) {
  const getStyle = (): React.CSSProperties | undefined => {
    if (lit && justAppeared) {
      return { animation: 'torch-enter 400ms ease-out forwards, flame-flicker 2s ease-in-out 400ms infinite' };
    }
    if (lit) {
      return { animation: 'flame-flicker 2s ease-in-out infinite' };
    }
    if (justSnuffed) {
      return { animation: 'torch-snuff 500ms ease-out forwards' };
    }
    return undefined;
  };

  return (
    <div className="relative flex flex-col items-center w-8 h-10">
      <span
        className={`text-2xl leading-none ${!lit && !justSnuffed ? 'grayscale opacity-40' : ''}`}
        style={getStyle()}
      >
        🔥
      </span>
    </div>
  );
}
