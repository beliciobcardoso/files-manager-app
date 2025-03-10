'use client';
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

export default function TemplateDemo() {
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateSelect = (e: { files: any; }) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: { files: any[]; }) => {
        let _totalSize = 0;

        e.files.forEach((file: { size: number; }) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    };

    const onTemplateRemove = (file: { size: number; }, callback: () => void) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: { className: any; chooseButton: any; uploadButton: any; cancelButton: any; }) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 1024 / 1024;
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
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 50 MB</span>
                    <ProgressBar
                        value={value}
                        showValue={false}
                        style={{ width: '10rem', height: '12px' }}
                        color={value > 50 ? 'red' : 'var(--primary-color)'}
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file: object, options: any) => {
        const fileObj = file as File;
        
        let url = '';

        switch (fileObj.type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/jpg':
            case 'image/gif':
            case 'image/svg+xml':
            case 'image/webp':
                url = URL.createObjectURL(fileObj);
                break;
            case 'application/pdf':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 15c0 .55-.45 1-1 1H9v2H7v-6h5c.55 0 1 .45 1 1v2zm-1-8V3.5L17.5 9H14c-.55 0-1-.45-1-1z"/><text x="7" y="14" fill="white" font-size="5">PDF</text></svg>';
                break;
            case 'text/plain':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23808080"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">TXT</text></svg>';
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232B579A"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">DOC</text></svg>';
                break;
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            case 'application/vnd.ms-powerpoint':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C43E1C"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">PPT</text></svg>';
                break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23217346"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">XLS</text></svg>';
                break;
            case 'text/markdown':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">MD</text></svg>';
                break;
            default:
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/svg+xml" viewBox="0 0 24 24" fill="gray"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>';
                break;
        }


        return (
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 w-9/12" >
                    <img
                        alt={fileObj.name}
                        role="presentation"
                        src={url}
                        width={100}
                    />
                    <span className="flex px-2 items-center w-full justify-between">
                        {fileObj.name}
                        <small className='text-lg'>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <div className='flex h-20 items-center gap-3'>
                    <Tag
                        value={options.formatSize}
                        severity="warning"
                        className="px-3 py-4"
                    />
                    <Button
                        type="button"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                        onClick={() => onTemplateRemove(fileObj, options.onRemove)}
                    />
                </div>
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex flex-col items-center justify-center">
                <i
                    className="pi pi-file mt-3 p-5"
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
                    Arraste e solte o arquvo aqui
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-file',
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
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload
                ref={fileUploadRef}
                name="demo[]"
                url="/api/upload"
                multiple={false}
                accept="image/*,application/pdf,.txt,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                maxFileSize={50_000_000} // 5_000_000 = 5MB
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
    );
}
