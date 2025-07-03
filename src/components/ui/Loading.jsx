import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface rounded-lg p-6 shadow-card"
            >
              <div className="shimmer h-4 bg-gray-200 rounded mb-3"></div>
              <div className="shimmer h-8 bg-gray-200 rounded w-3/4"></div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-lg p-6 shadow-card">
            <div className="shimmer h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="shimmer h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="shimmer h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-card">
            <div className="shimmer h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="shimmer h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="shimmer h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="shimmer h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="shimmer h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-surface rounded-lg shadow-card">
        <div className="p-6">
          <div className="shimmer h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="shimmer h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="shimmer h-4 bg-gray-200 rounded"></div>
                  <div className="shimmer h-4 bg-gray-200 rounded"></div>
                  <div className="shimmer h-4 bg-gray-200 rounded"></div>
                  <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default Loading;