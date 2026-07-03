import { useEffect, useState } from 'react';
import { getAuthors, addAuthor, deleteAuthor, editAuthor } from '../api/authorApi';

const AuthorList = () => {
    const [authors, setAuthors] = useState([]);
    const [newName, setNewName] = useState('');
    const [edits, setEdits] = useState({});

    const fetchData = async () => {
        const data = await getAuthors();
        setAuthors(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newName.trim() === '') return;
        await addAuthor(newName);
        setNewName('');
        fetchData();
    };


    const startEditing = (author) => {
        setEdits(prev => ({
            ...prev,
            [author.id]: { name: author.name, isActive: author.isActive }
        }));
    };


    const updateField = (id, field, value) => {
        setEdits(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };


    const cancelEditing = (id) => {
        setEdits(prev => {
            const { [id]: _, ...rest } = prev;
            return rest;
        });
    };


    const saveAuthor = async (id) => {
        const { name, isActive } = edits[id];
        if (name.trim() === '') return;
        await editAuthor(id, name, isActive);
        cancelEditing(id);
        fetchData();
    };

    const handleDeleteAuthor = async (id) => {
        await deleteAuthor(id);
        fetchData();
    };

    return (
        <div>
            <div>
                <h2>Authors</h2>
                <ul>
                    {authors.map(author => (
                        <li key={author.id} className="list-item">
                            {author.id in edits ? (
                                <div className="list-edit-row">
                                    <input
                                        className="list-input"
                                        type="text"
                                        value={edits[author.id].name}
                                        onChange={(e) => updateField(author.id, 'name', e.target.value)}
                                    />
                                    <label className="author-checkbox-row">
                                        <input
                                            type="checkbox"
                                            checked={edits[author.id].isActive}
                                            onChange={(e) => updateField(author.id, 'isActive', e.target.checked)}
                                        />
                                        <span>Active</span>
                                    </label>
                                    <div className="action-group">
                                        <button onClick={() => saveAuthor(author.id)}>Save</button>
                                        <button onClick={() => cancelEditing(author.id)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="list-display">
                                    <div className="list-main">
                                        <span className="item-name">{author.name}</span>
                                        <span className={`author-status ${author.isActive ? 'active' : 'inactive'}`}>
                                            {author.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="action-group">
                                        <button onClick={() => startEditing(author)}>Edit</button>
                                        <button onClick={() => handleDeleteAuthor(author.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
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
                    <button type="submit">Add Author</button>
                </form>
            </div>
        </div>
    );
};

export default AuthorList;