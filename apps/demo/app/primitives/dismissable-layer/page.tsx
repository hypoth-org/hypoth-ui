"use client";

import { useEffect, useRef, useState } from "react";
import { createDismissableLayer, type DismissReason } from "@ds/primitives-dom";
import Link from "next/link";

export default function DismissableLayerDemoPage() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const nestedTriggerRef = useRef<HTMLButtonElement>(null);
  const nestedLayerRef = useRef<HTMLDivElement>(null);

  const [isLayerOpen, setIsLayerOpen] = useState(false);
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState<DismissReason | null>(null);

  const layerInstance = useRef<ReturnType<typeof createDismissableLayer> | null>(null);
  const nestedLayerInstance = useRef<ReturnType<typeof createDismissableLayer> | null>(null);

  useEffect(() => {
    if (!layerRef.current || !triggerRef.current) return;

    layerInstance.current = createDismissableLayer({
      container: layerRef.current,
      excludeElements: [triggerRef.current],
      onDismiss: (reason) => {
        setDismissReason(reason);
        setIsLayerOpen(false);
        setIsNestedOpen(false);
      },
    });

    return () => {
      layerInstance.current?.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!nestedLayerRef.current || !nestedTriggerRef.current) return;

    nestedLayerInstance.current = createDismissableLayer({
      container: nestedLayerRef.current,
      excludeElements: [nestedTriggerRef.current],
      onDismiss: (reason) => {
        setDismissReason(reason);
        setIsNestedOpen(false);
      },
    });

    return () => {
      nestedLayerInstance.current?.deactivate();
    };
  }, []);

  useEffect(() => {
    if (isLayerOpen) {
      layerInstance.current?.activate();
    } else {
      layerInstance.current?.deactivate();
    }
  }, [isLayerOpen]);

  useEffect(() => {
    if (isNestedOpen) {
      nestedLayerInstance.current?.activate();
    } else {
      nestedLayerInstance.current?.deactivate();
    }
  }, [isNestedOpen]);

  const handleTriggerClick = () => {
    setDismissReason(null);
    setIsLayerOpen(!isLayerOpen);
    if (isLayerOpen) {
      setIsNestedOpen(false);
    }
  };

  const handleNestedTriggerClick = () => {
    setDismissReason(null);
    setIsNestedOpen(!isNestedOpen);
  };

  return (
    <main className="container" style={{ paddingTop: "2rem" }}>
      <Link href="/primitives">← Back to Primitives</Link>

      <h1>Dismissable Layer</h1>
      <p className="text-muted">
        Press Escape or click outside to dismiss. Nested layers dismiss in LIFO order.
      </p>

      <div data-testid="dismissable-layer-demo" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <span
            data-testid="status-indicator"
            data-active={isLayerOpen}
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              backgroundColor: isLayerOpen ? "var(--ds-color-success-default, green)" : "var(--ds-color-neutral-default, gray)",
              color: "white",
              fontSize: "0.875rem",
            }}
          >
            {isLayerOpen ? "Layer Open" : "Layer Closed"}
          </span>
          {dismissReason && (
            <span
              data-testid="dismiss-reason"
              style={{
                display: "inline-block",
                marginLeft: "0.5rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                backgroundColor: "var(--ds-color-warning-default, orange)",
                color: "white",
                fontSize: "0.875rem",
              }}
            >
              Last dismiss: {dismissReason}
            </span>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            ref={triggerRef}
            data-testid="trigger-btn"
            onClick={handleTriggerClick}
          >
            {isLayerOpen ? "Close Layer" : "Open Layer"}
          </button>

          {isLayerOpen && (
            <div
              ref={layerRef}
              data-testid="layer-container"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "0.5rem",
                padding: "1rem",
                minWidth: "250px",
                backgroundColor: "white",
                border: "2px solid var(--ds-color-primary-default, blue)",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
              }}
            >
              <p style={{ margin: "0 0 1rem" }}>
                This is a dismissable layer.
              </p>
              <p className="text-muted" style={{ fontSize: "0.875rem", margin: "0 0 1rem" }}>
                Press Escape or click outside to close.
              </p>

              <div style={{ position: "relative" }}>
                <button
                  ref={nestedTriggerRef}
                  data-testid="nested-trigger"
                  onClick={handleNestedTriggerClick}
                >
                  {isNestedOpen ? "Close Nested" : "Open Nested Layer"}
                </button>

                {isNestedOpen && (
                  <div
                    ref={nestedLayerRef}
                    data-testid="nested-layer"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "0.5rem",
                      padding: "1rem",
                      minWidth: "200px",
                      backgroundColor: "white",
                      border: "2px solid var(--ds-color-secondary-default, purple)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 20,
                    }}
                  >
                    <p style={{ margin: 0 }}>Nested layer content</p>
                    <p className="text-muted" style={{ fontSize: "0.75rem", margin: "0.5rem 0 0" }}>
                      Escape closes this first (LIFO)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          data-testid="outside-area"
          style={{
            marginTop: "2rem",
            padding: "2rem",
            backgroundColor: "var(--ds-color-surface-default, #f0f0f0)",
            borderRadius: "0.5rem",
            textAlign: "center",
          }}
        >
          Click here to dismiss (outside area)
        </div>
      </div>
    </main>
  );
}
