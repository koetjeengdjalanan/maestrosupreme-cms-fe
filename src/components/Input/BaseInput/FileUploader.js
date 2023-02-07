import { useUploadImage } from '@/hooks/useUploadImage';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { useRef, useState } from 'react';

export function FileUploader(props) {
  const { isEdit, defaultValue, onUpload } = props;
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef(null);
  const { mutateAsync: upload } = useUploadImage();

  const onTemplateSelect = e => {
    const file = e.files[0];
    if (file) {
      try {
        upload(
          { file },
          {
            onSuccess: res => {
              onUpload(res);
              setImageUrl(res);
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    // setTotalSize(_totalSize);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    setImageUrl('');
  };

  const headerTemplate = options => {
    const { className, chooseButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : '0 B';

    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {/* {uploadButton} */}
        {/* {cancelButton} */}
        <ProgressBar
          value={value}
          displayValueTemplate={() => `${formatedValue} / 1 MB`}
          style={{ width: '300px', height: '20px', marginLeft: 'auto' }}
        ></ProgressBar>
      </div>
    );
  };

  const itemTemplate = url => {
    return (
      <div className="flex align-items-center flex-wrap h-full">
        <div className="relative flex align-items-center flex-column w-full gap-3">
          <div
            className="relative mx-auto"
            style={{
              minHeight: 400,
              width: '100%',
            }}
          >
            <img
              src={url}
              alt={'preview'}
              // role="presentation"
              style={{
                objectFit: 'contain',
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
              }}
            />
          </div>
          {/* <span className="flex flex-column text-left ml-3">{file.name}</span> */}
        </div>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        ></i>
        <span
          style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className:
      'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className:
      'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };

  if (!isEdit && imageUrl) {
    return itemTemplate(imageUrl);
  }

  return (
    <div>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        name="uploader"
        // url="https://primefaces.org/primereact/showcase/upload.php"
        accept="image/*"
        maxFileSize={1000000}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={() => itemTemplate(imageUrl)}
        emptyTemplate={props =>
          imageUrl ? itemTemplate(imageUrl) : emptyTemplate({ ...props })
        }
        chooseOptions={chooseOptions}
      />
    </div>
  );
}

export default FileUploader;
