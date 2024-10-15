// cover.tsx
import React from 'react';
import './cover.styles.tsx';
import { coverContainerStyles, titleStyles, subtitleStyles, rightContainerStyles } from './cover.styles';
import { InputField } from '../input-field';

const Cover: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
        <div style={coverContainerStyles}>
        <h1 style={titleStyles}>MARKT</h1>
        <p style={subtitleStyles}>Your Campus.<br />Your Marketplace.</p>
        </div>

        <div style={rightContainerStyles}>
        {/* Right Container Content */}
        <h2>Welcome Back to UofT's Secure Marketplace!</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputField type="email" placeholder="UofT Email Address" />
          <InputField type="password" placeholder="Password" />
          <button type="submit" style={{ marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
    
  );
};

export { Cover };