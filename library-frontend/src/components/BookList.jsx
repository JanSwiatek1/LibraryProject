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

    return (
        <div>
            <div>
                <h2>Books</h2>
                <ul>
                    {books.map(book => (
                        <li key={book.id}>{book.title} - {book.authorName} - {book.categoryName}


                            <button onClick={() => { setEditingId(book.id); setNewTitle(book.title); setNewAuthorId(book.authorId); setNewCategoryId(book.categoryId) }}>Edit</button>
                            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
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
                    <button type="submit">{editingId === null ? 'Add Book' : 'Save Changes'}</button>
                </form>
            </div>

        </div>
    );
};

export default BookList;



