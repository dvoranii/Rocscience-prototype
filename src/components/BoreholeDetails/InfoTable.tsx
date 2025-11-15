import type { Borehole } from "../../types/borehole";
import "./InfoTable.css";

interface InfoTableProps {
  borehole: Borehole;
}

const InfoTable: React.FC<InfoTableProps> = ({ borehole }) => {
  const maxDepth = Math.max(
    ...borehole.layers.map((layer) => layer.bottomDepth)
  );

  const infoData = [
    { field: "ID", type: "string", value: borehole.id },
    { field: "Latitude", type: "number", value: borehole.lat.toFixed(6) },
    { field: "Longitude", type: "number", value: borehole.lng.toFixed(6) },
    { field: "Elevation", type: "number", value: `${borehole.elevation}m` },
    { field: "Total Depth", type: "number", value: `${maxDepth}m` },
    {
      field: "Number of Layers",
      type: "number",
      value: borehole.layers.length.toString(),
    },
  ];

  return (
    <div className="info-table">
      <div className="table-header">
        <div className="header-cell">Field</div>
        <div className="header-cell">Type</div>
        <div className="header-cell">Value</div>
      </div>

      <div className="table-body">
        {infoData.map((row, index) => (
          <div key={index} className="table-row">
            <div className="data-cell field-cell">{row.field}</div>
            <div className="data-cell type-cell">{row.type}</div>
            <div className="data-cell value-cell">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoTable;
