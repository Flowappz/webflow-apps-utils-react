import './Loader.css';

export interface LoaderProps {
  size?: number;
  color?: string;
  speed?: number;
  margin?: string;
  trackColor?: string;
}

export const Loader = ({
  size = 48,
  color = 'white',
  speed = 1,
  margin = '0',
  trackColor = 'var(--text2)',
}: LoaderProps) => {
  // Calculate proportional values based on the original design (24px size, 9px radius, 2px stroke)
  const radius = (size * 9) / 24; // Original radius was 9 for 24px size
  const strokeWidth = (size * 2) / 24; // Original stroke was 2 for 24px size
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLength = circumference / 4; // Quarter circle
  const gapLength = circumference - dashLength;

  return (
    <div className="fs-loader-wrapper" style={{ margin }}>
      <svg className="loader-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          opacity="0.2"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gapLength}`}
          strokeLinecap="round"
          className="loader-arc"
          style={{ animationDuration: `${speed}s`, transformOrigin: `${center}px ${center}px` }}
        />
      </svg>
    </div>
  );
};

export default Loader;
