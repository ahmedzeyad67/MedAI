import { Alert, Image, Upload } from "antd";
import {
  CloudUploadOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;

export default function XrayUploader({
  img,
  removeSelectedImage,
  handleBeforeUpload,
}) {
  return (
    <Dragger
      className={`xray-upload-zone ${img ? "has-file" : ""}`}
      beforeUpload={handleBeforeUpload}
      showUploadList={false}
      openFileDialogOnClick={false}
    >
      {!img ? (
        <div className="upload-zone-placeholder">
          <CloudUploadOutlined className="icon" />
          <p className="title">Drag and drop your X-ray here</p>
          <p className="subtitle">or click to browse files</p>
          <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
            <button type="btn">
              <PlusOutlined style={{ marginRight: 8, fontSize: "1rem" }} />{" "}
              Select File
            </button>
          </Upload>
          <div className="meta">
            <span className="file-type">JPG</span>
            <span className="file-type">PNG</span>
            <span className="file-type">DICOM</span>
            <span className="divider"></span>
            <span>Max 10MB</span>
          </div>
        </div>
      ) : (
        <>
          <Image src={img} alt="preview" />

          <button className="remove-btn" onClick={() => removeSelectedImage()}>
            <CloseOutlined />
          </button>
        </>
      )}
    </Dragger>
  );
}
