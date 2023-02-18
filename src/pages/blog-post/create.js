import { BlogForm } from '@/components/Form';
import { useCreateBlog } from '@/hooks/blog';

function CreatePost() {
    const { mutate } = useCreateBlog();
    const handleSubmit = data => {
        console.log(data);
    };

    return <BlogForm onSubmit={handleSubmit} />;
}

export default CreatePost;
