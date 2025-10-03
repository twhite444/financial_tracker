import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageTransition, pageTransitionConfig } from '../../utils/animations';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransitionConfig}
      className={className}
    >
      {children}
    </motion.div>
  );
}
