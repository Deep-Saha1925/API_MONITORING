import mongoose from './mongoose';


const apiKeySchema = new mongoose.Schema(
    {
        keyId: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        keyValue: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
            index: true
        },
        name: {
            type: String,
            unique: true,
            trim: true,
            maxLength: 100
        },
        description: {
            type: String,
            maxLength: 500,
            default: ''
        },
        environment: {
            type: String,
            enum: ['production', 'staging', 'development', 'testing'],
            default: 'production'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        
    }
)