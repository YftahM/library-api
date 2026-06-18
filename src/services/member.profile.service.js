import { v4 as uuidv4 } from "uuid"

import { memberRepository } from "../dal/member.profile.dal.js"

function badRequest(message) {
    const err = new Error(message)
    err.status = 400
    return err
}

function buildProfileResponse(member) {
    return {
        id: member.id,
        profileId: member.profileId,
        displayName: member.displayName,
        biography: member.biography,
        email: member.email,
        sponsorId: member.sponsorId,
    }
}

export const memberProfileService = {
    fetchMemberProfile: async (memberId) => {
        if (typeof memberId !== "string" || memberId.trim().length === 0) {
            throw badRequest("memberId must be a non-empty string")
        }

        const member = await memberRepository.findById(memberId)
        if (!member) {
            throw badRequest("Member profile not found")
        }

        return {
            status: 200,
            profile: buildProfileResponse(member),
        }
    },

    createMemberProfile: async (memberId, payload) => {
        if (typeof memberId !== "string" || memberId.trim().length === 0) {
            throw badRequest("memberId must be a non-empty string")
        }
        if (!payload || typeof payload !== "object") {
            throw badRequest("Profile payload is required")
        }
        const { displayName, biography } = payload
        if (typeof displayName !== "string" || displayName.trim().length === 0) {
            throw badRequest("displayName must be a non-empty string")
        }
        if (biography !== undefined && typeof biography !== "string") {
            throw badRequest("biography must be a string when provided")
        }
        if (typeof biography === "string" && biography.length > 500) {
            throw badRequest("biography must be 500 characters or fewer")
        }

        const existing = await memberRepository.findById(memberId)
        if (existing) {
            throw badRequest("Member profile already exists for this id")
        }

        const profileId = uuidv4()
        const member = {
            id: memberId,
            profileId: profileId,
            displayName: displayName.trim(),
            biography: typeof biography === "string" ? biography.trim() : "",
            email: typeof payload.email === "string" ? payload.email.trim().toLowerCase() : null,
            sponsorId: typeof payload.sponsorId === "string" ? payload.sponsorId.trim() : null,
            passwordHash: null,
        }

        await memberRepository.insert(member)

        return {
            status: 201,
            message: "Profile created",
            profileId: profileId,
            profile: buildProfileResponse(member),
        }
    },

    replaceMemberProfile: async (memberId, payload) => {
        if (typeof memberId !== "string" || memberId.trim().length === 0) {
            throw badRequest("memberId must be a non-empty string")
        }
        if (!payload || typeof payload !== "object") {
            throw badRequest("Profile payload is required")
        }
        const { displayName, biography } = payload
        if (typeof displayName !== "string" || displayName.trim().length === 0) {
            throw badRequest("displayName must be a non-empty string")
        }
        if (biography !== undefined && typeof biography !== "string") {
            throw badRequest("biography must be a string when provided")
        }
        if (typeof biography === "string" && biography.length > 500) {
            throw badRequest("biography must be 500 characters or fewer")
        }

        const existing = await memberRepository.findById(memberId)
        if (!existing) {
            throw badRequest("Member profile not found")
        }

        const updated = await memberRepository.update(memberId, {
            displayName: displayName.trim(),
            biography: typeof biography === "string" ? biography.trim() : "",
        })

        return {
            status: 200,
            message: "Profile updated",
            profile: buildProfileResponse(updated),
        }
    },

    removeMemberProfile: async (memberId) => {
        if (typeof memberId !== "string" || memberId.trim().length === 0) {
            throw badRequest("memberId must be a non-empty string")
        }

        const existing = await memberRepository.findById(memberId)
        if (!existing) {
            throw badRequest("Member profile not found")
        }

        await memberRepository.remove(memberId)

        return {
            status: 204,
        }
    },
}
