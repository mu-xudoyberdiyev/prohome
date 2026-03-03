import { useDroppable } from "@dnd-kit/react";

export default function Voronka({ children, id }) {
  const { ref, isDropTarget } = useDroppable({
    id,
  });

  return (
    <ul
      className={`flex h-full flex-col gap-1 transition-colors duration-300 ${isDropTarget ? "bg-primary/5" : ""}`}
      ref={ref}
    >
      {children}
    </ul>
  );
}
