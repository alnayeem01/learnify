import { getHistories, getRecentlyPlayed, removeHistory, updateHistory } from '#/controllers/history'
import { mustAuth } from '#/middleware/auth'
import { validate } from '#/middleware/validator'
import { updateHistoyValidationSchema } from '#/utils/validationSchema'
import Route from 'express'

const route = Route()

route.post("/", mustAuth, validate(updateHistoyValidationSchema), updateHistory)

route.delete("/", mustAuth, removeHistory)

route.get("/", mustAuth, getHistories)

route.get("/recently-played", mustAuth, getRecentlyPlayed)

export default route