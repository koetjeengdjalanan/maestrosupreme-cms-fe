import { BlogForm } from '@/components/Form';
import { useBlogBySlug, useEditBlog } from '@/hooks/blog';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

function CreatePost() {
    const toast = useRef();
    const router = useRouter();
    const { slug } = router.query;
    const { mutate } = useEditBlog();
    const { data, isLoading } = useBlogBySlug({ slug });
    if (!isLoading && !data) {
        router.push('/blog-post');
        return null;
    }
    const handleSubmit = data => {
        mutate(data);
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Congratulations, Post was updated!!!',
        });
        router.push('/blog-post');
    };

    // console.log(data);

    return (
        <>
            <BlogForm
                onSubmit={handleSubmit}
                defaultValues={data}
                isLoading={isLoading}
            />
            <Toast ref={toast} />
        </>
    );
}

export default CreatePost;
