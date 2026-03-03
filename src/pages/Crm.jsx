import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import Lead from "../components/Lead";
import Voronka from "../components/Voronka";

const DATA = {
  Bir: [
    {
      id: 1,
      title: "Tarvuz hikoyasi",
      text: "Tarvuz juda ham sho'x edi",
      status: "Bir",
    },
    {
      id: 2,
      title: "Olma hikoyasi",
      text: "Olma juda ham sho'x edi",
      status: "Bir",
    },
    {
      id: 3,
      title: "Nok hikoyasi",
      text: "Nok juda ham sho'x edi",
      status: "Bir",
    },
  ],
  Ikki: [
    {
      id: 4,
      title: "Tarvuz hikoyasi",
      text: "Tarvuz juda ham sho'x edi",
      status: "Ikki",
    },
    {
      id: 5,
      title: "Olma hikoyasi",
      text: "Olma juda ham sho'x edi",
      status: "Ikki",
    },
    {
      id: 6,
      title: "Nok hikoyasi",
      text: "Nok juda ham sho'x edi",
      status: "Ikki",
    },
  ],
  Uch: [
    {
      id: 7,
      title: "Tarvuz hikoyasi",
      text: "Tarvuz juda ham sho'x edi",
      status: "Uch",
    },
    {
      id: 8,
      title: "Olma hikoyasi",
      text: "Olma juda ham sho'x edi",
      status: "Uch",
    },
    {
      id: 9,
      title: "Nok hikoyasi",
      text: "Nok juda ham sho'x edi",
      status: "Uch",
    },
  ],
};

function Overlay({ id }) {
  const data = Object.entries(DATA)
    .map(([key, value]) => {
      return value.find((el) => el.id === id);
    })
    .filter((el) => el)[0];

  return (
    <li
      className={`bg-background min-w-75 cursor-grab rounded border p-2 select-none`}
    >
      <h3 className="font-medium">{data.title}</h3>
      <p className="tetx-xs text-muted-foreground">{data.text}</p>
    </li>
  );
}

export default function Crm() {
  return (
    <section className="animate-fade-in bg-secondary h-full min-w-max">
      <DragDropProvider>
        <DragOverlay>{(source) => <Overlay id={source.id} />}</DragOverlay>
        <div className="flex h-full w-full gap-1 p-2">
          {Object.entries(DATA).map(([key, value]) => {
            return (
              <Voronka id={key} key={key}>
                {value
                  .filter((el) => el.status === key)
                  .map((el) => {
                    return <Lead data={el} key={el.id} />;
                  })}
              </Voronka>
            );
          })}
        </div>
      </DragDropProvider>
    </section>
  );
}
