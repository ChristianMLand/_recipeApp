import axios from 'axios';

const http = axios.create({
    // baseURL: "http://localhost:8000/api",// change this when in dev mode to be absolute path
    baseURL: '/api' 
});

http.defaults.withCredentials = true;

const serviceWrapper = func => {
    const inner = async (...args) => {
        let data, error;
        try {
            const res = await func(...args);
            data = res.data;
        } catch (err) {
            error = err.response.data?.errors ?? err.response.data;
        } finally {
            return { data, error };
        }
    }
    return inner;
}

//TODO update all services to instead use the useREST hook

export const getLoggedUser = serviceWrapper(
    async () => await http.get('/auth')
);

export const registerUser = serviceWrapper(
    async data => await http.post('/auth', data)
);

export const loginUser = serviceWrapper(
    async data => await http.post("/auth?login=true", data)
);

export const logoutUser = serviceWrapper(
    async () => await http.delete('/auth')
);

export const getRecipes = serviceWrapper(
    async (config={}) => await http.get("/recipes", config)
);

export const getCollections = serviceWrapper(
    async (config={}) => await http.get("/collections", config)
);

export const getCollection = serviceWrapper(
    async id => await http.get(`/collections/${id}`)
);

export const addCollection = serviceWrapper(
    async data => await http.post("/collections", data)
);

export const editCollection = serviceWrapper(
    async (id, data) => await http.patch("/collections/"+id, data)
)

export const deleteCollection = serviceWrapper(
    async id => await http.delete(`/collections/${id}`)
);

export const getRecipe = serviceWrapper(
    async id => await http.get(`/recipes/${id}`)
);
// for manually entering recipes
export const addRecipe = serviceWrapper(
    async data => await http.post("/recipes", data)
);

// for extracting a recipe from a webpage
export const extractRecipe = serviceWrapper(
    async data => await http.post("/recipes?extract=true", data)
);

export const updateRecipe = serviceWrapper(
    async (id, data) => await http.put(`/recipes/${id}`, data)
);

export const deleteRecipe = serviceWrapper(
    async id => await http.delete(`/recipes/${id}`)
);