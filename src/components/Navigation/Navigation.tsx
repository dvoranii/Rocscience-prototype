import type { TabType } from "../../types/borehole";
import "./Navigation.css";

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  boreholeDataLoaded: boolean;
  crossSectionGenerated: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  boreholeDataLoaded,
  crossSectionGenerated,
}) => {
  return (
    <nav className="navigation">
      <button
        className={`tab ${activeTab === "map" ? "tab-active" : ""}`}
        onClick={() => onTabChange("map")}
        disabled={!boreholeDataLoaded}
      >
        Map
      </button>
      <button
        className={`tab ${activeTab === "boreholes" ? "tab-active" : ""}`}
        onClick={() => onTabChange("boreholes")}
        disabled={!boreholeDataLoaded}
      >
        Boreholes
      </button>
      <button
        className={`tab ${activeTab === "diagram" ? "tab-active" : ""}`}
        onClick={() => onTabChange("diagram")}
        disabled={!crossSectionGenerated}
      >
        Diagram
      </button>
    </nav>
  );
};

export default Navigation;
