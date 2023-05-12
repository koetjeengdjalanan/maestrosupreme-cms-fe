import * as Yup from 'yup';

export const CreateBlogSchema = Yup.object().shape({
    user_id: Yup.string().uuid().required(),
    title: Yup.string()
        .required('Title is required')
        .min(5, 'Title is too short - should be 5 chars minimum'),
    slug: Yup.string().required(),
    tags: Yup.array(Yup.string()),
    excerpt: Yup.string().required('Excerpt is required'),
    body: Yup.string().required('Body is required'),
    category_id: Yup.string().required('Category is required'),
    published_date: Yup.number().nullable(),
    thumbnail: Yup.string().required('Thumbnail is required'),
});
export const UpdateBlogSchema = Yup.object().shape({
    id: Yup.string().uuid().required(),
    user_id: Yup.string().uuid().required(),
    title: Yup.string()
        .required('Title is required')
        .min(5, 'Title is too short - should be 5 chars minimum'),
    slug: Yup.string().required(),
    tags: Yup.array(Yup.string()),
    excerpt: Yup.string().required('Excerpt is required'),
    body: Yup.string().required('Body is required'),
    category_id: Yup.string().required('Category is required'),
    published_date: Yup.number().nullable(),
    thumbnail: Yup.string().required('Thumbnail is required'),
});
