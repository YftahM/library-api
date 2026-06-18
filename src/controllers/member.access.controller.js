import { memberAccessService } from "../services/member.access.service.js"

export const signInMember = async (req, res, next) => {
    try {
        const { body: credentials } = req
        const response = await memberAccessService.signInMember(credentials)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}

export const enrollMember = async (req, res, next) => {
    try {
        const { body: enrollmentData } = req
        const { sponsorId } = req.params
        const response = await memberAccessService.enrollMember(enrollmentData, sponsorId)
        const { status, ...payload } = response
        res.status(status || 201).json(payload)
    } catch (error) {
        next(error)
    }
}

export const recoverCredential = async (req, res, next) => {
    try {
        const { body: recoveryData } = req
        const response = await memberAccessService.recoverCredential(recoveryData)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}

export const rotateCredential = async (req, res, next) => {
    try {
        const { body: rotationData } = req
        const response = await memberAccessService.rotateCredential(rotationData)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}
