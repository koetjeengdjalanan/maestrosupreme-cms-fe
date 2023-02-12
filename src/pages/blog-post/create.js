import React from 'react';
import CreateBlog from '../../components/Form/create-blog.form';
import { useCreateBlog } from '@/hooks/blog';

function CreatePost() {
    const { mutate } = useCreateBlog();
    const handleSubmit = data => {
        console.log(data);
    };

    return <CreateBlog onSubmit={handleSubmit} />;
}

export default CreatePost;
