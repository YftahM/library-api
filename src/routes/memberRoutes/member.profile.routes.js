import { Router } from "express";
import {
    fetchMemberProfile,
    createMemberProfile,
    replaceMemberProfile,
    removeMemberProfile,
} from "../../controllers/member.profile.controller.js"

const router = Router();

router.get("/:memberId", fetchMemberProfile)
router.post("/:memberId", createMemberProfile)
router.put("/:memberId", replaceMemberProfile)
router.delete("/:memberId", removeMemberProfile)

export default router
