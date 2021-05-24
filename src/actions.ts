import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { User } from './entities/User'
import { Exception } from './utils'
import { Todo } from './entities/Todo'

export const createUser = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.first_name) throw new Exception("Please provide a first_name")
    if (!req.body.last_name) throw new Exception("Please provide a last_name")
    if (!req.body.email) throw new Exception("Please provide an email")
    if (!req.body.password) throw new Exception("Please provide a password")

    const userRepo = getRepository(User)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { email: req.body.email } })
    if (user) throw new Exception("Users already exists with this email")

    //creo un nuevo todo de tipo Todo y se lo asigno a newUser
    const todoDefault = { label: "Ejemplo", done: false };
    const newtodo = getRepository(Todo).create(todoDefault);

    const newUser = getRepository(User).create({ ...req.body, todos: [newtodo] });  //Creo un usuario con el todoDefault

    const results = await getRepository(User).save(newUser); //Grabo el nuevo usuario

    return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(User).find({ relations: ["todos"] });
    return res.json(users);
}

export const getTodo = async (req: Request, res: Response): Promise<Response> => {
    const userRepo = getRepository(User);
    const userActual = await userRepo.findOne({ relations: ["todos"], where: { id: req.params.id } });
    if (!userActual) throw new Exception("User not found");
    return res.json(userActual.todos);
}

export const createTodo = async (req: Request, res: Response) => {
    const userRepo = getRepository(User);
    let user = await userRepo.findOne({ relations: ["todos"], where: { id: req.params.id } });

    //verificacion de existencia de usuario
    if (!user) throw new Exception("User not found");
    //verificar que no venga una tarea vacia
    if (!req.body.label) throw new Exception("You need to specify the label");
    if (req.body.done == undefined) throw new Exception("Specify if the todo is done or not");

    const newtodo = getRepository(Todo).create({ label: req.body.label, done: req.body.done });
    user.todos.push(newtodo);
    await userRepo.save(user);

    return res.json(user.todos);
}

export const updateTodo = async (req: Request, res: Response) => {
    const todoRepo = getRepository(Todo);

    //Verificar si el todo existe
    const todo = await todoRepo.findOne({ where: { id: req.params.id }});
    if (!todo) throw new Exception("Todo not found");

    //Verificar que no falte la propiedad "label" o "done"
    if(req.body.label == undefined || !req.body.label) throw new Exception("The new todo is missing label or done property");
    todo.label = req.body.label;
    todo.done = req.body.done;
    await todoRepo.save(todo);

    return res.json(todo);
}

export const deleteUser = async (req: Request, res: Response) => {
    let userRepo = getRepository(User);
    let userToRemove = await userRepo.findOne(req.params.id);

    if (!userToRemove) throw new Exception("User not found")
    await userRepo.remove(userToRemove);

    return res.json(userToRemove);
}