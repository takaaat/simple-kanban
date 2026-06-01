export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col bg-blue-600"></div>
      <div className="container mx-auto pt-5">
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse my-3"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 w-64 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
