import { useRef, useEffect, useState } from "react";
import type { BoreholeData, Borehole, Layer } from "../../types/borehole";
import "./CrossSection.css";

interface CrossSectionProps {
  boreholeData: BoreholeData;
}

const CrossSection: React.FC<CrossSectionProps> = ({ boreholeData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<{
    boreholeId: string;
    layer: Layer;
  } | null>(null);

  // Canvas dimensions
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 500;
  const MARGIN = 60;
  const COLUMN_WIDTH = 40;

  const getMaxDepth = (): number => {
    return Math.max(
      ...boreholeData.boreholes.map((bh) =>
        Math.max(...bh.layers.map((l) => l.bottomDepth))
      )
    );
  };

  const getBoreholeX = (index: number): number => {
    const numBoreholes = boreholeData.crossSection.boreholeOrder.length;
    const spacing = (CANVAS_WIDTH - 2 * MARGIN) / (numBoreholes - 1);
    return MARGIN + index * spacing;
  };

  const getDepthY = (depth: number): number => {
    const maxDepth = getMaxDepth();
    const depthScale = (CANVAS_HEIGHT - 2 * MARGIN) / maxDepth;
    return MARGIN + depth * depthScale;
  };

  const drawBorehole = (
    ctx: CanvasRenderingContext2D,
    borehole: Borehole,
    x: number
  ) => {
    // Draw each layer
    borehole.layers.forEach((layer) => {
      const y = getDepthY(layer.topDepth);
      const height = getDepthY(layer.bottomDepth) - y;

      // Fill
      ctx.fillStyle = layer.color;
      ctx.fillRect(x - COLUMN_WIDTH / 2, y, COLUMN_WIDTH, height);

      // Border
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - COLUMN_WIDTH / 2, y, COLUMN_WIDTH, height);
    });

    // Label
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(borehole.id, x, MARGIN - 15);

    // Elevation label
    ctx.font = "12px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText(`${borehole.elevation}m`, x, MARGIN - 30);
  };

  const drawDepthScale = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);

    const maxDepth = getMaxDepth();
    for (let depth = 0; depth <= maxDepth; depth += 2) {
      const y = getDepthY(depth);
      ctx.beginPath();
      ctx.moveTo(MARGIN - 10, y);
      ctx.lineTo(CANVAS_WIDTH - MARGIN + 10, y);
      ctx.stroke();

      ctx.fillStyle = "#666";
      ctx.font = "12px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`${depth}m`, MARGIN - 15, y + 4);
    }

    ctx.setLineDash([]);
  };

  const drawCrossSection = (
    ctx: CanvasRenderingContext2D,
    data: BoreholeData
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const connectLayers = (
      ctx: CanvasRenderingContext2D,
      bh1: Borehole,
      bh2: Borehole,
      x1: number,
      x2: number
    ) => {
      bh1.layers.forEach((layer1) => {
        // Find matching layer in next borehole
        const layer2 = bh2.layers.find((l) => l.material === layer1.material);
        if (!layer2) return;

        // Calculate polygon points
        const y1Top = getDepthY(layer1.topDepth);
        const y1Bot = getDepthY(layer1.bottomDepth);
        const y2Top = getDepthY(layer2.topDepth);
        const y2Bot = getDepthY(layer2.bottomDepth);

        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(x1 + COLUMN_WIDTH / 2, y1Top);
        ctx.lineTo(x2 - COLUMN_WIDTH / 2, y2Top);
        ctx.lineTo(x2 - COLUMN_WIDTH / 2, y2Bot);
        ctx.lineTo(x1 + COLUMN_WIDTH / 2, y1Bot);
        ctx.closePath();

        // Fill with semi-transparent color
        ctx.fillStyle = layer1.color + "80"; // Add alpha
        ctx.fill();

        // Border
        ctx.strokeStyle = "#00000040";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const orderedBoreholes = data.crossSection.boreholeOrder
      .map((id) => data.boreholes.find((bh) => bh.id === id))
      .filter(Boolean) as Borehole[];

    // First, connect layers between boreholes
    for (let i = 0; i < orderedBoreholes.length - 1; i++) {
      const bh1 = orderedBoreholes[i];
      const bh2 = orderedBoreholes[i + 1];
      const x1 = getBoreholeX(i);
      const x2 = getBoreholeX(i + 1);

      connectLayers(ctx, bh1, bh2, x1, x2);
    }

    // Then draw boreholes on top
    orderedBoreholes.forEach((borehole, index) => {
      const x = getBoreholeX(index);
      drawBorehole(ctx, borehole, x);
    });

    // Draw depth scale
    drawDepthScale(ctx);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !boreholeData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawCrossSection(ctx, boreholeData);
  }, [boreholeData]);

  // Helper functions

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !boreholeData) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const orderedBoreholes = boreholeData.crossSection.boreholeOrder
      .map((id) => boreholeData.boreholes.find((bh) => bh.id === id))
      .filter(Boolean) as Borehole[];

    // Check each borehole's layers
    orderedBoreholes.forEach((borehole, index) => {
      const boreholeX = getBoreholeX(index);

      // Check if click is within borehole column
      if (
        x >= boreholeX - COLUMN_WIDTH / 2 &&
        x <= boreholeX + COLUMN_WIDTH / 2
      ) {
        borehole.layers.forEach((layer) => {
          const layerTop = getDepthY(layer.topDepth);
          const layerBottom = getDepthY(layer.bottomDepth);

          if (y >= layerTop && y <= layerBottom) {
            setSelectedLayer({ boreholeId: borehole.id, layer });
          }
        });
      }
    });
  };

  return (
    <div className="cross-section">
      <div className="cross-section-header">
        <h2>{boreholeData.crossSection.name}</h2>
        <div className="section-info">
          Showing {boreholeData.crossSection.boreholeOrder.length} boreholes
        </div>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="cross-section-canvas"
        />
      </div>

      {selectedLayer && (
        <div className="layer-details">
          <h3>Layer Details</h3>
          <div className="detail-item">
            <strong>Borehole:</strong> {selectedLayer.boreholeId}
          </div>
          <div className="detail-item">
            <strong>Material:</strong> {selectedLayer.layer.material}
          </div>
          <div className="detail-item">
            <strong>Depth:</strong> {selectedLayer.layer.topDepth}m -{" "}
            {selectedLayer.layer.bottomDepth}m
          </div>
          <div className="detail-item">
            <strong>Description:</strong> {selectedLayer.layer.description}
          </div>
          <button
            className="close-button"
            onClick={() => setSelectedLayer(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CrossSection;
