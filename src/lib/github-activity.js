export function parseGithubActivity(data) {
    const total = data?.total?.lastYear;
    if (!Number.isSafeInteger(total) || total < 0 || !Array.isArray(data.contributions) || data.contributions.length < 182) {
        throw new Error("Invalid GitHub activity");
    }
    const days = data.contributions.slice(-182).map(({ date, count, level }) => {
        if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !Number.isSafeInteger(count) || count < 0 || !Number.isInteger(level) || level < 0 || level > 4 ||
            !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
            throw new Error("Invalid GitHub activity day");
        }
        return { d: date, c: count, l: level };
    });
    return { total, days };
}
