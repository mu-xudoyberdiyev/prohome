import { Button } from "@/components/ui/button";
import {
  DndContext, DragOverlay, defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext, horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import * as Icons from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import AddColumnModal from "../components/AddColumnModal";
import LeadDrawer, { clearDrawerUrl, getDrawerFromUrl, pushDrawerUrl } from "../components/LeadDrawer";
import MiniMapScroll from "../components/MiniMapScroll";
import SearchModal from "../components/SearchModal";
import Voronka from "../components/Voronka";
import { useCrm } from "../hooks/use-crm";

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.4" } },
  }),
};

const CardOverlay = memo(function CardOverlay({ lead }) {
  if (!lead) return null;
  return (
    <li className="bg-background w-[300px] cursor-grabbing rounded border p-2 shadow-xl select-none">
      <h3 className="font-medium text-sm">{lead.title}</h3>
      {lead.phone && <p className="text-muted-foreground text-xs">{lead.phone}</p>}
      {lead.budget != null && <p className="text-xs font-medium" style={{ color: '#10b981' }}>${lead.budget.toLocaleString()}</p>}
    </li>
  );
});

const ColumnOverlay = memo(function ColumnOverlay({ col }) {
  if (!col) return null;
  const Icon = Icons[col.icon] ?? Icons.Tag;
  return (
    <div
      className="bg-background flex w-[300px] cursor-grabbing items-center gap-2 rounded border-b-[6px] p-2 font-mono text-xs font-bold tracking-widest uppercase shadow-xl select-none"
      style={{ borderColor: col.color }}
    >
      <span>⠿</span>
      <Icon size={12} style={{ color: col.color }} />
      <span className="flex-1 truncate">{col.status}</span>
    </div>
  );
});

