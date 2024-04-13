import './AppV2.css';
import { Routes, Route } from 'react-router-dom';
import {
  Dashboard,
  NewRecipe,
  EditRecipe,
  ViewRecipe,
  SearchRecipe
} from '~/v2';
import { Error, LogReg } from './views';
import { AuthContext } from '~/components';

function App() {
  return (
    <AuthContext>
      <Routes>
        <Route path="/" element={<LogReg />} />
        <Route path="/recipes" element={<Dashboard />} />
        <Route path="/recipes/add" element={<NewRecipe />} />
        <Route path="/recipes/:id" element={<ViewRecipe />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        <Route path="/recipes/search" element={<SearchRecipe/>} />
        <Route path="*" element={<Error />} />
      </Routes>
    </AuthContext>
  )
}

export default App