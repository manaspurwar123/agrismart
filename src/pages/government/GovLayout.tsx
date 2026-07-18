import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovSidebar } from './GovSidebar';
import { motion, AnimatePresence } from 'motion/react';

export const GovLayout: React.FC = () => {
  return (
    <div className="bg-[#FDFCF8] min-h-screen pt-32">
      <div className="max-w-[1600px] mx-auto px-6 flex gap-12">
        <GovSidebar />
        <main className="flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="py-12"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
