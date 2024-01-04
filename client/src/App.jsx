import './App.css';
import { Routes, Route } from 'react-router-dom';
import { 
  LogReg, 
  Dashboard, 
  ViewRecipe, 
  AddRecipe, 
  EditRecipe, 
  FindRecipe, 
  Error, 
  AllCategories 
} from '~/views';
import { Layout, AuthContext } from '~/components';

function App() {
  return (
    <AuthContext>
      <Routes>
        <Route path="/" element={<LogReg />} />
        <Route element={<Layout />}>
          <Route path="/recipes" element={<Dashboard />} />
          <Route path="/recipes/add" element={<AddRecipe />} />
          <Route path="/recipes/search" element={<FindRecipe />} />
          <Route path="/recipes/:id" element={<ViewRecipe />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
          <Route path="/categories" element={<AllCategories />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </AuthContext>
  )
  
}

export default App
