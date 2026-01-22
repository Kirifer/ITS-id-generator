function StatCard({ icon, label, count }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-between min-h-[160px] min-w-[280px] lg:min-w-0 flex-shrink-0 lg:flex-shrink w-[280px] lg:w-auto">
      <div className="text-base sm:text-lg font-bold text-gray-800 text-left line-clamp-2">{label}</div>
      <div className="flex items-center justify-center flex-1 gap-4">
        <div className="text-purple-600">{icon}</div>
        <div className="text-4xl font-bold text-gray-800">{count}</div>
      </div>
    </div>
  );
}

export default StatCard;