import type { Borehole } from "../../types/borehole";
import "./LayersTable.css";

interface LayersTableProps {
  borehole: Borehole;
}

const LayersTable: React.FC<LayersTableProps> = ({ borehole }) => {
  return (
    <div className="layers-table">
      <div className="table-header">
        <div className="header-cell">Layer #</div>
        <div className="header-cell">Material</div>
        <div className="header-cell">Top Depth (m)</div>
        <div className="header-cell">Bottom Depth (m)</div>
        <div className="header-cell">Thickness (m)</div>
        <div className="header-cell">Description</div>
      </div>

      <div className="table-body">
        {borehole.layers.map((layer) => (
          <div key={layer.id} className="table-row">
            <div className="data-cell layer-number">{layer.id}</div>
            <div className="data-cell material-cell">
              <span
                className="color-swatch"
                style={{ backgroundColor: layer.color }}
              ></span>
              {layer.material}
            </div>
            <div className="data-cell depth-cell">{layer.topDepth}</div>
            <div className="data-cell depth-cell">{layer.bottomDepth}</div>
            <div className="data-cell depth-cell">
              {(layer.bottomDepth - layer.topDepth).toFixed(1)}
            </div>
            <div className="data-cell description-cell">
              {layer.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayersTable;
