import { AuthController } from '../controller/auth.controller.js';
import { AuthService } from '../service/auth.service.js';
import MongoUserRepository from '../repository/UserRepository.js';

class Container {
    static init(){
        const repositories = {
            userRepository: MongoUserRepository
        };

        const services = {
            authService: new AuthService(repositories.userRepository)
        };

        const controller = {
            authController: new AuthController(services.authService)
        };

        return { repositories, services, controller };
    }
}

const initialize = Container.init();
export { Container };
export default initialize;