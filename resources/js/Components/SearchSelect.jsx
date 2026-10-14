import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * A dropdown you can type into to filter.
 * options: [{ value, label }]   value: the selected option's value
 */
export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function choose(option) {
    onChange(option.value);
    close();
  }

  // Close when clicking anywhere outside.
  useEffect(() => {
    function onDocMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // Keep the highlighted option visible while using the arrow keys.
  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.children[highlight];
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }
  }, [highlight, open]);

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && open) {
      // Pick the highlighted option instead of submitting the form.
      e.preventDefault();
      if (filtered[highlight]) choose(filtered[highlight]);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation();
      close();
    }
  }

  return (
    <div className="ss-wrap" ref={wrapRef}>
      <input
        type="text"
        autoComplete="off"
        className="ss-input"
        placeholder={selected ? selected.label : placeholder}
        value={open ? query : selected ? selected.label : ""}
        onFocus={() => {
          setOpen(true);
          setHighlight(0);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onKeyDown={handleKeyDown}
      />
      <span className="ss-caret" aria-hidden="true">▾</span>

      {open && (
        <ul className="ss-list" ref={listRef} onClick={(e) => e.preventDefault()}>
          {filtered.length === 0 && <li className="ss-empty">No matches</li>}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              className={
                "ss-option" +
                (i === highlight ? " ss-option-active" : "") +
                (String(o.value) === String(value) ? " ss-option-selected" : "")
              }
              onMouseEnter={() => setHighlight(i)}
              onClick={(e) => {
                e.preventDefault(); // stop the surrounding <label> from re-focusing the input
                choose(o);
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}