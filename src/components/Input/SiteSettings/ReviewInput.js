import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TreeSelect } from 'primereact/treeselect';
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';

export function ReviewInput() {
    // const [isEdit, setIsEdit] = useState(false);
    const [subContent, setSubContent] = useState({});

    const handleDeleteContent = (id) => {
        const data = subContent?.content?.filter((v) => v.id !== id);
        setSubContent((prev) => ({
            ...prev,
            content: data,
        }));
    };

    return (
        <div className="p-3">
            <div className="grid">
                <div className="col-12 mb-2 md:col-6">
                    <div className="card"></div>
                </div>
                <div className="col-12 md:col-10">{/* <InputText className="w-full" /> */}</div>
            </div>
            <div className="flex">
                <div className="card">
                    <InputText className="mb-2 w-full" placeholder="Client Name" />
                    <InputText className="mb-2 w-full" placeholder="Client Job" />
                    <FileUpload
                        mode="basic"
                        name="avatar"
                        className="mb-2"
                        url="/api/upload"
                        accept="image/*"
                        maxFileSize={1000000}
                    />
                    <InputTextarea rows={5} className="mb-2 w-full" placeholder="Client Message" />
                    <div className="flex">
                        <Button>Add</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewInput;
