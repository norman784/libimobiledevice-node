exports.UnkownErrror = class UnkownError extends Error {
    constructor(message) {
        super(`Unkown error: ${message}`);
        this.name
    }
}