import fs from "node:fs"
const file = "src/lib/catalog-handler.ts"
let source = fs.readFileSync(file, "utf8")
const replacements = [
  [
    "buildPosterRowUrls(posterCtx, stremioType, row.tmdbId)",
    "buildPosterRowUrls(posterCtx, stremioType, row.tmdbId, null, row.rank)",
  ],
  [
    "if (title.length === 0) return null\n            const posterAndShape = await buildPosterRowUrls(posterCtx, stType, row.tmdbId)\n            const logo = !apiKey",
    "if (title.length === 0) return null\n            const posterAndShape = await buildPosterRowUrls(posterCtx, stType, row.tmdbId, null, row.rank)\n            const logo = !apiKey",
  ],
  [
    "const posterAndShape = await buildPosterRowUrls(posterCtx, stType, item.tmdbId)\n              const [imdbId, details, logo]",
    "const posterAndShape = await buildPosterRowUrls(posterCtx, stType, item.tmdbId, null, item.rank)\n              const [imdbId, details, logo]",
  ],
]
for (const [before, after] of replacements) {
  const count = source.split(before).length - 1
  if (count !== 1) {
    throw new Error(`Rank patch expected one match, found ${count}: ${before}`)
  }
  source = source.replace(before, after)
}
fs.writeFileSync(file, source)
console.log("Applied persistent streaming chart rank patch")
