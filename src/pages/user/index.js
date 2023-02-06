import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import Image from 'next/image';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

const ProfilePage = () => {
    const [dropdownItem, setDropdownItem] = useState(null);
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' },
    ];
    const onTemplateSelect = e => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach(key => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = e => {
        let _totalSize = 0;

        e.files.forEach(file => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = options => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
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
                {uploadButton}
                {cancelButton}
                <ProgressBar
                    value={value}
                    displayValueTemplate={() => `${formatedValue} / 1 MB`}
                    style={{
                        width: '300px',
                        height: '20px',
                        marginLeft: 'auto',
                    }}
                ></ProgressBar>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div
                    className="flex align-items-center"
                    style={{ width: '40%' }}
                >
                    <Image
                        alt={file.name}
                        role="presentation"
                        src={file.objectURL}
                        width={100}
                        height={50}
                    />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag
                    value={props.formatSize}
                    severity="warning"
                    className="px-3 py-2"
                />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
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
                    style={{
                        fontSize: '1.2em',
                        color: 'var(--text-color-secondary)',
                    }}
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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h1>Profile Page</h1>
                    <div className="p-fluid formgrid grid">
                        <div className="flex-row flex-grow-1">
                            <div className="field col-12 md:col-12">
                                <label htmlFor="firstname2">Firstname</label>
                                <InputText id="firstname2" type="text" />
                            </div>
                            <div className="field col-12 md:col-12">
                                <label htmlFor="lastname2">Lastname</label>
                                <InputText id="lastname2" type="text" />
                            </div>
                        </div>
                        <div className="flex-row flex-grow-1">
                            <Toast ref={toast}></Toast>
                            <Tooltip
                                target=".custom-choose-btn"
                                content="Choose"
                                position="bottom"
                            />
                            <Tooltip
                                target=".custom-upload-btn"
                                content="Upload"
                                position="bottom"
                            />
                            <Tooltip
                                target=".custom-cancel-btn"
                                content="Clear"
                                position="bottom"
                            />
                            <FileUpload
                                ref={fileUploadRef}
                                name="demo[]"
                                url="https://primefaces.org/primereact/showcase/upload.php"
                                multiple
                                accept="image/*"
                                maxFileSize={1000000}
                                onUpload={onTemplateUpload}
                                onSelect={onTemplateSelect}
                                onError={onTemplateClear}
                                onClear={onTemplateClear}
                                headerTemplate={headerTemplate}
                                itemTemplate={itemTemplate}
                                emptyTemplate={emptyTemplate}
                                chooseOptions={chooseOptions}
                                uploadOptions={uploadOptions}
                                cancelOptions={cancelOptions}
                            />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="address">Address</label>
                            <InputTextarea id="address" rows="4" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="city">City</label>
                            <InputText id="city" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">State</label>
                            <Dropdown
                                id="state"
                                value={dropdownItem}
                                onChange={e => setDropdownItem(e.value)}
                                options={dropdownItems}
                                optionLabel="name"
                                placeholder="Select One"
                            ></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
