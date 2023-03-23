import { Router } from "express";
import { pagination } from "../../middleware/pagination";
import { CreateUserDto, UpdateUserDto, UsersDto} from "./dto";
import { UserService } from "./services";

// 라우터와 app 등록할 경로 지정을 위한 class
class UserController {
  router;
  path = "/users";
  userService

  constructor() {
    this.router = Router();
    this.init();
    this.userService = new UserService
  }

  init() {
    // 
    this.router.get("/",pagination ,this.getUsers.bind(this));
    this.router.get("/:id", this.getUser.bind(this));
    this.router.post("/", this.createUser.bind(this));
    this.router.patch("/:id", this.updateUser.bind(this));
    this.router.delete("/:id", this.deleteUser.bind(this));
  }
  // reqeust(요청) -> application middleware -> router middleware -> apl 순서로 진행된다.
  //
  async getUsers(req, res, next) {
    try{
      const {users, count} = await this.userService.findUsers({skip: req.skip, take:req.take})

      res.status(200).json({users: users.map((user)=> new UsersDto(user)), count})
    }catch(err){
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const id = req.params;
      const user = await this.userService.finduserById(id)

      res.status(200).json({user: new UsersDto(user)})
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const createUserDto = new CreateUserDto(req.body)

      const newUserId = await this.userService.createUser(createUserDto)

      res.status(201).json({id: newUserId})
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const {id} = req.params
      const updateUserDto = new UpdateUserDto(req.body)

      await this.userService.updateUser(id, updateUserDto)

      res,status(204).json({})
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const {id} = req.params
      await this.userService.deleteUser(id)

      res.status(204).json({})
    } catch (err) {
      next(err);
    }
  }
}

const userController = new UserController();
export default userController;
