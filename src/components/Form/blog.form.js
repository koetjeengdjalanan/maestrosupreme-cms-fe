import { getErrors } from '@/utils/get-error';
import {
    CreateBlogSchema,
    UpdateBlogSchema,
} from '@/utils/schema-form-validation';
import clsx from 'clsx';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { ToggleButton } from 'primereact/togglebutton';
import { useMemo } from 'react';
import { FileUploader, TextInput, Textarea } from '../Input/BaseInput';
import { useCategories } from '@/hooks/category';

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

    const initialValues = useMemo(() => {
        if (defaultValues) {
            return {
                id: defaultValues?.id ?? '',
                title: defaultValues?.title ?? '',
                slug: defaultValues?.slug ?? '',
                excerpt: defaultValues?.excerpt ?? '',
                body: defaultValues?.body ?? '',
                category_id: defaultValues?.category?.id ?? '',
                published_date:
                    Math.floor(defaultValues?.published_at / 1000) ?? null,
                thumbnail: defaultValues?.thumbnail[0] ?? '',
            };
        }
        return {
            title: '',
            slug: '',
            excerpt: '',
            body: '',
            category_id: '',
            published_date: null,
            thumbnail: '',
        };
    }, [defaultValues]);

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
            </div>
            {!isLoading && (
                <Formik
                    initialValues={{
                        tags: tags,
                        user_id: session?.user?.id ?? '',
                        ...initialValues,
                    }}
                    validationSchema={
                        defaultValues ? UpdateBlogSchema : CreateBlogSchema
                    }
                    onSubmit={onSubmit}
                >
                    {({
                        values,
                        setFieldValue,
                        handleSubmit,
                        errors,
                        touched,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-column flex-nowrap justify-content-start align-items-start gap-4">
                                <div className="flex gap-6 align-items-start w-full">
                                    <TextInput
                                        id="Title"
                                        name="title"
                                        className="flex-grow-1"
                                        label="Title"
                                        errors={errors}
                                        value={values.title}
                                        touched={touched}
                                        onChange={e => {
                                            setFieldValue(
                                                'title',
                                                e.target.value
                                            );

                                            // set slug values
                                            const slug = e.target.value
                                                .toLowerCase()
                                                .replace(/^-+/, '')
                                                .replace(/-+$/, '')
                                                .replace(/\s+/g, '-')
                                                .replace(/\-\-+/g, '-')
                                                .replace(/[^\w\-]+/g, '');
                                            setFieldValue('slug', slug);
                                        }}
                                    />

                                    <div
                                        className="flex flex-none "
                                        style={{
                                            marginTop: 27,
                                        }}
                                    >
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
                                                        ? Math.floor(
                                                              Date.now() / 1000
                                                          )
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
                                        {getErrors(
                                            touched,
                                            errors,
                                            'thumbnail'
                                        ) && (
                                            <small
                                                id={`tags-help`}
                                                className="text-red-300"
                                            >
                                                {errors['thumbnail']}
                                            </small>
                                        )}
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <div className="flex flex-column flex-nowrap w-full gap-4 p-fluid">
                                            <TextInput
                                                name="slug"
                                                className="flex-grow-1"
                                                label="Slug"
                                                value={values.slug}
                                                disabled
                                            />
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
                                                    className={clsx(
                                                        getErrors(
                                                            touched,
                                                            errors,
                                                            'tags'
                                                        ) && 'p-invalid'
                                                    )}
                                                />
                                                {getErrors(
                                                    touched,
                                                    errors,
                                                    'tags'
                                                ) && (
                                                    <small
                                                        id={`tags-help`}
                                                        className="text-red-300"
                                                    >
                                                        {errors['tags']}
                                                    </small>
                                                )}
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
                                                    className={clsx(
                                                        getErrors(
                                                            touched,
                                                            errors,
                                                            'category_id'
                                                        ) && 'p-invalid',
                                                        'w-full'
                                                    )}
                                                />
                                                {getErrors(
                                                    touched,
                                                    errors,
                                                    'category_id'
                                                ) && (
                                                    <small
                                                        id={`tags-help`}
                                                        className="text-red-300"
                                                    >
                                                        {errors['category_id']}
                                                    </small>
                                                )}
                                            </div>
                                            <Textarea
                                                name="excerpt"
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
                                                id="Title"
                                                className="flex-grow-1"
                                                label="Excerpt"
                                                errors={errors}
                                                touched={touched}
                                            />
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
                                    {getErrors(touched, errors, 'body') && (
                                        <small
                                            id={`tags-help`}
                                            className="text-red-300"
                                        >
                                            {errors['body']}
                                        </small>
                                    )}
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
