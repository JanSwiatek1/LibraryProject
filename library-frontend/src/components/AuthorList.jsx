import { useEffect, useState } from 'react';
import { getAuthors, addAuthor, deleteAuthor, editAuthor } from '../api/authorApi';

const AuthorList = () => {
    const [authors, setAuthors] = useState([]);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);


    const fetchData = async () => {
        const data = await getAuthors();
        setAuthors(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleDeleteAuthor = async (id) => {
        // await fetch(`https://localhost:7141/Author/${id}`, {
        //     method: 'DELETE',
        // });
        await deleteAuthor(id);
        fetchData();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newName.trim() === '') return;

        if (editingId === null) {
            await addAuthor(newName);
        } else {
            await editAuthor(editingId, newName);
            setEditingId(null);
        }

        setNewName('');
        fetchData();
    };

    return (
        <div>
            <div>
                <h2>Authors</h2>
                <ul>
                    {authors.map(author => (
                        <li key={author.id}>{author.name}

                            <button onClick={() => { setEditingId(author.id); setNewName(author.name) }}>Edit</button>
                            <button onClick={() => handleDeleteAuthor(author.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Add Author</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter author name"
                    />
                    <button type="submit">{editingId === null ? 'Add Author' : 'Save Changes'}</button>
                </form>
            </div>

        </div>
    );
};

export default AuthorList;



