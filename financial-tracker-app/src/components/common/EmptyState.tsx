import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { fadeIn, scaleIn } from '../../utils/animations';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  illustration?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center ${className}`}
    >
      {/* Illustration or Icon */}
      {illustration ? (
        <motion.div variants={scaleIn} className="mb-6">
          {illustration}
        </motion.div>
      ) : (
        <motion.div
          variants={scaleIn}
          className="mb-6 p-6 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
        >
          <Icon className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500 dark:text-blue-400" />
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        variants={fadeIn}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={fadeIn}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md"
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.button
          variants={fadeIn}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="btn-primary inline-flex items-center gap-2"
        >
          {action.icon && <action.icon className="h-5 w-5" />}
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
