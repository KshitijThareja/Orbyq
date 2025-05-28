import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'; // Control the size of the loader
  text?: string; // Optional loading text
  className?: string; // Additional classes for customization
}

const Loader = ({ size = 'md', text = 'Loading...', className = '' }: LoaderProps) => {
  // Define size variants
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  // Animation for the spinning effect
  const spinAnimation = {
    rotate: [0, 360],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  };

  // Animation for the pulsing gradient
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="relative">
        {/* Outer spinning ring */}
        <motion.div
          className={`rounded-full border-t-transparent border-primary/50 ${sizeClasses[size]}`}
          animate={spinAnimation}
        />
        {/* Inner pulsing gradient circle */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ${sizeClasses[size]}`}
          animate={pulseAnimation}
        />
      </div>
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
};

export default Loader;