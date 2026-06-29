import axios from 'axios';

const API_URL = 'https://localhost:7141/Book';

export const getBooks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addBook = async (title, authorId, categoryId) => {
    const response = await axios.post(API_URL, { title, authorId, categoryId });
    return response.data;
};


export const deleteBook = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const editBook = async (id, title, authorId, categoryId) => {
    const response = await axios.put(`${API_URL}/${id}`, { title, authorId, categoryId });
    return response.data;
};