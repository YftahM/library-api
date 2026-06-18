import { Router } from "express";
import {
    signInMember,
    enrollMember,
    recoverCredential,
    rotateCredential,
} from "../../controllers/member.access.controller.js";

const router = Router();

router.post('/signin', signInMember)
router.post('/enroll/:sponsorId', enrollMember)
router.post('/recover', recoverCredential)

router.patch('/rotate', rotateCredential)

export default router
