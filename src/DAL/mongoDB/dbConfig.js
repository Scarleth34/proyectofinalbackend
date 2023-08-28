import mongoose from 'mongoose';
import config from '../../config/config.js';
import { logger } from '../../utils/logger.utils.js';

const connectDB = async() => {
    try {
        await mongoose.connect(config.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });
        logger().info('MongoDB connected');
    } catch (error) {
        logger().error(error);
    }
}

export default connectDB;