import { useRef } from 'react';
import { BlogForm } from '@/components/Form';
import { useCreateBlog } from '@/hooks/blog';
import { Toast } from 'primereact/toast';

function CreatePost() {
    const toast = useRef();
    const { mutate, isLoading } = useCreateBlog();

    const handleSubmit = data => {
        mutate(data);
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Congratulations, Post was created!!!',
        });
    };

    return (
        <>
            <BlogForm onSubmit={handleSubmit} />;
            <Toast ref={toast} />
        </>
    );
}

export default CreatePost;
