import { useDraggable } from "@dnd-kit/react";

export default function Lead({ data }) {
  const { ref, isDragging } = useDraggable({ id: data.id });

  return (
    <li
      className={`bg-background min-w-75 cursor-grab rounded border p-2 transition-opacity select-none ${isDragging ? "opacity-40" : ""}`}
      key={data.id}
      ref={ref}
    >
      <h3 className="font-medium">{data.title}</h3>
      <p className="tetx-xs text-muted-foreground">{data.text}</p>
    </li>
  );
}
