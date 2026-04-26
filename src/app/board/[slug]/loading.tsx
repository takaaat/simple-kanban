export default function BoardLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-3 pl-5 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
        <span className="inline-block h-6 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="p-5 flex-1 min-h-0 flex gap-5 overflow-x-auto w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-100 h-full min-h-0 flex flex-col p-3 overflow-hidden bg-gray-50 border border-gray-200 rounded-lg shadow-2xs shrink-0"
            >
              <div className="flex justify-between flex-none mb-2">
                <div className="pb-1">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="mt-2 flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="mb-2">
                    <div className="bg-white w-full h-[46px] border border-gray-300 rounded-lg shadow-sm animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="w-full h-10 rounded-lg border border-neutral-300 mt-2 flex-none border-dashed animate-pulse bg-gray-100" />
            </div>
          ))}

          <div className="rounded-lg border border-gray-200 px-4 py-3 bg-gray-50 transition h-7 flex items-center justify-center shadow-2xs shrink-0 whitespace-nowrap opacity-50">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
