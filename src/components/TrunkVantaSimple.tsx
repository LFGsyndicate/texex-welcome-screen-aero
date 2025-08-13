import React from 'react';

type Props = {
  children: React.ReactNode;
};

const TrunkVantaSimple: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full" style={{ minHeight: '100vh' }}>
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          background: 'linear-gradient(135deg, #0D19A3 0%, #080F5B 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      />
      <div className="relative z-10">{children}</div>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default TrunkVantaSimple;