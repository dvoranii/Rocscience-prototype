import { useState } from "react";
import type { BoreholeData, TabType } from "./types/borehole";
import Navigation from "./components/Navigation/Navigation";
import DataInput from "./components/DataInput/DataInput";
import "./App.css";
import sampleData from "./data/boreholes.json";

function App() {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [boreholeData, setBoreholeData] = useState<BoreholeData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("map");
  const [isCrossSectionGenerated, setIsCrossSectionGenerated] = useState(false);

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    console.log("Importing:", selectedFile);

    setBoreholeData(sampleData as BoreholeData);
    setActiveTab("map");
  };

  const handleGenerateCrossSection = () => {
    setIsCrossSectionGenerated(true);
    setActiveTab("diagram");
  };

  return (
    <div className="app-container">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        boreholeDataLoaded={!!boreholeData}
        crossSectionGenerated={isCrossSectionGenerated}
      />
      <main className="main-content">
        <DataInput
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onImport={handleImport}
          boreholeData={boreholeData}
          onGenerateCrossSection={handleGenerateCrossSection}
          crossSectionGenerated={isCrossSectionGenerated}
          activeTab={activeTab}
        />
      </main>
    </div>
  );
}

export default App;