// Insert gap between columns — shows floating + button when insertMode active and hovered
function InsertGap({ onInsert, hidden }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex shrink-0 items-center justify-center self-stretch"
      style={{ width: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && !hidden && (
        <>
          <div
            className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 rounded-full"
            style={{ background: "var(--primary)", opacity: 0.35 }}
          />
          <button
            type="button"
            onClick={onInsert}
            className="absolute z-20 flex size-6 items-center justify-center rounded-full shadow-lg ring-2 ring-background transition-transform hover:scale-110"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", top: "10px" }}
            title="Column qo'shish"
          >
            <Icons.Plus size={13} />
          </button>
        </>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex h-full w-full gap-2 p-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border-muted bg-background h-40 w-[300px] animate-pulse rounded border-b-[6px]"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

export default function Crm() {
  const scrollRef = useRef(null);
  const [modal, setModal] = useState({ open: false, insertIdx: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [insertMode, setInsertMode] = useState(false);

  // Drawer state synced with URL
  const [drawer, setDrawer] = useState(() => getDrawerFromUrl());

  const {
    voronka, leads, colMeta, loading, error, sensors, collisionDetection,
    activeId, isCardDrag, isColDrag, activeLead, activeCol, colSortIds,
    activeCardStatus, highlightedLeadId,
    handleDragStart, handleDragOver, handleDragEnd, handleDragCancel,
    handleCollapseChange, handleColumnVisible, handleLoadMore,
    handleAddColumn, handleAddLead, handleHighlightLead,
  } = useCrm();

  // ── Keyboard shortcuts (keyCode for layout-agnostic) ──────────────────────
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const inInput = ["INPUT", "TEXTAREA"].includes(tag) ||
        document.activeElement?.contentEditable === "true";

      // Ctrl/Cmd+K — keyCode 75
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 75) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      // "/" — keyCode 191 — only outside inputs
      if (e.keyCode === 191 && !inInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Drawer URL sync ────────────────────────────────────────────────────────
  function openDrawerNew(status) {
    pushDrawerUrl(null, status);
    setDrawer({ open: true, leadId: null, status });
  }
  function openDrawerDetail(lead) {
    pushDrawerUrl(lead.id, "");
    setDrawer({ open: true, leadId: String(lead.id), status: "" });
  }
  function closeDrawer() {
    clearDrawerUrl();
    setDrawer({ open: false, leadId: null, status: "" });
  }

  // ── Search select: robust scroll + delayed highlight ──────────────────────
  function handleSearchSelect(lead) {
    // Expand column if collapsed
    const col = voronka.find((v) => v.status === lead.status);
    if (col?.collapsed) handleCollapseChange(col.id, false);
    // Trigger load if not yet loaded
    handleColumnVisible(lead.status);

    let attempts = 0;
    function tryScroll() {
      const el = document.getElementById(`lead-${lead.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        // Highlight AFTER scroll animation starts
        setTimeout(() => handleHighlightLead(lead.id), 450);
      } else if (attempts++ < 12) {
        setTimeout(tryScroll, 150);
      }
    }
    tryScroll();
  }

  function handleSearchOpenDetail(lead) {
    openDrawerDetail(lead);
  }

  // ── Column insert ──────────────────────────────────────────────────────────
  function openModal(idx) { setModal({ open: true, insertIdx: idx }); }
  async function handleAdd(formData) {
    await handleAddColumn(formData, modal.insertIdx);
    setModal((p) => ({ ...p, open: false }));
  }

  if (error) {
    return (
      <section className="bg-secondary flex h-full items-center justify-center gap-3">
        <Icons.AlertCircle className="text-destructive" size={18} />
        <p className="text-destructive text-sm">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-secondary flex h-full flex-col overflow-hidden">
      {/* ── Sticky toolbar ── */}
      <div className="bg-background/95 sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b px-3 py-2 backdrop-blur-sm">
        {/* Search */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setSearchOpen(true)}
        >
          <Icons.Search size={13} />
          Qidiruv
          <kbd className="text-muted-foreground ml-1 rounded border px-1 text-[10px]">⌘K</kbd>
        </Button>

        {/* Insert mode toggle */}
        <Button
          variant={insertMode ? "default" : "outline"}
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setInsertMode((p) => !p)}
          title="Column qo'shish rejimini yoqish/o'chirish"
        >
          <Icons.Columns2 size={13} />
          {insertMode ? "Tahrirlash rejimi" : "Column qo'shish"}
        </Button>

        <span className="text-muted-foreground ml-auto text-xs">
          {voronka.length} column · {leads.length} mijoz
        </span>
      </div>

      {/* ── Board ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="h-full">
          {loading ? (
            <Skeleton />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetection}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={colSortIds} strategy={horizontalListSortingStrategy}>
                <div className="flex h-full w-max items-stretch p-2">
                  {/* Insert gap at start */}
                  {insertMode && (
                    <InsertGap onInsert={() => openModal(0)} hidden={!!activeId} />
                  )}

                  {voronka.map((col, idx) => (
                    <div key={col.id} className="flex items-stretch">
                      <Voronka
                        voronkaData={col}
                        leads={leads.filter((l) => l.status === col.status)}
                        colMeta={colMeta}
                        isDraggingCard={isCardDrag}
                        activeCardStatus={activeCardStatus}
                        highlightedLeadId={highlightedLeadId}
                        onCollapseChange={handleCollapseChange}
                        onVisible={handleColumnVisible}
                        onLoadMore={handleLoadMore}
                        onAddLead={openDrawerNew}
                      />
                      {/* Insert gap after each column */}
                      {insertMode && (
                        <InsertGap onInsert={() => openModal(idx + 1)} hidden={!!activeId} />
                      )}
                    </div>
                  ))}

                  {/* Small trailing space */}
                  {!insertMode && <div style={{ width: 8 }} />}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={dropAnimation}>
                {isCardDrag && <CardOverlay lead={activeLead} />}
                {isColDrag && <ColumnOverlay col={activeCol} />}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      <MiniMapScroll voronka={voronka} scrollRef={scrollRef} />

      {/* Modals & Drawers */}
      <AddColumnModal
        open={modal.open}
        onClose={() => setModal((p) => ({ ...p, open: false }))}
        onAdd={handleAdd}
        insertLabel={
          modal.insertIdx === 0
            ? "Boshiga"
            : modal.insertIdx >= voronka.length
              ? "Oxiriga"
              : `${voronka[modal.insertIdx - 1]?.status} dan keyin`
        }
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        leads={leads}
        onSelectLead={handleSearchSelect}
        onOpenLead={handleSearchOpenDetail}
      />

      <LeadDrawer
        open={drawer.open}
        leadId={drawer.leadId}
        initialStatus={drawer.status}
        leads={leads}
        voronka={voronka}
        onClose={closeDrawer}
        onAddLead={handleAddLead}
      />
    </section>
  );
}
