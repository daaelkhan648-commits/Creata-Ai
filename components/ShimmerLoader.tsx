// components/ShimmerLoader.tsx
import { motion } from 'framer-motion';

const CARD_HEIGHTS = [72, 200, 96, 80];
const LABELS = ['Hook', 'Script', 'Caption', 'Hashtags'];

export default function ShimmerLoader() {
  return (
    <div className="space-y-4">
      {/* Generating label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 glass rounded-2xl border border-border"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-accent-cyan"
            />
          ))}
        </div>
        <span className="text-sm text-text-muted">AI is crafting your viral content...</span>
      </motion.div>

      {/* Shimmer cards */}
      {CARD_HEIGHTS.map((h, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-3xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
            <div className="shimmer w-8 h-8 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <div className="shimmer h-3 w-16 rounded-lg" />
              <div className="shimmer h-2.5 w-28 rounded-lg" />
            </div>
          </div>
          {/* Body */}
          <div className="px-5 py-4 space-y-2.5" style={{ minHeight: h }}>
            <div className="shimmer h-3 w-full rounded-lg" />
            <div className="shimmer h-3 w-5/6 rounded-lg" />
            {h > 100 && (
              <>
                <div className="shimmer h-3 w-full rounded-lg" />
                <div className="shimmer h-3 w-4/5 rounded-lg" />
                <div className="shimmer h-3 w-full rounded-lg" />
                <div className="shimmer h-3 w-3/4 rounded-lg" />
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
