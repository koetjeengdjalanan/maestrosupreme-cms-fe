import { Formik } from 'formik';
import { Chips } from 'primereact/chips';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { ToggleButton } from 'primereact/togglebutton';
import React from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';

export function CreateBlog({ isOpen }) {
    const postTagsChip = item => {
        return (
            <div>
                <span>{item} - (active) </span>
                <i className="pi pi-user-plus" style={{ fontSize: '14px' }}></i>
            </div>
        );
    };
    // const postForm = useFormik({
    //     initialValues: {
    //         title: null,
    //         publishOnSubmit: false,
    //         tags: [],
    //     },
    // });

    return (
        <div className="card h-full w-full">
            <div className="flex justify-content-between">
                <h1
                    style={{
                        fontWeight: 'normal',
                        marginBottom: '1.25em',
                        textAlign: 'start',
                    }}
                >
                    Make New Post
                </h1>
                {/* <h2>
                                            {process.env.FE_URI}/
                                        </h2> */}
            </div>
            <Formik
                initialValues={{
                    title: '',
                    tags: [],
                    body: '',
                    category: '',
                }}
                onSubmit={e => {
                    console.log(e);
                }}
            >
                {({ values, setFieldValue, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-column flex-nowrap justify-content-start align-items-start gap-4">
                            <div className="flex gap-6 align-items-center w-full">
                                <div className="flex flex-grow-1">
                                    <span className="p-float-label w-full">
                                        <InputText
                                            id="title"
                                            name="title"
                                            className="p-inputtext-lg w-full h-full"
                                            value={values.title}
                                            onChange={e => {
                                                setFieldValue(
                                                    'title',
                                                    e.target.value
                                                );
                                            }}
                                        />
                                        <label htmlFor="title" className="mb-2">
                                            Title
                                        </label>
                                    </span>
                                </div>
                                <div className="flex flex-none">
                                    <ToggleButton
                                        onLabel="Publish"
                                        offLabel="Draft"
                                        id="publishOnSubmit"
                                        tooltip="Publish On Submit?"
                                        tooltipOptions={{
                                            position: 'left',
                                        }}
                                        // checked={
                                        //     postForm.values
                                        //         .publishOnSubmit
                                        // }
                                        // onChange={
                                        //     postForm.handleChange
                                        // }
                                    />
                                </div>
                            </div>
                            <div className="grid align-items-start w-full p-fluid">
                                <div className="col-8">
                                    <label htmlFor="postTags mb-2">Tags</label>
                                    <Chips
                                        id="postTags"
                                        value={values.tags}
                                        onChange={tags => {
                                            setFieldValue('tags', tags.value);
                                        }}
                                        separator=","
                                        itemTemplate={postTagsChip}
                                    />
                                </div>
                                <div className="col-4">
                                    <label htmlFor="postCategory">
                                        Category
                                    </label>
                                    <InputText
                                        id="postCategory"
                                        value={values.category}
                                        onChange={e =>
                                            setFieldValue(
                                                'category',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-column w-full gap-3">
                                <label>Body</label>
                                <Editor
                                    // value={text}
                                    onTextChange={e =>
                                        setFieldValue('body', e.htmlValue)
                                    }
                                    style={{ height: '320px' }}
                                />
                            </div>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default CreateBlog;
