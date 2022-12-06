import './App.css';
import Main from './components/Main';
import About from './components/About';
import Search from './components/Search';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <h1>Welcome to City Explorer</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route index element={<Main />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
