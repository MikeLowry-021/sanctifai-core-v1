# Perplexity AI Migration Summary

## Overview
Successfully migrated the AI-powered media analysis application from OpenAI to Perplexity API to enable real-time data retrieval for movies, shows, books, and music.

## What Changed

### 1. API Configuration (`server/config.ts`)
**Changed:**
- Updated environment variable schema from `OPENAI_API_KEY` to `PERPLEXITY_API_KEY`
- Updated config object property from `openaiApiKey` to `perplexityApiKey`
- Updated configuration logging from `hasOpenAI` to `hasPerplexity`

**Why:**
Perplexity requires its own API key and provides different capabilities than OpenAI.

### 2. AI Client Setup (`server/openai.ts`)
**Changed:**
- Renamed function from `getOpenAIClient()` to `getPerplexityClient()`
- Added Perplexity base URL: `https://api.perplexity.ai`
- Changed model from `gpt-4o` to `sonar-pro`
- Updated system prompt to emphasize real-time web access
- Updated all console logs from `[OpenAI]` to `[Perplexity]`

**Why:**
- `sonar-pro` is Perplexity's model optimized for deep web research and real-time data retrieval
- The new system prompt instructs the AI to search for specific content warnings, parents guides, and reviews
- Perplexity's base URL is required to route requests correctly

**New System Prompt:**
```
"You are an expert media analyst with real-time web access. Search for the specific title's parents guide, plot themes, and reviews before generating the discernment score. Be precise and cite sources."
```

### 3. API Routes (`server/routes.ts`)
**Changed:**
- Updated health check endpoint to report `hasPerplexity` instead of `hasOpenAI`
- Updated comments to reflect Perplexity's real-time capabilities
- Added note about real-time web access in the search endpoint

**Why:**
Maintains consistency throughout the codebase and helps with monitoring.

### 4. Environment Variables (`.env.example`)
**Created:**
- New `.env.example` file with `PERPLEXITY_API_KEY` placeholder
- Added documentation comments explaining where to get API keys

**Why:**
Provides clear documentation for future developers and deployments.

## Benefits of Perplexity API

1. **Real-Time Data Access**: Perplexity searches the web in real-time to find current information about movies, shows, books, and music
2. **Accurate Content Warnings**: Can access parents guides, IMDb content warnings, and recent reviews
3. **Up-to-Date Information**: No knowledge cutoff - always has access to the latest releases and reviews
4. **Source Citation**: The `sonar-pro` model is designed to cite sources, improving transparency

## Migration Checklist

- [x] Update configuration schema and exports
- [x] Migrate API client to Perplexity
- [x] Change model from `gpt-4o` to `sonar-pro`
- [x] Update system prompt for real-time analysis
- [x] Update health check endpoint
- [x] Create `.env.example` documentation
- [x] Verify build passes successfully
- [ ] Update actual `.env` file (see instructions below)
- [ ] Test with real Perplexity API key

## Next Steps: Updating Your .env File

**IMPORTANT**: You need to update your actual `.env` file with the Perplexity API key:

1. Get your Perplexity API key from: https://www.perplexity.ai/settings/api
2. Open your `.env` file
3. Update the key:
   ```
   PERPLEXITY_API_KEY=pplx-your-actual-api-key-here
   ```

Note: Your `.env` file already contains a `PERPLEXITY_API_KEY` - verify it's valid and active.

## Backward Compatibility

The migration maintains backward compatibility:
- Same function signatures (`analyzeMedia()`)
- Same response structure (`DiscernmentAnalysis` interface)
- Same error handling and fallback mechanisms
- Frontend code requires no changes

## Error Handling

Robust error handling remains in place:
- Returns fallback analysis if API key is missing
- Catches and logs API errors gracefully
- Provides user-friendly error messages
- Maintains UI stability even during failures

## Testing Recommendations

1. **Health Check**: Visit `/health` endpoint to verify `hasPerplexity: true`
2. **Search Test**: Analyze a recent movie/show to verify real-time data retrieval
3. **Fallback Test**: Temporarily remove API key to verify graceful degradation
4. **Content Warnings**: Test with movies known to have specific content warnings

## Technical Notes

- Perplexity API is compatible with OpenAI SDK (using same npm package)
- The `response_format: { type: "json_object" }` parameter is maintained
- All existing caching mechanisms continue to work
- Database storage format remains unchanged

## Files Modified

1. `server/config.ts` - Environment configuration
2. `server/openai.ts` - AI client and analysis logic
3. `server/routes.ts` - API routes and comments
4. `.env.example` - Documentation (new file)

## Build Status

✅ Build completed successfully with no errors
✅ All TypeScript types validated
✅ Production bundle generated
