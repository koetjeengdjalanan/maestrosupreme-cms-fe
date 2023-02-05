import { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { TreeSelect } from 'primereact/treeselect';
import { InputTextarea } from 'primereact/inputtextarea';
import iconOptions from '../../../../services/doc/icons';

export function OfferingInput() {
    const [isEdit, setIsEdit] = useState(false);
    const [withSubContent, setWithSubContent] = useState(false);
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
            <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
                <div className="col-12 md:col-10">
                    {isEdit ? <InputText className="w-full" /> : <p></p>}
                </div>
            </div>
            <div className="field grid align-items-start">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
                <div className="col-12 md:col-10">
                    {isEdit ? <InputTextarea rows={5} className="w-full" /> : <p></p>}
                </div>
            </div>
            <div className="field grid align-items-start">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Sub Content</label>

                <div className="col-12 md:col-10 align-items-start">
                    <div className="grid gap-4">
                        {withSubContent && (
                            <>
                                <div className="col-12 gap-4">
                                    {subContent?.content?.map((list) => (
                                        <div key={list?.id}>
                                            <TreeSelect
                                                value={list.icon}
                                                options={iconOptions}
                                                filter
                                                // optionLabel
                                                placeholder="Select icon"
                                                className="md:w-20rem w-full"
                                                onChange={(e) => {
                                                    const { value } = e;
                                                    const data = subContent.content.map(
                                                        (subList) => {
                                                            if (subList?.id === list?.id) {
                                                                return {
                                                                    ...subList,
                                                                    icon: value,
                                                                };
                                                            }
                                                            return subList;
                                                        }
                                                    );

                                                    if (!list?.icon) {
                                                        setSubContent((prev) => ({
                                                            ...prev,
                                                            content: [
                                                                ...data,
                                                                {
                                                                    id: list.id + 1,
                                                                },
                                                            ],
                                                        }));
                                                        return;
                                                    }

                                                    setSubContent((prev) => ({
                                                        ...prev,
                                                        content: [...data],
                                                    }));
                                                }}
                                            />
                                            <div className="flex w-full pt-2 gap-3 relative">
                                                <InputText
                                                    className="w-full"
                                                    placeholder="Title"
                                                    onChange={(e) => {
                                                        const { value } = e?.target;
                                                        const data = subContent.content.map(
                                                            (subList) => {
                                                                if (subList?.id === list?.id) {
                                                                    return {
                                                                        ...subList,
                                                                        title: value,
                                                                    };
                                                                }
                                                                return subList;
                                                            }
                                                        );

                                                        setSubContent((prev) => ({
                                                            ...prev,
                                                            content: [...data],
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            <div className="flex w-full pt-2 gap-3 relative">
                                                <InputText
                                                    className="w-full"
                                                    placeholder="Description"
                                                    onChange={(e) => {
                                                        const { value } = e?.target;
                                                        const data = subContent.content.map(
                                                            (subList) => {
                                                                if (subList?.id === list?.id) {
                                                                    return {
                                                                        ...subList,
                                                                        body: value,
                                                                    };
                                                                }
                                                                return subList;
                                                            }
                                                        );

                                                        setSubContent((prev) => ({
                                                            ...prev,
                                                            content: [...data],
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            {list?.body && (
                                                <div className="flex justify-content-end pt-2 w-full">
                                                    <Button
                                                        className="p-button-danger"
                                                        onClick={() =>
                                                            handleDeleteContent(list.id)
                                                        }>
                                                        <i className="pi pi-delete-left" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {isEdit && !withSubContent && (
                            <div className="col-12">
                                <Button
                                    onClick={() => {
                                        setWithSubContent(true);
                                        setSubContent((prev) => ({
                                            ...prev,
                                            content: [{ id: 1 }],
                                        }));
                                    }}>
                                    <i className="pi pi-plus" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="field grid">
                <div className="flex px-2 justify-content-end w-full">
                    {isEdit ? (
                        <Button onClick={() => setIsEdit(false)}>Submit</Button>
                    ) : (
                        <Button onClick={() => setIsEdit(true)}>Edit</Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OfferingInput;
