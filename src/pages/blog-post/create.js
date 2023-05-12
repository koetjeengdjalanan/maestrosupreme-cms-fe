import { useRef } from 'react';
import { BlogForm } from '@/components/Form';
import { useCreateBlog } from '@/hooks/blog';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';

function CreatePost() {
    const router = useRouter();
    const toast = useRef();
    const { isLoading, mutateAsync } = useCreateBlog();

    const handleSubmit = async data => {
        try {
            await mutateAsync(data);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Congratulations, Post was created!!!',
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

    return (
        <>
            <BlogForm onSubmit={handleSubmit} isLoading={isLoading} />;
            <Toast ref={toast} />
        </>
    );
}

export default CreatePost;
