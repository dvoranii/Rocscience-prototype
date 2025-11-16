import type { BoreholeData, TabType } from "../../types/borehole";
import FileSelector from "./components/FileSelector/FileSelector";
import MapView from "./components/MapView/MapView";
import BoreholeDetails from "../BoreholeDetails/BoreholeDetails";
import CrossSection from "../CrossSection/CrossSection";
import "./DataInput.css";

interface DataInputProps {
  selectedFile: string;
  onFileSelect: (file: string) => void;
  onImport: () => void;
  boreholeData: BoreholeData | null;
  onGenerateCrossSection: () => void;
  crossSectionGenerated: boolean;
  activeTab: TabType;
}

const DataInput: React.FC<DataInputProps> = ({
  selectedFile,
  onFileSelect,
  onImport,
  boreholeData,
  onGenerateCrossSection,
  crossSectionGenerated,
  activeTab,
}) => {
  const renderContent = () => {
    if (!boreholeData) {
      return <div className="map-placeholder">Import data to view content</div>;
    }

    switch (activeTab) {
      case "map":
        return (
          <MapView
            boreholes={boreholeData.boreholes}
            crossSectionLine={boreholeData.crossSection.line}
          />
        );
      case "boreholes":
        return <BoreholeDetails boreholes={boreholeData.boreholes} />;
      case "diagram":
        return <CrossSection boreholeData={boreholeData} />;
      default:
        return <MapView boreholes={boreholeData.boreholes} />;
    }
  };
  return (
    <div className="data-input">
      <div className="sidebar">
        <FileSelector
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onImport={onImport}
        />
        <button
          className="generate-button"
          onClick={onGenerateCrossSection}
          disabled={!boreholeData || crossSectionGenerated}
        >
          Generate Cross-Section
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default DataInput;
