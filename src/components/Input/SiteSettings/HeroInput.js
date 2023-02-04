import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';

export function HeroInput() {
    const [isEdit, setIsEdit] = useState(false);
    return (
        <div className="p-3">
            <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
                <div className="col-12 md:col-10">
                    {isEdit ? <InputText className="w-full" readOnly /> : <p></p>}
                </div>
            </div>
            <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
                <div className="col-12 md:col-10">
                    {isEdit ? <InputTextarea rows={5} className="w-full" readOnly /> : <p></p>}
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

export default HeroInput;
