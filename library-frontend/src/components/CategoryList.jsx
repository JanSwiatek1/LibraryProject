import { useEffect, useState } from 'react';
import { getCategories, addCategory, deleteCategory, editCategory } from '../api/categoryApi';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newDescription, setNewDescription] = useState('');


    const fetchData = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleDeleteCategory = async (id) => {

        await deleteCategory(id);
        fetchData();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newName.trim() === '') return;

        if (editingId === null) {
            await addCategory(newName, newDescription);
        } else {
            await editCategory(editingId, newName, newDescription);
            setEditingId(null);
        }

        setNewName('');
        setNewDescription('');
        fetchData();
    };

    return (
        <div>
            <div>
                <h2>Categories</h2>
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>{category.name}, Description: {category.description}

                            <button onClick={() => { setEditingId(category.id); setNewName(category.name); setNewDescription(category.description) }}>Edit</button>
                            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
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
                    <button type="submit">{editingId === null ? 'Add Category' : 'Save Changes'}</button>
                </form>
            </div>

        </div>
    );
};

export default CategoryList;



