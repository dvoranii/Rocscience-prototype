import { useState } from "react";
import type { Borehole, InfoTabType } from "../../types/borehole";
import InfoTable from "./components/InfoTable/InfoTable";
import LayersTable from "./components/LayersTable/LayersTable";
import "./BoreholeDetails.css";

interface BoreholeDetailsProps {
  boreholes: Borehole[];
}

const BoreholeDetails: React.FC<BoreholeDetailsProps> = ({ boreholes }) => {
  const [selectedBorehole, setSelectedBorehole] = useState<Borehole | null>(
    boreholes[0] || null
  );
  const [infoTab, setInfoTab] = useState<InfoTabType>("info");

  return (
    <div className="borehole-details">
      <div className="borehole-sidebar">
        <h3>Boreholes</h3>
        <div className="borehole-list">
          {boreholes.map((borehole) => (
            <button
              key={borehole.id}
              className={`borehole-item ${
                selectedBorehole?.id === borehole.id ? "active" : ""
              }`}
              onClick={() => setSelectedBorehole(borehole)}
            >
              {borehole.id}
            </button>
          ))}
        </div>
      </div>

      <div className="borehole-content">
        {selectedBorehole ? (
          <>
            <div className="content-header">
              <h2>Borehole {selectedBorehole.id}</h2>
              <div className="tab-buttons">
                <button
                  className={`tab-button ${infoTab === "info" ? "active" : ""}`}
                  onClick={() => setInfoTab("info")}
                >
                  Info
                </button>
                <button
                  className={`tab-button ${
                    infoTab === "layers" ? "active" : ""
                  }`}
                  onClick={() => setInfoTab("layers")}
                >
                  Layers
                </button>
              </div>
            </div>

            {infoTab === "info" ? (
              <InfoTable borehole={selectedBorehole} />
            ) : (
              <LayersTable borehole={selectedBorehole} />
            )}
          </>
        ) : (
          <div className="no-selection">Select a borehole to view details</div>
        )}
      </div>
    </div>
  );
};

export default BoreholeDetails;
