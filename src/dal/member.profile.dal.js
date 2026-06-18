import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, "members.data.json")

const seed = {
    "seed-member-roni": {
        id: "seed-member-roni",
        email: "roni@library.test",
        displayName: "RONI",
        sponsorId: "house-sponsor",
        passwordHash: null,
    },
}

let state

if (fs.existsSync(DATA_FILE)) {
    state = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
    if (!state["seed-member-roni"]) {
        state["seed-member-roni"] = seed["seed-member-roni"]
    }
} else {
    state = { ...seed }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2))
}

function persist() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2))
}


export const memberRepository = {
    findById: async (memberId) => {
        return state[memberId] || null
    },
    findByEmail: async (email) => {
        for (const member of Object.values(state)) {
            if (member.email === email) return member
        }
        return null
    },
    existsByEmail: async (email) => {
        for (const member of Object.values(state)) {
            if (member.email === email) return true
        }
        return false
    },
    insert: async (member) => {
        state[member.id] = member
        persist()
        return member
    },
    update: async (memberId, patch) => {
        const existing = state[memberId]
        if (!existing) return null
        const next = { ...existing, ...patch, id: memberId }
        state[memberId] = next
        persist()
        return next
    },
    remove: async (memberId) => {
        if (!(memberId in state)) return false
        delete state[memberId]
        persist()
        return true
    },
}
