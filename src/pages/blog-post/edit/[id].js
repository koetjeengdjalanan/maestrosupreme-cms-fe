import { BlogForm } from '@/components/Form';
import { useCreateBlog } from '@/hooks/blog';
import { useRouter } from 'next/router';

function CreatePost() {
    const router = useRouter();
    const { id: postId } = router.query;
    const { mutate } = useCreateBlog();
    if (postId) {
        router.push('/blog-post');
        return null;
    }
    const handleSubmit = data => {
        console.log(data);
    };

    return <BlogForm onSubmit={handleSubmit} />;
}

export default CreatePost;
