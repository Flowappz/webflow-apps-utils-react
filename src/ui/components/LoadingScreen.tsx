import { WarningTriangleOutlineIcon } from '../icons';
import { Text } from './text';
import { Loader } from './Loader';

import './LoadingScreen.css';

export interface LoadingScreenProps {
  message?: string;
  position?: 'fixed' | 'absolute';
  active?: boolean;
  error?: boolean;
  raw?: boolean;
  backgroundColor?: string;
  spinnerSize?: number;
  className?: string;
}

export const LoadingScreen = ({
  message = '',
  position = 'fixed',
  active = false,
  error = false,
  raw = false,
  backgroundColor = 'rgba(30, 30, 30, 0.96)',
  spinnerSize = 50,
  className = '',
}: LoadingScreenProps) => {
  if (!active) return null;

  return (
    <div className={`main-loader ${className}`} style={{ position, backgroundColor }}>
      <div className={`loading-info ${error ? 'error' : ''}`}>
        {error ? (
          <>
            <WarningTriangleOutlineIcon />
            <Text fontSize="20px" fontWeight="600" label="Oops! That was unexpected." />
          </>
        ) : (
          <Loader size={spinnerSize} />
        )}
        <Text raw={raw} label={message} />
        {error && (
          <a href="https://forum.finsweet.com/c/finsweet-components" target="_blank" className="support" rel="noreferrer">
            <Text fontWeight="600" label="Click here to open Issue" />
          </a>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
