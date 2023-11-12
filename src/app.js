import express from 'express';
import CategoriesRouter from './routes/categories.router.js';
import MenusRouter from './routes/menus.router.js';
import UsersRouter from './routes/users.router.js'

//import errorHandlerMiddleware from '../middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', [CategoriesRouter]);
app.use('/api', [MenusRouter]);
app.use('/api', [UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});