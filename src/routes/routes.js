import { addUserHandler, getAllUsersHandler, getUserByIdHandler, updateUserHandler, deleteUserHandler, 
    addArticleHandler, getAllArticlesHandler, getArticleByIdHandler, updateArticleHandler, deleteArticleByIdHandler } 
from '../handler.js';

const routes = [
// User Routes
{
method: 'POST',
path: '/users',
handler: addUserHandler,
},
{
method: 'GET',
path: '/users',
handler: getAllUsersHandler,
},
{
method: 'GET',
path: '/users/{id}',
handler: getUserByIdHandler,
},
{
method: 'PUT',
path: '/users/{id}',
handler: updateUserHandler,
},
{
method: 'DELETE',
path: '/users/{id}',
handler: deleteUserHandler,
},

// Article Routes
{
method: 'POST',
path: '/articles',
handler: addArticleHandler,
},
{
method: 'GET',
path: '/articles',
handler: getAllArticlesHandler,
},
{
method: 'GET',
path: '/articles/{id}',
handler: getArticleByIdHandler,
},
{
method: 'PUT',
path: '/articles/{id}',
handler: updateArticleHandler,
},
{
method: 'DELETE',
path: '/articles/{id}',
handler: deleteArticleByIdHandler,
}
];

export default routes;
