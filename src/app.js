import express from 'express';
import CategoriesRouter from './routes/categories.router.js';
import MenusRouter from './routes/menus.router.js';
import LogMiddleware from './middlewares/LogMiddleware.js';
import ErrorhandlerMiddleware from './middlewares/error-handler.middleware.js';
import UsersRouter from './routes/users.router.js'
import cookieParser from 'cookie-parser'

//import errorHandlerMiddleware from '../middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(LogMiddleware)
app.use(cookieParser())
app.use(ErrorhandlerMiddleware)
app.use('/api', [CategoriesRouter]);
app.use('/api', [MenusRouter]);
app.use('/api', [UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});