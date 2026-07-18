import React from 'react';
import { Outlet } from 'react-router-dom';
import { MarketplaceSidebar } from './MarketplaceSidebar';
import { motion, AnimatePresence } from 'motion/react';

export const MarketplaceLayout: React.FC = () => {
  return (
    <div className="bg-[#F9FBFA] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 flex gap-12">
        <MarketplaceSidebar />
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
