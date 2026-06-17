import AppError from '../../../shared/utils/AppError.js';
import jwt from "jsonwebtoken";
import config from '../../../shared/config/index.js';
import logger from '../../../shared/config/logger.js';
import bcrypt from 'bcrypt.js';

export class AuthService{
    constructor(userRepository) {
        if (!userRepository) {
            throw new Error("UserRepository is Required");
        }
        this.userRepository = userRepository;
    };

    generateToken(user){
        const { _id, email, username, role, clientId } = user;

        const payload = {
            userId: _id,
            username,
            email,
            role,
            clientId
        }

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiredIn
        })
    }
    
    /**
     * Removing password for response
     * @param {*} user 
     * @returns 
     */
    formatUserForResponse(user){
        const userObj = user.toObject ? user.toObject() : {...user};
        delete userObj.password;
        return userObj;
    }

    async comparePassword(userEnteredPassword, hashedPassword){
        return await bcrypt.compare(userEnteredPassword, hashedPassword);
    }


    /**
     * Onboards a new super admin user.
     * @param {Object} superAdminData - The data of the super admin to be onboarded.
     * @returns {Promise<Object>} - Returns an object containing the user and token.
     */
    async onboardSuperAdmin(superAdminData) {
        try {
            const existingUser = await this.userRepository.findAll();

            if (existingUser && existingUser.length > 0) {
                throw new AppError("Super admin onboarding is disabled", 403);
            }

            const user = await this.userRepository.create(superAdminData);
            const token = this.generateToken(user);

            logger.info("Admin onboarded successfully", {
                username: user.username
            })

            return {
                user: this.formatUserForResponse(user),
                token
            }
        } catch (error) {
            logger.error("Error in onboarding Super admin", error)
            throw error
        }
    };

    async register(userData){
        try {

            const existingUsername = await this.userRepository.findByUsername(userData.username);
            if (existingUsername) {
                throw new AppError("Username already exists", 409);
            }

            const existingEmail = await this.userRepository.findByEmail(userData.email);
            if (existingEmail) {
                throw new AppError("Email already exists", 409);
            }

            const user = await this.userRepository.create(userData);
            const token = this.generateToken(user);

            logger.info("User registered successfully", {
                username: user.username
            })

            return {
                user: this.formatUserForResponse(user),
                token
            }
        }
        catch (error) {
            logger.error("Error in registering user", error)
            throw error;
        }
    };

    async login(username, password){
        try {
            const user = await this.userRepository.findByUsername(username);
            if (!user) {
                throw new AppError("Invalid username or password", 401);
            }
        
            if(!user.isActive){
                throw new AppError("Accoount is deactivated", 403);
            }

            const isPasswordValid = await this.comparePassword(password, user.password);
            if(!isPasswordValid){
                throw new AppError("Invalid credentials.", 401);
            }
            const token = this.generateToken(user);

            logger.info("uUser logged in sucessfully..", {username: user.username})
            return {
                user: this.formatUserForResponse(user),
                token
            }
        }catch (error) {
            logger.error("Error in user login", error)
            throw error;
        }
    }
}