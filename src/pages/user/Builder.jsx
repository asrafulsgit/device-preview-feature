
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { library } from "../../components/library/Library";
import { v4 as uuidv4 } from "uuid";

const deviceSizes = {
  mobile: "w-[375px] h-full",
  tablet: "w-[768px] h-full",
  desktop: "w-full h-full",
};

export default function BuilderPreview() {
  const [canvas, setCanvas] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [dragItem, setDragItem] = useState(null);
  const [search, setSearch] = useState("");
  const [device, setDevice] = useState("desktop");
  const [mode, setMode] = useState("builder");  

  const iframeRef = useRef(null);

  useEffect(() => {
    const handleIframeReady = (event) => {
      if (event.data?.type === "IFRAME_READY" && iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          { type: "UPDATE_CANVAS", value: canvas },
          "*"
        );
      }
    };

    window.addEventListener("message", handleIframeReady);
    return () => window.removeEventListener("message", handleIframeReady);
  }, [canvas]);

  // Also update iframe whenever canvas changes in preview mode
  useEffect(() => {
    if (mode !== "preview") return;
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_CANVAS", value: canvas },
        "*"
      );
    }
  }, [canvas, mode]);

  // DELETE COMPONENT
  const deleteComponent = useCallback((id) => {
    setCanvas((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // MOVE COMPONENT
  const moveComponent = useCallback((id, direction) => {
    setCanvas((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const arr = [...prev];
      const [moved] = arr.splice(index, 1);
      arr.splice(newIndex, 0, moved);
      return arr;
    });
  }, []);

  // DROP COMPONENT (DISABLED IN PREVIEW MODE)
  const handleDrop = (e) => {
    if (mode === "preview") return;

    e.preventDefault();
    if (!dragItem) return;

    const exists = canvas.find((c) => c.componentId === dragItem.id);
    if (exists) return;

    setCanvas((prev) => [...prev, { id: uuidv4(), componentId: dragItem.id }]);
    setDragItem(null);
  };

  // FILTER COMPONENTS
  const filtered = useMemo(
    () =>
      library.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className="flex gap-2 h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-3/7 border overflow-y-auto">
        <div className="sticky top-0 p-3 z-20 bg-white border-b">
          <h2 className="font-bold text-lg">Components</h2>
          <input
            type="text"
            placeholder="Search..."
            className="w-full mt-3 mb-3 border-2 border-yellow-500 outline-none rounded px-2 py-3 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="p-2">
          {filtered.map((c) => (
            <div
              key={c.id}
              draggable={mode === "builder"}
              onDragStart={() => {
                if (mode === "builder") setDragItem(c);
              }}
              className={`border mb-2 rounded ${
                mode === "builder"
                  ? "cursor-pointer hover:bg-gray-100"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <div className="pointer-events-none">
                <c.component />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="flex-1 border bg-gray-50 overflow-hidden"
        onDragOver={mode === "builder" ? (e) => e.preventDefault() : undefined}
        onDrop={handleDrop}
      >
        {/* TOP BAR */}
        <div className="sticky top-0 z-20 bg-white flex justify-between items-center p-3 border-b">
          <h2 className="font-bold text-lg">
            {mode === "builder" ? "Builder Mode" : "Preview Mode"}
          </h2>

          <div className="flex items-center gap-4">
            {/* SWITCH MODE */}
            <button
              onClick={() => setMode("builder")}
              className={`px-3 py-1 rounded ${
                mode === "builder" ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              🧰 Builder
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`px-3 py-1 rounded ${
                mode === "preview" ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              👀 Preview
            </button>

            {/* DEVICE SWITCH */}
            {mode === "preview" && 
              <>
                <button onClick={() => setDevice("mobile")}>📱</button>
                <button onClick={() => setDevice("tablet")}>📲</button>
                <button onClick={() => setDevice("desktop")}>🖥️</button>
              </>
            }

            <input
              type="text"
              placeholder="Project name"
              className="px-2 py-1 border-2 border-yellow-500 rounded-lg"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <button
              disabled={canvas.length === 0}
              className={`bg-yellow-500 px-3 py-1.5 rounded-lg ${
                canvas.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Save Project
            </button>
          </div>
        </div>

        {/* BUILDER MODE */}
        {mode === "builder" && (
          <div className="p-4 overflow-y-auto h-full">
            {canvas.length === 0 && (
              <div className="text-gray-400 text-center mt-20">
                Start dragging components...
              </div>
            )}

            {canvas.map((c) => {
              const Comp = library.find((x) => x.id === c.componentId)?.component;
              return (
                <div
                  key={c.id}
                  className="relative group border border-transparent hover:border-yellow-400 transition"
                >
                  {/* ACTION BUTTONS */}
                  <div className="absolute right-2 top-2 z-10 hidden group-hover:flex gap-2">
                    <button
                      onClick={() => deleteComponent(c.id)}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => moveComponent(c.id, "up")}
                      className="bg-gray-500 text-white text-xs px-2 py-1 rounded"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveComponent(c.id, "down")}
                      className="bg-gray-500 text-white text-xs px-2 py-1 rounded"
                    >
                      ↓
                    </button>
                  </div>

                  <Comp />
                </div>
              );
            })}
          </div>
        )}

        {/* PREVIEW MODE */}
        {mode === "preview" && (
          <div className="flex justify-center items-start p-5 overflow-auto h-full">
            <div
              className={`bg-white border shadow-xl overflow-hidden ${deviceSizes[device]}`}
            >
              <iframe
                ref={iframeRef}
                src="/preview"
                className="w-full h-full border-none"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
