import express from 'express'
import { prisma } from "../utils/prisma/index.js";

const router = express.Router()

// 메뉴 등록 API
router.post('/categories/:categoryId/menus', async(req, res, next) => {
    try {
    const { categoryId } = req.params;
    const { name, description, image, price } = req.body;
    const categories = await prisma.categories.findFirst({
        where: {
            categoryId: +categoryId
        }
    })
    if (price < 0) {
        return res.status(401).json({ errorMessage: "메뉴가격이0보다 작을수 없습니다." })
    }
    let order = 1
    const orderCount = await prisma.menus.findFirst({ // 데이터베이스에서 첫번째 카테고리를 가져오기
        orderBy: { order: "desc" } // orderBy 는 카테고리 테이블order 필드를 기준으로 내림차순으로 정렬
    })
    if (orderCount) { // 만약DB에 카테고리가 존재한다면 가장높은 오더값을 가져와
        order = orderCount.order + 1 // 1을 더하고 order 에 할당해 그럼 기존값 보다 1이증가됨
    }
    // const maxOrder = await prisma.menus.findFirst({
    //     orderBy: { order: "desc" },
    // });
    // const orderPlus = maxOrder ? maxOrder.order + 1 : 1; //order + 1 해주기 위함. (id는 따로 있어서 autoincrement불가로 인하여 불가피하게 +1씩 해줌)
    const menus = await prisma.menus.create({
        data: {
            categoryId: +categoryId,
            name,
            description,
            image,
            status: 'FOR_SALE', // 기본설정이..이게 맞나?
            price,
            order
        }
    })
    return res.status(201).json({ data: menus })
}catch (error) {
    next(error)
}
})

// 카테고리 별 메뉴 조회  API
router.get('/categories/:categoryId/menus', async(req, res, next) => {
    try {
    const { categoryId } = req.params;
    const { name, image, price, order } = req.body;
    const categories = await prisma.categories.findFirst({
        where: { categoryId: +categoryId }
    })
    if (!categories) {
        return res.status(404).json({ errorMessage: "존재하지 않는 카테고리입니다." })
    }
    const menus = await prisma.menus.findMany({
        where: { categoryId: +categoryId },
        select: {
            menuId: true,
            name: true,
            image: true,
            price: true,
            order: true,
            status: true
        }
    })
    return res.status(201).json({ data: menus })
}catch (error) {
    next(error)
}
})
// 메뉴 상세 조회
router.get('/categories/:categoryId/menus/:menuId', async (req, res, next) => {
    try {
    const { categoryId } = req.params;
    const { menuId, name, description, image, price, status } = req.body;
    const categories = await prisma.categories.findFirst({
        where: { categoryId: +categoryId }
    })
    if (!categoryId) {
        return res.status(404).json({ errorMessage: "존재하지 않는 아이디 입니다." })
    } 
    const MenuDetails = await prisma.menus.findMany({
        where: { categoryId: +categoryId },
        select: {
            menuId: true,
            name: true,
            description: true,
            image: true,
            price: true,
            status: true
        }
    })
    return res.status(200).json({ data: MenuDetails })
} catch (error) {
    next(error)
}
})
// 메뉴 수정
router.patch('/categories/:categoryId/menus/:menuId', async (req, res, next) => {
    const { categoryId, menuId } = req.params;
    const { name, description, price, status } = req.body;
    const categories = await prisma.categories.findFirst({
        where: { categoryId: +categoryId }
    })
    const menus = await prisma.menus.findFirst({
        where : { menuId: +menuId }
    })
    if (!categories) {    
        return res.status(404).json({ errorMessage: "존재하지 않는 카테고리 입니다."})
    } else if (!menus) {
        return res.status(404).json({ errorMessage: "존재하지 않는 메뉴 입니다." })
    }
    const UpdateMenu = await prisma.menus.update({
        data: { name, description, price, status },
        where: { categoryId: +categoryId, menuId: +menuId }
    })
    if (price < 0) {
        return res.status(401).json({ errorMessage: "메뉴가격이0보다 작을수 없습니다." })
    }
    return res.status(200).json({ data: UpdateMenu })
})
// 메뉴 삭제
router.delete('/categories/:categoryId/menus/:menuId', async (req, res, next) => {
    const { categoryId, menuId } = req.params;
    const menus = await prisma.menus.findFirst({
        where: { categoryId: +categoryId }
    })
    if (!menus) {
        return res.status(404).json({ errorMessage: "존재하지 않는 메뉴 입니다." })
    }
    const DeleteMenus = await prisma.menus.delete({
        where: { menuId: +menuId }
    })
    return res.status(200).json({ data: DeleteMenus })
})

export default router