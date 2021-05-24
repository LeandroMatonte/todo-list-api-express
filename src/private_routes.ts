/**
 * Pivate Routes are those API urls that require the user to be
 * logged in before they can be called from the front end.
 * 
 * Basically all HTTP requests to these endpoints must have an
 * Authorization header with the value "Bearer <token>"
 * being "<token>" a JWT token generated for the user using 
 * the POST /token endpoint
 * 
 * Please include in this file all your private URL endpoints.
 * 
 */

import { Router } from 'express';
import { safe } from './utils';
import * as actions from './actions';

// declare a new router to include all the endpoints
const router = Router();

router.get('/user', safe(actions.getUsers));

//Obtener la lista de todos de un usuario en especifico
router.get('/todos/user/:id', safe(actions.getTodo));

//agregar un todo nuevo a la lista de todos del usuario
router.post('/todos/user/:id', safe(actions.createTodo));

//actualiza un todo
router.put('/todos/user/:id', safe(actions.updateTodo));

//borrar usuario y sus todos
router.delete('/todos/user/:id', safe(actions.deleteUser));

export default router;
