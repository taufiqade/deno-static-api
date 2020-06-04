import { 
  Router,
  Context,
  Status,
  RouterContext
} from "https://deno.land/x/oak/mod.ts";

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
}

let users: User[] = [
  {
    id: 1,
    name: "taufiq",
    phone: "0811212212",
    email: "taufiq@test.com"
  },
  {
    id: 2,
    name: "adesurya",
    phone: "0811212212",
    email: "taufiq@test.com"
  }
]

const getUsers = async (ctx: RouterContext) => {
  ctx.response.status = 200
  ctx.response.body = users
}

const findUser = async (ctx: RouterContext) => {
  const user: User | undefined = users.find(u => u.id === Number(ctx.params.id))
  if(!user) {
    ctx.throw(404, "User Not Found");
  }
  ctx.response.status = 200
  ctx.response.body = user
}

const createUser = async (ctx: RouterContext) => {
  console.log("post user");

  if (!ctx.request.hasBody) {
    ctx.throw(Status.BadRequest, "Bad Request");
  }

  const body = await ctx.request.body();
  let user: User = body.value;
  if(user) {
    user.id = Math.floor(Math.random() * 10)
    users.push(user)
    ctx.response.status = Status.OK;
    ctx.response.body = users;
    ctx.response.type = "json";
    return;
  }
  ctx.throw(Status.BadRequest, "Bad Request");
}

const putUser = async (ctx: RouterContext) => {
  console.log("put user");
  const body = await ctx.request.body()
  
  if (!ctx.request.hasBody) {
    ctx.throw(Status.BadRequest, "Bad Request");
  }

  const user: User | undefined = users.find(u => u.id === Number(ctx.params.id))
  if (!user) {
    ctx.throw(404, "User not found");
  }

  const updateData: {name?:string, phone?:string, email?: string} = body.value
  users = users.map(u => u.id === user.id ? { ...u, ...updateData } : u)
  ctx.response.status = 200
  ctx.response.body = users
  return
}

const deleteUser = async (ctx: RouterContext) => {
  const user: User[] | undefined = users.filter(u => u.id !== Number(ctx.params.id))
  
  if (!user) {
    ctx.throw(404, "User not found");
  }
  
  ctx.response.status = 200
  ctx.response.body = user
  return
}

export {
  getUsers,
  findUser,
  createUser,
  putUser,
  deleteUser,
}