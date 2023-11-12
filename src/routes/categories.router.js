import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { createCategory } from "../joi.js";
import authMiddlewares from '../middlewares/auth.middleware.js'

const router = express.Router();
// category API

router.post("/categories", authMiddlewares, async (req, res, next) => {
  try {
    //        const { categoryId } = req.params;
    const validation = await createCategory.validateAsync(req.body);
    const { name } = validation;
    const { userId } = req.userId
    const user = await prisma.users.findFirst({
      where: { userId: user.userId }
    })
    if (user.usertype !== "OWNER") {
      return res.status(400).json({ errorMesaage: "등록할 권한이 존재하지 않습니다." })
    }
    if (!name) {
      return res
        .status(400)
        .json({ errorMessage: "형식이 올바르지 않습니다." });
    }
    let order = 1;
    const orderCount = await prisma.Categories.findFirst({
      // 데이터베이스에서 첫번째 카테고리를 가져오기
      orderBy: { order: "desc" }, // orderBy 는 카테고리 테이블order 필드를 기준으로 내림차순으로 정렬
    });
    if (orderCount) {
      // 만약DB에 카테고리가 존재한다면 가장높은 오더값을 가져와
      order = orderCount.order + 1; // 1을 더하고 order 에 할당해 그럼 기존값 보다 1이증가됨
    }
    await prisma.Categories.create({
      data: { name, order },
    });
    return res.status(201).json({ Message: "카테고리를 등록하였습니다." });
  } catch (error) {
    next(error);
  }
});
// 목록 조회 API
router.get("/categories", async (req, res, next) => {
  const categories = await prisma.Categories.findMany({
    // findManyDB 레코드 목록들을 불러오기
    select: {
      // 반환될 개체에 포함할 속성을 지정한다.
      categoryId: true,
      order: true,
      name: true,
    },
  });
  return res.status(200).json({ data: categories });
});
// 카테고리 정보 변경
router.patch("/categories/:categoryId", authMiddlewares, async (req, res, next) => {
  try {
    const validation = await createCategory.validateAsync(req.body);
    const { name, order } = validation;
    const { categoryId } = req.params;
    const user = await prisma.users.findFirst({
      where: { userId: user.userId }
    })
    if (user.usertype !== "OWNER") {
      return res.status(400).json({ errorMesaage: "등록할 권한이 존재하지 않습니다." })
    }
    const categories = await prisma.categories.findUnique({
      where: {
        categoryId: +categoryId,
      },
    });
    if (!categories) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    
    const updateCategory = await prisma.categories.update({
      where: {
        categoryId: +categoryId,
      },
      data: {
        name,
        order,
      },
    });
    return res.status(200).json({ data: updateCategory });
  } catch (error) {
    next(error);
  }
});
// delete
router.delete("/categories/:categoryId", authMiddlewares, async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    //const { name, order } = req.body;
    const user = await prisma.users.findFirst({
      where: { userId: user.userId }
    })
    if (user.usertype !== "OWNER") {
      return res.status(400).json({ errorMesaage: "등록할 권한이 존재하지 않습니다." })
    }
    const categories = await prisma.categories.findFirst({
      where: {
        categoryId: +categoryId,
      },
    });
    if (!categories) {
      return res
        .status(404)
        .json({ errorMessage: "카테고리가 존재하지 않습니다." });
    }
    const DeleteCategory = await prisma.categories.delete({
      where: {
        categoryId: +categoryId,
      },
    });
    return res.status(200).json({ data: DeleteCategory });
  } catch (error) {
    next(error);
  }
});

export default router;
