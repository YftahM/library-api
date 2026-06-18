import { memberProfileService } from "../services/member.profile.service.js"

export const fetchMemberProfile = async (req, res, next) => {
    try {
        const { memberId } = req.params
        const response = await memberProfileService.fetchMemberProfile(memberId)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}

export const createMemberProfile = async (req, res, next) => {
    try {
        const { memberId } = req.params
        const { body: profileData } = req
        const response = await memberProfileService.createMemberProfile(memberId, profileData)
        const { status, ...payload } = response
        res.status(status || 201).json(payload)
    } catch (error) {
        next(error)
    }
}

export const replaceMemberProfile = async (req, res, next) => {
    try {
        const { memberId } = req.params
        const { body: profileData } = req
        const response = await memberProfileService.replaceMemberProfile(memberId, profileData)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}

export const removeMemberProfile = async (req, res, next) => {
    try {
        const { memberId } = req.params
        const response = await memberProfileService.removeMemberProfile(memberId)
        res.status(response.status || 204).end()
    } catch (error) {
        next(error)
    }
}
