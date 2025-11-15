import "./FileSelector.css";

interface FileSelectorProps {
  selectedFile: string;
  onFileSelect: (file: string) => void;
  onImport: () => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  selectedFile,
  onFileSelect,
  onImport,
}) => {
  return (
    <div className="file-selector">
      <div className="form-group">
        <label className="label">Select Data Source</label>
        <select
          className="select"
          value={selectedFile}
          onChange={(e) => onFileSelect(e.target.value)}
        >
          <option value="">Choose JSON File</option>
          <option value="boreholes.json">boreholes.json</option>
        </select>
      </div>

      {selectedFile && <div className="file-display">{selectedFile}</div>}

      <button
        className="import-button"
        onClick={onImport}
        disabled={!selectedFile}
      >
        Import
      </button>
    </div>
  );
};

export default FileSelector;
