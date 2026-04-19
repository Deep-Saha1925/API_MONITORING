import config from "../../../shared/config/index.js";
import { APPLICATION_ROLES } from "../../../shared/constants/roles.js";
import AppError from "../../../shared/utils/AppError.js";
import ResponseFormatter from '../../../shared/utils/responseFormatter.js';

export class AuthController{
    constructor(authService){
        if(!authService){
            throw new AppError("Userservice is required")
        }

        this.authService = authService;
    };

    async onboardSuperAdmin(req, res, next){
        try {
            const {username, email, password} = req.body;

            const superAdminData = {
                username,
                email,
                password,
                role: APPLICATION_ROLES.SUPER_ADMIN
            };

            //register super admin
            const {token, user} = await this.authService.onboardSuperAdmin(superAdminData);
            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                maxAge: config.cookie.expiresIn
            });

            res.status(201).json(ResponseFormatter.success(user, "Super admin created successfully", 201))

        } catch (error) {
            next(error);
        }
    }
}