export default function AboutPage() {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">Orzubek Tursunov</h2>
          <p className="text-gray-600 text-sm">Founder and CEO at FraiJob</p>
          <p className="text-sm text-gray-500 mt-1">Tashkent, Uzbekistan</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6 md:mt-0">
        <a href="#" className="text-blue-600">LinkedIn</a>
        <a href="#" className="text-blue-400">Twitter</a>
        <a href="#" className="text-gray-800">GitHub</a>
      </div>
    </div>
  );
}