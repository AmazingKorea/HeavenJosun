import { Service } from 'typedi';
import User from '../domain/entities/User.js';
import UserRepository from '../domain/repositories/UserRepository.js';
import UserRegisterDTO from '../presentation/users/UserRegisterDTO.js';

/*
  CRUD 서비스이므로 메소드는 C>R>U>D 순서로 정의한다.

  CRUD 서비스의 경우 자체 로직에서 예외가 발생할 일이 없는 경우 try-catch 구문을 쓰지 않고,
  Controller 혹은 Middleware에서 catch하도록 둔다.
*/
@Service()
class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userRegisterDTO: UserRegisterDTO): Promise<User> {
    const { username, password, name } = userRegisterDTO;
    const toCreate = new User(username, password, name);
    await this.userRepository.createUser(toCreate);
    console.log('user-created:', userRegisterDTO);
    return toCreate;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    console.log('user-found:', user);
    return user;
  }

  async getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    return this.userRepository.getUserByUsernameAndPassword(username, password);
  }
}

export default UserService;
