import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        maxlength: 500,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    settings: {
        dataRetentionDays: {
            type: Number,
            default: 30,
            min: 7,
            max: 365
        },
        alertsEnabled: {
            type: Boolean,
            default: false
        },
        timezone: {
            type: String,
            default: 'UTC'
        },
    },
},
{
    timestamps: true,
    collection: 'clients',
}
);

clientSchema.index({ isActive: 1 });

const Client = moongoose.model('Client', clientSchema);
export default Client;