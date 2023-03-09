import { useMemo } from 'react';
import { useCategories } from '@/hooks/blog';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToggleButton } from 'primereact/togglebutton';
import { isValidDate } from '@/utils';
import { FileUploader } from '../Input/BaseInput';

export function BlogForm({ onSubmit, defaultValues, isLoading }) {
    const { data: session } = useSession();
    const { data: categories } = useCategories({});

    const categoryOptions = useMemo(
        () =>
            categories?.data && Array.isArray(categories.data)
                ? categories.data.map(v => ({
                      name: v.title,
                      value: v.id,
                  }))
                : [],
        [categories?.data]
    );

    const tags = useMemo(
        () =>
            defaultValues?.tags &&
            Array.isArray(defaultValues.tags) &&
            defaultValues.tags.length > 0
                ? defaultValues.tags.map(tag => tag?.title)
                : [],
        [defaultValues?.tags]
    );

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
                    {defaultValues ? 'Update Post' : 'Make New Post'}
                </h1>
                {/* <h2>
                                            {process.env.FE_URI}/
                                        </h2> */}
            </div>
            {!isLoading && (
                <Formik
                    initialValues={{
                        id: defaultValues?.id ?? '',
                        user_id: session?.user?.id ?? '',
                        title: defaultValues?.title ?? '',
                        slug: defaultValues?.slug ?? '',
                        tags: tags,
                        excerpt: defaultValues?.excerpt ?? '',
                        body: defaultValues?.body ?? '',
                        category_id: defaultValues?.category?.id ?? '',
                        published_date: defaultValues?.published_date ?? null,
                        thumbnail: defaultValues?.thumbnail[0] ?? '',
                    }}
                    onSubmit={onSubmit}
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
                                            <label
                                                htmlFor="title"
                                                className="mb-2"
                                            >
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
                                            checked={!!values.published_date}
                                            onChange={() => {
                                                setFieldValue(
                                                    'published_date',
                                                    !Number(
                                                        values.published_date
                                                    )
                                                        ? Date.now()
                                                        : null
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid w-full">
                                    <div className="col-12 md:col-6">
                                        <FileUploader
                                            isEdit
                                            defaultValue={values.thumbnail}
                                            onUpload={value => {
                                                setFieldValue(
                                                    'thumbnail',
                                                    value
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <div className="flex flex-column flex-nowrap w-full gap-4 p-fluid">
                                            <div className="flex flex-grow-1">
                                                <div className="w-full">
                                                    <label
                                                        htmlFor="slug"
                                                        className="mb-2"
                                                    >
                                                        Slug
                                                    </label>
                                                    <InputText
                                                        id="slug"
                                                        name="slug"
                                                        className="p-inputtext-lg w-full"
                                                        value={values.slug}
                                                        onChange={e => {
                                                            const slug =
                                                                e.target.value
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        /^-+/,
                                                                        ''
                                                                    )
                                                                    .replace(
                                                                        /-+$/,
                                                                        ''
                                                                    )
                                                                    .replace(
                                                                        /\s+/g,
                                                                        '-'
                                                                    )
                                                                    .replace(
                                                                        /\-\-+/g,
                                                                        '-'
                                                                    )
                                                                    .replace(
                                                                        /[^\w\-]+/g,
                                                                        ''
                                                                    );
                                                            setFieldValue(
                                                                'slug',
                                                                slug
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <label htmlFor="postTags mb-2">
                                                    Tags
                                                </label>
                                                <Chips
                                                    id="postTags"
                                                    value={values.tags}
                                                    onChange={tags => {
                                                        setFieldValue(
                                                            'tags',
                                                            tags.value
                                                        );
                                                    }}
                                                    separator=","
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label htmlFor="postCategory">
                                                    Category
                                                </label>
                                                <Dropdown
                                                    value={values.category_id}
                                                    onChange={e =>
                                                        setFieldValue(
                                                            'category_id',
                                                            e.value
                                                        )
                                                    }
                                                    id="postCategory"
                                                    options={categoryOptions}
                                                    optionLabel="name"
                                                    placeholder="Select category"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label htmlFor="excerpt">
                                                    Excerpt
                                                </label>
                                                <InputTextarea
                                                    id="excerpt"
                                                    value={values.excerpt}
                                                    onChange={e =>
                                                        setFieldValue(
                                                            'excerpt',
                                                            e.target.value
                                                        )
                                                    }
                                                    autoResize
                                                    rows={5}
                                                    cols={30}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-column w-full gap-3">
                                    <label>Body</label>
                                    <Editor
                                        value={values.body}
                                        onTextChange={e =>
                                            setFieldValue('body', e.htmlValue)
                                        }
                                        style={{
                                            minHeight: '320px',
                                            height: '100%',
                                            // height: '320px',
                                        }}
                                    />
                                </div>
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    )}
                </Formik>
            )}
        </div>
    );
}

export default BlogForm;
