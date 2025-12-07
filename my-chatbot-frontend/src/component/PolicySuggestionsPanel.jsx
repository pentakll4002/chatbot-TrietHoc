function PolicySuggestionsPanel({ suggestions, analysisData }) {
  if (!suggestions) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600">Đang tải gợi ý chính sách...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Policy Solutions */}
      {suggestions.giaiPhap && suggestions.giaiPhap.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-2xl font-bold text-green-600 mb-6">
            💡 Giải pháp đề xuất
          </h3>
          <div className="space-y-6">
            {suggestions.giaiPhap.map((giaiPhap, idx) => (
              <div
                key={idx}
                className="border-2 border-green-200 rounded-2xl p-6 bg-green-50 hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-800">
                    {idx + 1}. {giaiPhap.ten}
                  </h4>
                </div>
                <p className="text-gray-700 mb-4">{giaiPhap.moTa}</p>

                {giaiPhap.buocThucHien && giaiPhap.buocThucHien.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      📋 Các bước thực hiện:
                    </h5>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                      {giaiPhap.buocThucHien.map((buoc, buocIdx) => (
                        <li key={buocIdx}>{buoc}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {giaiPhap.khoKhan && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h5 className="font-semibold text-yellow-800 mb-1">
                      ⚠️ Khó khăn dự kiến:
                    </h5>
                    <p className="text-yellow-700 text-sm">{giaiPhap.khoKhan}</p>
                  </div>
                )}

                {giaiPhap.ketQuaMongDoi && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <h5 className="font-semibold text-blue-800 mb-1">
                      🎯 Kết quả mong đợi:
                    </h5>
                    <p className="text-blue-700 text-sm">{giaiPhap.ketQuaMongDoi}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QHSX Models */}
      {suggestions.moHinhQHSX && suggestions.moHinhQHSX.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-2xl font-bold text-purple-600 mb-6">
            🏗️ Mô hình QHSX đề xuất
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.moHinhQHSX.map((moHinh, idx) => (
              <div
                key={idx}
                className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50 hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {moHinh.ten}
                </h4>
                <p className="text-gray-700 mb-4">{moHinh.moTa}</p>

                {moHinh.uuDiem && moHinh.uuDiem.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-green-700 mb-2">
                      ✅ Ưu điểm:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      {moHinh.uuDiem.map((uuDiem, uuDiemIdx) => (
                        <li key={uuDiemIdx}>{uuDiem}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {moHinh.hanChe && moHinh.hanChe.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-red-700 mb-2">
                      ⚠️ Hạn chế:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      {moHinh.hanChe.map((hanChe, hanCheIdx) => (
                        <li key={hanCheIdx}>{hanChe}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
        <h3 className="text-xl font-bold mb-3">📝 Tóm tắt</h3>
        <p className="text-blue-50">
          Dựa trên phân tích mâu thuẫn giữa LLSX và QHSX trong lĩnh vực, các giải pháp và mô hình trên 
          được đề xuất nhằm giải quyết các điểm nghẽn và thúc đẩy phát triển bền vững. 
          Việc áp dụng cần được điều chỉnh phù hợp với bối cảnh và điều kiện cụ thể của Việt Nam.
        </p>
      </div>
    </div>
  );
}

export default PolicySuggestionsPanel;

