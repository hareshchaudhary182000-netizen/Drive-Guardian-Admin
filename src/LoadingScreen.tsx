import { Box } from '@mui/material';

/**
 * ChatGPT-style loader: 12 fading "spokes" rotating around the centre.
 * Shown while the admin app boots / checks auth after login.
 */
export const LoadingScreen = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      bgcolor: 'background.default',
      zIndex: 2000,
    }}
  >
    <style>{`
      @keyframes cg-spoke-fade { 0% { opacity: 1; } 100% { opacity: 0.15; } }
      .cg-spinner { position: relative; width: 34px; height: 34px; color: #9aa0a6; }
      .cg-spinner i {
        position: absolute;
        left: calc(50% - 1.6px);
        top: calc(50% - 1.6px);
        width: 3.2px;
        height: 9px;
        border-radius: 3px;
        background: currentColor;
        opacity: 0.15;
        animation: cg-spoke-fade 1s linear infinite;
      }
    `}</style>
    <div className="cg-spinner" role="progressbar" aria-label="Loading">
      {Array.from({ length: 12 }).map((_, i) => (
        <i
          key={i}
          style={{
            transform: `rotate(${i * 30}deg) translate(0, -170%)`,
            animationDelay: `${-(11 - i) / 12}s`,
          }}
        />
      ))}
    </div>
  </Box>
);
