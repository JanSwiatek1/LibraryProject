import { useEffect, useState } from 'react';
import { getCategories, addCategory, deleteCategory, editCategory } from '../api/categoryApi';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [edits, setEdits] = useState({});


    const fetchData = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newName.trim() === '') return;
        await addCategory(newName, newDescription);
        setNewName('');
        setNewDescription('');
        fetchData();
    };

    const startEditing = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        setEdits(prev => ({
            ...prev,
            [categoryId]: { name: category.name, description: category.description }
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

    const saveCategories = async (id) => {
        const { name, description } = edits[id];
        if (name.trim() === '') return;
        await editCategory(id, name, description);
        cancelEditing(id);
        fetchData();
    };

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id);
        fetchData();
    };

    return (
        <div>
            <div>
                <h2>Categories</h2>
                <ul>
                    {categories.map(category => (
                        <li key={category.id} className="list-item">
                            {category.id in edits ? (
                                <div className="list-edit-row">
                                    <div className="list-main category-content">
                                        <input
                                            className="list-input"
                                            type="text"
                                            value={edits[category.id].name}
                                            onChange={(e) => updateField(category.id, 'name', e.target.value)}
                                        />
                                        <input
                                            className="category-input"
                                            type="text"
                                            value={edits[category.id].description}
                                            onChange={(e) => updateField(category.id, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="action-group">
                                        <button onClick={() => saveCategories(category.id)}>Save</button>
                                        <button onClick={() => cancelEditing(category.id)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="list-display">
                                    <div className="list-main category-content">
                                        <span className="category-name">{category.name}</span>
                                        <span className="category-description">{category.description}</span>
                                    </div>
                                    <div className="action-group">
                                        <button onClick={() => startEditing(category.id)}>Edit</button>
                                        <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter category name"
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Enter category description"
                    />
                    <button type="submit">Add Category</button>
                </form>
            </div>

        </div>
    );
};

export default CategoryList;



