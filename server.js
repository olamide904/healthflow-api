import 'dotenv/config';

import env from './src/config/env.js';
import app from './src/app.js';
import  ConnectDB from './src/config/connectDB.js';
const PORT = env.PORT || 3000;


app.listen(PORT, async () => {
    await ConnectDB();
    console.log(`Server is running on port ${PORT}`);
});