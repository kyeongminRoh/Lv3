import joi from 'joi'



const createMenus = joi.object({
    name: joi.string().label("올바르지 않은 형식입니다."),
    description: joi.string().min(3).max(100),
    price: joi.number().min(1),
    image: joi.string(),
    order: joi.number(),
    status: joi.string().valid("FOR_SALE", "SOLD_OUT").label("status는 FOR_SALE 혹은 SOLD_OUT 중 한가지만 설정 가능합니다"),
  })

  const createCategory = joi.object({
    name: joi.string().label("올바르지 않은 형식입니다."),
    order: joi.number()
  })

  const createUsers = joi.object ({
    nickname: joi.string().min(3).max(15).label("닉네임 형식이 올바르지 않습니다."),
    password: joi.string().min(8).max(20),
    usertype: joi.string().valid("CUSTOMER", "OWNER")
  })

  export { createCategory, createMenus, createUsers };


