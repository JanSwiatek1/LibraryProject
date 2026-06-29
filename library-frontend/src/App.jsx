// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import AuthorList from './components/AuthorList';
import CategoryList from './components/CategoryList';
import BookList from './components/BookList';
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <div className="section-card">
        <AuthorList />
      </div>
      <div className="section-card">
        <CategoryList />
      </div>
      <div className="section-card">
        <BookList />
      </div>
    </div>
  );
}

export default App
