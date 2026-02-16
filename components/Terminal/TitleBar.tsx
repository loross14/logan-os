'use client';

interface TitleBarProps {
  onExpandToggle: () => void;
}

export function TitleBar({ onExpandToggle }: TitleBarProps) {
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpandToggle();
  };

  return (
    <div className="terminal-titlebar">
      <div className="terminal-titlebar-left">
        <span
          className="tdot r"
          onClick={handleExpandClick}
          title="Expand/Shrink"
        />
        <span className="tdot y" />
        <span className="tdot g" />
        <span style={{ marginLeft: '8px' }}>logan@portfolio</span>
      </div>
    </div>
  );
}
