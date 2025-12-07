import { ClockIcon, LightBulbIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ICON_MAP = {
  congNghe: ChartBarIcon,
  kinhTe: ChartBarIcon,
  xaHoi: UserGroupIcon,
  chinhTri: LightBulbIcon,
  default: ClockIcon
};

const COLOR_MAP = {
  congNghe: 'from-blue-500 to-blue-600',
  kinhTe: 'from-green-500 to-green-600',
  xaHoi: 'from-purple-500 to-purple-600',
  chinhTri: 'from-red-500 to-red-600',
  default: 'from-gray-500 to-gray-600'
};

const LABEL_MAP = {
  congNghe: 'Công nghệ',
  kinhTe: 'Kinh tế',
  xaHoi: 'Xã hội',
  chinhTri: 'Chính trị',
  default: 'Khác'
};

function ProcessCards({ tienTrinhAnhHuong }) {
  if (!tienTrinhAnhHuong || tienTrinhAnhHuong.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        🔄 Tiến trình ảnh hưởng
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tienTrinhAnhHuong.map((tienTrinh, idx) => {
          const Icon = ICON_MAP[tienTrinh.loai] || ICON_MAP.default;
          const bgColor = COLOR_MAP[tienTrinh.loai] || COLOR_MAP.default;
          const label = LABEL_MAP[tienTrinh.loai] || LABEL_MAP.default;
          
          const mucDoColor = 
            tienTrinh.mucDo === 'cao' ? 'bg-red-100 text-red-800 border-red-300' :
            tienTrinh.mucDo === 'trung bình' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
            'bg-green-100 text-green-800 border-green-300';

          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${bgColor} rounded-xl shadow-lg p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl relative overflow-hidden`}
            >
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold bg-white bg-opacity-30 px-2 py-1 rounded">
                        {label}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${mucDoColor} bg-white bg-opacity-90`}>
                    {tienTrinh.mucDo?.toUpperCase() || 'N/A'}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xl font-bold mb-3 line-clamp-2">
                  {tienTrinh.ten}
                </h4>

                {/* Description */}
                <p className="text-white text-opacity-90 text-sm mb-4 line-clamp-3">
                  {tienTrinh.moTa}
                </p>

                {/* Time */}
                {tienTrinh.thoiGian && (
                  <div className="flex items-center space-x-2 mb-3 text-sm">
                    <ClockIcon className="w-4 h-4 text-white text-opacity-80" />
                    <span className="text-white text-opacity-90">{tienTrinh.thoiGian}</span>
                  </div>
                )}

                {/* Impact Details */}
                <div className="space-y-2 mt-4 pt-4 border-t border-white border-opacity-20">
                  {tienTrinh.anhHuongLLSX && (
                    <div className="text-xs">
                      <span className="font-semibold">LLSX: </span>
                      <span className="text-white text-opacity-90 line-clamp-2">
                        {tienTrinh.anhHuongLLSX}
                      </span>
                    </div>
                  )}
                  {tienTrinh.anhHuongQHSX && (
                    <div className="text-xs">
                      <span className="font-semibold">QHSX: </span>
                      <span className="text-white text-opacity-90 line-clamp-2">
                        {tienTrinh.anhHuongQHSX}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessCards;

