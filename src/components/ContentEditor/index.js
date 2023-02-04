// src/Tiptap.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TextContentEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World!</p>',
    });

    return (
        <div>
            <EditorContent editor={editor} />
        </div>
    );
};

export default TextContentEditor;
