import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectTestDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      mongoURI = 'mongodb://localhost:27017/taskmanager_test';
    } else {
      if (mongoURI.includes('mongodb+srv://')) {
        mongoURI = mongoURI.replace(/\/[^/]+(\?|$)/, '/taskmanager_test$1');
      } else {
        mongoURI = mongoURI.replace(/\/[^/]+(\?|$)/, '/taskmanager_test$1');
      }
    }
    console.log('🧪 Connecting to TEST database (not your main database)');
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error('Test DB connection error:', error);
  }
};

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    console.error('Test DB disconnection error:', error);
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export { connectTestDB, disconnectTestDB, clearDatabase };

