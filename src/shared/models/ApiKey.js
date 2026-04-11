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
        permissions: {
            canIngest: {
                type: Boolean,
                default: true
            },
            canReadAnalytics: {
                type: Boolean,
                default: false
            },
            allowedServices: [{
                type: String,
                trim: true
            }],
        },
        security: {
            allowedIPs: [{
                type: String,
                validate: {
                    validator: function(v){
                        return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(v) ||
                        v === '0.0.0.0/0';
                    },
                    message: 'Invalid IP address format'
                }
            }],
            allowedOrigins: [{
                type: String,
                validate: {
                    validator: function(v) {
                        return /^https?:\/\/[^\s]+$/.test(v) || v === '*';
                    },
                    message: 'Invalid origin format'
                }
            }]
        }
    }
)