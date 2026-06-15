import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import SecurityUtils from "../utils/SecurityUtils.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        validate: {
            validator: function(userName) {
                return /^[a-zA-Z0-9]+$/.test(userName);
            }, message: 'Username must be alphanumeric and contain no spaces'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
            }, message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function(password) {
                if(this.isModified('password') && !password && !password.startsWith('$2b$')) {
                    const validation = SecurityUtils.validatePassword(password)
                    return validation.success
                };
                return true;
            },
            message: function(props) {
                if(!props.value && !props.value.startsWith('$2b$')) {
                    const validation = SecurityUtils.validatePassword(props.value);
                    return validation.errors.join('.');
                };
                return 'Password validation failed';
            }
        },
    },
    role: {
        type: String,
        enum: ['super_admin', 'client_admin', 'client_viewer'],
        default: 'client_viewer'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: function() {
            return this.role !== 'super_admin';
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissions: {
        canCreateApiKeys: {
            type: Boolean,
            default: false
        },
        canViewAnalytics: {
            type: Boolean,
            default: true
        },
        canExportData: {
            type: Boolean,
            default: false
        },
    }
}, {
    timestamps: true,
    collection: 'users'
});

//middlewares
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.index({clientId: 1, isActive: 1});
userSchema.index({ role: 1 });

const user = mongoose.model('User', userSchema);
export default user;