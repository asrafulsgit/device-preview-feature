import { useEffect, useState } from "react";
import { library } from "../../components/library/Library";

export default function DevicePreview() {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    // Notify parent that iframe is ready
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");

    const handler = (event) => {
      if (event.data?.type === "UPDATE_CANVAS") {
        setComponents(event.data.value);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {components.length === 0 ? (
        <div className="text-gray-400 text-center mt-10">
          Waiting for builder...
        </div>
      ) : (
        components.map((item) => {
          const Comp = library.find((c) => c.id === item.componentId)?.component;
          if (!Comp) return null;

          return (
            <div key={item.id} className="w-full">
              <Comp />
            </div>
          );
        })
      )}
    </div>
  );
}
