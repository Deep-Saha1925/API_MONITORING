import mongoose from './mongoose';

const apiHitSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        timestamp: {
            type: Date,
            required: true
        },
        serviceName: {
            type: String,
            required: true,
            index: true
        }
    }
)