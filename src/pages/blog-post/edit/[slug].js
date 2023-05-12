import { BlogForm } from '@/components/Form';
import Loader from '@/components/Loader';
import { useBlogBySlug, useEditBlog } from '@/hooks/blog';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

function CreatePost() {
    const toast = useRef();
    const router = useRouter();
    const { slug } = router.query;
    const { mutateAsync } = useEditBlog();
    const { data, isLoading } = useBlogBySlug({ slug });
    if (!isLoading && !data) {
        router.push('/blog-post');
        return null;
    }
    const handleSubmit = async data => {
        try {
            await mutateAsync(data);
            await toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Congratulations, Post was updated!!!',
            });
            router.push('/blog-post');
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: err.response.data.message,
            });
        }
    };

    if (isLoading) {
        return <Loader />;
    }

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
