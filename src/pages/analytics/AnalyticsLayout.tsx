import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnalyticsSidebar } from '../../components/analytics/AnalyticsSidebar';
import { motion, AnimatePresence } from 'motion/react';

export const AnalyticsLayout: React.FC = () => {
  return (
    <div className="bg-[#F8F9FD] min-h-screen pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 flex gap-12">
        <AnalyticsSidebar />
        <main className="flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
