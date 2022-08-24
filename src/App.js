import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Search from './components/Search';
import SearchResults from './components/SearchResults'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Search />
        <Switch>
          <Route path="/:search/:id">
            <SearchResults />
          </Route>
        </Switch>

      </BrowserRouter>
    </div >
  );
}

export default App;
