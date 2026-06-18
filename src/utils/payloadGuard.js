const METHODS_WITHOUT_BODY = new Set(["GET", "DELETE"])

export const requirePayload = (req, res, next) => {
    if (METHODS_WITHOUT_BODY.has(req.method)) return next()

    const hasBody = req.body && typeof req.body === "object" && Object.keys(req.body).length > 0
    if (!hasBody) {
        return res.status(400).json({ message: "Request payload is required" })
    }
    next()
}
