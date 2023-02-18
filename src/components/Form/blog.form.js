import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToggleButton } from 'primereact/togglebutton';

export function BlogForm({ onSubmit }) {
    const { data: session } = useSession();
    const postTagsChip = item => {
        return (
            <div>
                <span>{item} - (active) </span>
                <i className="pi pi-user-plus" style={{ fontSize: '14px' }}></i>
            </div>
        );
    };

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
                    user_id: session?.user?.id ?? '',
                    title: '',
                    tags: [],
                    body: '',
                    category: '',
                }}
                onSubmit={e => {
                    onSubmit(e);
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
                            <div className="grid align-items-start w-full p-fluid">
                                <div className="col-12">
                                    <label htmlFor="excerpt">Excerpt</label>
                                    <InputTextarea
                                        id="excerpt"
                                        value={values.category}
                                        onChange={e =>
                                            setFieldValue(
                                                'excerpt',
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
                                    style={{ minHeight: '320px' }}
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

export default BlogForm;
