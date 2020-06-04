import { Router } from "https://deno.land/x/oak/mod.ts";
import { 
  getUsers, 
  findUser,
  createUser,
  putUser,
  deleteUser,
} from "./controller/user.ts"

const router = new Router()

router.get('/users', getUsers)
  .get('/users/:id', findUser)
  .post('/users', createUser)
  .put('/users/:id', putUser)
  .delete('/users/:id', deleteUser)

export default router