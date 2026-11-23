import fs from "node:fs"
const file = "src/lib/catalog-handler.ts"
let source = fs.readFileSync(file, "utf8")
// JustWatch ranks can be sparse global ranks even in a provider-filtered feed.
// Use positions in that selection and retain ranks supplied by FlixPatrol.
const replacements = [
  [
    "stremio:catalog:v6:",
    "stremio:catalog:v7:",
  ],
  [
    "concurrentMap(windowRows, async (row): Promise<StremioMeta | null>",
    "concurrentMap(windowRows, async (row, index): Promise<StremioMeta | null>",
  ],
  [
    "const posterAndShape = await buildPosterRowUrls(posterCtx, stremioType, row.tmdbId)",
    "const posterRank = chartPin.snapshot?.provenance === \"justwatch\" ? skipForGeneric + index + 1 : row.rank\n        const posterAndShape = await buildPosterRowUrls(posterCtx, stremioType, row.tmdbId, null, posterRank)",
  ],
  [
    "metas = (await concurrentMap(uniqueJwRows, async (row): Promise<StremioMeta | null>",
    "const isJustWatch = !pinnedPlatform || chartPin.snapshot?.provenance === \"justwatch\"\n          metas = (await concurrentMap(uniqueJwRows, async (row, index): Promise<StremioMeta | null>",
  ],
  [
    "if (title.length === 0) return null\n            const posterAndShape = await buildPosterRowUrls(posterCtx, stType, row.tmdbId)\n            const logo = !apiKey",
    "if (title.length === 0) return null\n            const posterRank = isJustWatch ? skipForPlatform + index + 1 : row.rank\n            const posterAndShape = await buildPosterRowUrls(posterCtx, stType, row.tmdbId, null, posterRank)\n            const logo = !apiKey",
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
