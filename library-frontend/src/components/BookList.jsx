import { useEffect, useState } from 'react';
import { getBooks, addBook, deleteBook, editBook } from '../api/bookApi';
import { getAuthors } from '../api/authorApi';
import { getCategories } from '../api/categoryApi';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newAuthorId, setNewAuthorId] = useState('');
    const [newCategoryId, setNewCategoryId] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    const [edits, setEdits] = useState({});



    const fetchData = async () => {
        const data = await getBooks();
        const authorsData = await getAuthors();
        const categoriesData = await getCategories();
        setAuthors(authorsData);
        setCategories(categoriesData);
        setBooks(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleDeleteBook = async (id) => {

        await deleteBook(id);
        fetchData();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newTitle.trim() === '') return;

        if (editingId === null) {
            await addBook(newTitle, newAuthorId, newCategoryId);
        } else {
            await editBook(editingId, newTitle, newAuthorId, newCategoryId);
            setEditingId(null);
        }

        setNewTitle('');
        setNewAuthorId('');
        setNewCategoryId('');
        fetchData();
    };

    const startEditing = (bookId) => {
        const book = books.find(b => b.id === bookId);
        setEdits(prev => ({
            ...prev,
            [bookId]: { title: book.title, authorId: book.authorId, categoryId: book.categoryId }
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

    const saveBook = async (id) => {
        const { title, authorId, categoryId } = edits[id];
        if (title.trim() === '') return;
        await editBook(id, title, authorId, categoryId);
        cancelEditing(id);
        fetchData();
    };

    return (
        <div>
            <div>
                <h2>Books</h2>
                <ul>
                    {books.map(book => (
                        <li key={book.id} className="list-item">
                            {book.id in edits ? (
                                <div className="list-edit-row">
                                    <div className="list-main book-content">
                                        <input
                                            className="list-input"
                                            type="text"
                                            value={edits[book.id].title}
                                            onChange={(e) => updateField(book.id, 'title', e.target.value)}
                                        />
                                        <select
                                            value={edits[book.id].authorId}
                                            onChange={(e) => updateField(book.id, 'authorId', e.target.value)}
                                        >
                                            {authors.map(author => (
                                                <option key={author.id} value={author.id}>
                                                    {author.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={edits[book.id].categoryId}
                                            onChange={(e) => updateField(book.id, 'categoryId', e.target.value)}
                                        >
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="action-group">
                                        <button onClick={() => saveBook(book.id)}>Save</button>
                                        <button onClick={() => cancelEditing(book.id)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="list-display">
                                    <div className="list-main book-content">

                                        <span className="item-name">{book.title}</span>
                                        <span className="book-meta">{book.authorName} • {book.categoryName}</span>
                                    </div>
                                    <div className="action-group">
                                        <button onClick={() => startEditing(book.id)}>Edit</button>
                                        <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                                    </div>

                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Add Book</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter book title"
                    />
                    <select
                        onChange={(e) => setNewAuthorId(e.target.value)}>
                        {authors.map(author => (
                            <option key={author.id} value={author.id}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => setNewCategoryId(e.target.value)}>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Add Book</button>
                </form>
            </div>

        </div>
    );
};

export default BookList;



