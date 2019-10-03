import { Upload, Button, Icon } from "antd";
import React from "react";

class ImageUploader extends React.Component<any, any> {
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  render() {
    const props = {
      fileList: this.props.fileList,
      beforeUpload: file => {
        this.props.onChangeFileList({ file });
        this.getBase64(file, imageUrl =>
          this.props.handleBeforeUpload({ imageUrl: imageUrl })
        );
        return false;
      }
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" />
            Upload
          </Button>
        </Upload>
      </div>
    );
  }
}

export default ImageUploader;
