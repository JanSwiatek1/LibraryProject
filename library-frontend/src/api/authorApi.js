import axios from 'axios';

const API_URL = 'https://localhost:7141/Author';

export const getAuthors = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addAuthor = async (name) => {
    const response = await axios.post(API_URL, { name });
    return response.data;
};


export const deleteAuthor = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const editAuthor = async (id, name) => {
    const response = await axios.put(`${API_URL}/${id}`, { name });
    return response.data;
};