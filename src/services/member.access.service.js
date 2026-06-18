import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"

import { bcryptRounds } from "../config/index.js"
import { memberRepository } from "../dal/member.profile.dal.js"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function badRequest(message) {
    const err = new Error(message)
    err.status = 400
    return err
}

export const memberAccessService = {
    enrollMember: async (payload, sponsorId) => {
        const { email, password, displayName } = payload || {}

        if (typeof sponsorId !== "string" || sponsorId.trim().length === 0) {
            throw badRequest("sponsorId is required in the URL")
        }
        if (typeof email !== "string" || !emailRegex.test(email)) {
            throw badRequest("Email must be a valid address")
        }
        if (typeof password !== "string") {
            throw badRequest("Password must be a string")
        }
        if (password.length < 8 || password.length > 64) {
            throw badRequest("Password length must be between 8 and 64")
        }
        if (typeof displayName !== "string") {
            throw badRequest("displayName must be a string")
        }
        const trimmedName = displayName.trim()
        if (trimmedName.length < 2 || trimmedName.length > 40) {
            throw badRequest("displayName length must be between 2 and 40")
        }

        const normalizedEmail = email.trim().toLowerCase()

        const alreadyEnrolled = await memberRepository.existsByEmail(normalizedEmail)
        if (alreadyEnrolled) {
            throw badRequest("Member already enrolled")
        }

        const passwordHash = await bcrypt.hash(password, bcryptRounds)
        const member = {
            id: uuidv4(),
            email: normalizedEmail,
            displayName: trimmedName,
            sponsorId: sponsorId.trim(),
            passwordHash,
        }

        await memberRepository.insert(member)

        return {
            status: 201,
            message: "Member created",
            member: {
                id: member.id,
                email: member.email,
                displayName: member.displayName,
                sponsorId: member.sponsorId,
            },
        }
    },

    signInMember: async (payload) => {
        const { email, password } = payload || {}

        if (typeof email !== "string" || !emailRegex.test(email)) {
            throw badRequest("Email must be a valid address")
        }
        if (typeof password !== "string") {
            throw badRequest("Password must be a string")
        }
        if (password.length < 8 || password.length > 64) {
            throw badRequest("Password length must be between 8 and 64")
        }

        const normalizedEmail = email.trim().toLowerCase()
        const member = await memberRepository.findByEmail(normalizedEmail)
        if (!member || !member.passwordHash) {
            throw badRequest("Invalid credentials")
        }

        const match = await bcrypt.compare(password, member.passwordHash)
        if (!match) {
            throw badRequest("Invalid credentials")
        }

        return {
            status: 200,
            message: "Login successful",
            member: {
                id: member.id,
                email: member.email,
                displayName: member.displayName,
                sponsorId: member.sponsorId,
            },
        }
    },

    recoverCredential: async (payload) => {
        const { email } = payload || {}
        if (typeof email !== "string" || !emailRegex.test(email)) {
            throw badRequest("Email must be a valid address")
        }

        return {
            status: 200,
            message: "Recovery email sent",
        }
    },

    rotateCredential: async (payload) => {
        const { email, currentPassword, newPassword } = payload || {}

        if (typeof email !== "string" || !emailRegex.test(email)) {
            throw badRequest("Email must be a valid address")
        }
        if (typeof currentPassword !== "string") {
            throw badRequest("currentPassword must be a string")
        }
        if (typeof newPassword !== "string") {
            throw badRequest("newPassword must be a string")
        }
        if (newPassword.length < 8 || newPassword.length > 64) {
            throw badRequest("newPassword length must be between 8 and 64")
        }

        const normalizedEmail = email.trim().toLowerCase()
        const member = await memberRepository.findByEmail(normalizedEmail)
        if (!member || !member.passwordHash) {
            throw badRequest("Invalid credentials")
        }

        const match = await bcrypt.compare(currentPassword, member.passwordHash)
        if (!match) {
            throw badRequest("Invalid credentials")
        }

        const passwordHash = await bcrypt.hash(newPassword, bcryptRounds)
        await memberRepository.update(member.id, { passwordHash })

        return {
            status: 200,
            message: "Password updated",
        }
    },
}
