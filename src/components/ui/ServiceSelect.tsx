"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { ServiceOption } from "@/content/types";

import { Icon } from "./icons";

interface ServiceSelectProps {
  options: ServiceOption[];
  value: string;
  onChange: (label: string) => void;
  placeholder?: string;
}

/** The contact form's "Service or product of interest" control. */
export function ServiceSelect({
  options,
  value,
  onChange,
  placeholder = "Select a service or product",
}: ServiceSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  /** Opening always starts from the current selection. */
  const openList = () => {
    const selected = options.findIndex((option) => option.label === value);
    setActiveIndex(selected >= 0 ? selected : 0);
    setOpen(true);
  };

  const commit = (index: number) => {
    onChange(options[index].label);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative block w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-[10px] bg-raised px-[14px] text-left font-body text-sm text-faint outline-none transition-[border-color,box-shadow] duration-[160ms] ease-ndi"
        style={{
          border: `1px solid ${open ? "var(--accent)" : "var(--border-grid)"}`,
          boxShadow: open ? "var(--ring)" : "none",
        }}
      >
        <span
          className="overflow-hidden text-ellipsis whitespace-nowrap"
          // The unselected placeholder sits on the raised field fill, which is lighter than the page, so even the lifted faint token only reaches 4.02:1 there.
          style={{ color: value ? "var(--text-strong)" : "var(--text-muted)" }}
        >
          {value || placeholder}
        </span>
        <Icon
          name="chevronDown"
          size={14}
          strokeWidth={2}
          className="flex-none text-faint transition-transform duration-200 ease-ndi"
        />
      </button>

      <ul
        id={listboxId}
        ref={listRef}
        role="listbox"
        aria-label="Service or product of interest"
        tabIndex={-1}
        className="ndi-ddscroll absolute left-0 right-0 top-[calc(100%+8px)] z-[60] flex max-h-[272px] list-none flex-col gap-0.5 overflow-y-auto rounded-xl p-1.5 transition-[opacity,transform] duration-[180ms] ease-ndi"
        style={{
          overscrollBehavior: "contain",
          border: "1px solid rgba(90,201,148,0.22)",
          background: "#0F1522",
          boxShadow: "0 20px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
          transform: `translateY(${open ? "0" : "-6px"})`,
          transitionDelay: open ? "0s" : "0s, 0s",
        }}
      >
        {options.map((option, index) => {
          const selected = option.label === value;
          return (
            <li
              key={option.id}
              role="option"
              aria-selected={selected}
              onClick={() => commit(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex min-h-10 flex-none cursor-pointer items-center justify-between gap-2.5 rounded-lg px-3 py-[9px] font-body text-[13.5px] leading-[1.4] transition-[background,color] duration-[140ms] ease-ndi"
              style={{
                color: selected ? "var(--text-strong)" : "var(--text-muted)",
                background:
                  selected || activeIndex === index ? "rgba(90,201,148,0.10)" : "transparent",
              }}
            >
              <span>{option.label}</span>
              {/* The tick keeps its slot so rows never reflow on selection. */}
              <Icon
                name="check"
                size={14}
                strokeWidth={2.2}
                className={`flex-none text-accent ${selected ? "opacity-100" : "opacity-0"}`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
