# Article Management API v1

RESTful API for managing articles, categories, and tags. All endpoints require API key authentication.

## Base URL

```
/api/v1
```

## Authentication

All endpoints require an API key to be sent in the `Authorization` header.

**Header Format:**

```
Authorization: <API_KEY>
```

or

```
Authorization: Bearer <API_KEY>
```

**Environment Variable:**
Set `API_KEY` in your `.env` file. If not set, API will allow requests (dev mode).

---

## Endpoints

### Articles

#### `GET /api/v1/articles`

Get paginated list of published articles.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Items per page

**Response:**

```json
{
	"data": [
		{
			"id": "string",
			"slug": "string",
			"title": "string",
			"thumbnail": "string | null",
			"category": "ArticleCategory | null",
			"published": true,
			"createdAt": "ISO8601",
			"updatedAt": "ISO8601",
			"tags": [
				{
					"name": "string",
					"slug": "string",
					"category": "TagCategory | null"
				}
			],
			"seo": {
				"metaTitle": "string | null",
				"metaDesc": "string | null",
				"metaImage": "string | null"
			}
		}
	],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 100,
		"totalPages": 5,
		"hasNext": true,
		"hasPrev": false
	}
}
```

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/articles?page=1&limit=20" \
  -H "Authorization: your-api-key"
```

---

#### `GET /api/v1/articles/{slug}`

Get a single article by slug.

**Path Parameters:**

- `slug` (required) - Article slug

**Response:**

```json
{
	"id": "string",
	"slug": "string",
	"title": "string",
	"content": "string",
	"thumbnail": "string | null",
	"category": "ArticleCategory | null",
	"published": true,
	"createdAt": "ISO8601",
	"updatedAt": "ISO8601",
	"tags": [
		{
			"id": "string",
			"name": "string",
			"slug": "string",
			"category": "TagCategory | null"
		}
	],
	"seo": {
		"metaTitle": "string | null",
		"metaDesc": "string | null",
		"metaImage": "string | null",
		"ogImage": "string | null",
		"robots": "string | null",
		"structuredData": "object | null"
	}
}
```

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/articles/my-article-slug" \
  -H "Authorization: your-api-key"
```

---

#### `POST /api/v1/articles`

Create a new article.

**Request Body:**

```json
{
	"title": "string (required)",
	"content": "string (required)",
	"category": "ArticleCategory | null",
	"tags": ["string"],
	"thumbnail": "string | null",
	"published": false,
	"seo": {
		"metaTitle": "string | null",
		"metaDesc": "string | null",
		"metaImage": "string | null",
		"ogImage": "string | null",
		"robots": "string | null",
		"structuredData": "object | null"
	}
}
```

**Response:** `201 Created`

```json
{
	"id": "string",
	"slug": "string",
	"title": "string"
	// ... full article object
}
```

**Example:**

```bash
curl -X POST "https://yourdomain.com/api/v1/articles" \
  -H "Authorization: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Article",
    "content": "# Article Content",
    "category": "EXAM_PREPARATION",
    "tags": ["JEE_MAIN", "PHYSICS"],
    "published": true
  }'
```

---

#### `PUT /api/v1/articles/{slug}`

Update an existing article.

**Path Parameters:**

- `slug` (required) - Article slug

**Request Body:** (all fields optional)

```json
{
	"title": "string",
	"content": "string",
	"category": "ArticleCategory | null",
	"tags": ["string"],
	"thumbnail": "string | null",
	"published": true,
	"seo": {
		"metaTitle": "string | null",
		"metaDesc": "string | null",
		"metaImage": "string | null",
		"ogImage": "string | null",
		"robots": "string | null",
		"structuredData": "object | null"
	}
}
```

**Response:** `200 OK` - Full updated article object

**Example:**

```bash
curl -X PUT "https://yourdomain.com/api/v1/articles/my-article-slug" \
  -H "Authorization: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "published": true,
    "tags": ["JEE_MAIN", "PHYSICS", "ADVANCED"]
  }'
```

---

#### `DELETE /api/v1/articles/{slug}`

Delete an article.

**Path Parameters:**

- `slug` (required) - Article slug

**Response:** `204 No Content`

**Example:**

```bash
curl -X DELETE "https://yourdomain.com/api/v1/articles/my-article-slug" \
  -H "Authorization: your-api-key"
```

---

### Category Endpoints

#### `GET /api/v1/articles/category/{category}`

Get articles filtered by category.

**Path Parameters:**

- `category` (required) - Article category enum value

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)

**Response:** Same structure as `GET /api/v1/articles` with additional `category` field

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/articles/category/EXAM_PREPARATION?page=1&limit=20" \
  -H "Authorization: your-api-key"
```

---

### Tag Endpoints

#### `GET /api/v1/articles/tag/{tag}`

Get articles filtered by tag.

**Path Parameters:**

- `tag` (required) - Tag name

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)

**Response:** Same structure as `GET /api/v1/articles` with additional `tag` field

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/articles/tag/JEE_MAIN?page=1&limit=20" \
  -H "Authorization: your-api-key"
```

---

### Search

#### `GET /api/v1/articles/search`

Search articles by title or content.

**Query Parameters:**

- `q` (required) - Search query
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)

**Response:** Same structure as `GET /api/v1/articles` with additional `query` field

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/articles/search?q=physics&page=1&limit=20" \
  -H "Authorization: your-api-key"
```

---

### Article Categories

#### `GET /api/v1/article-categories`

Get all available article categories.

**Response:**

```json
{
	"data": [
		{
			"value": "EXAM_PREPARATION",
			"label": "Exam Preparation"
		},
		{
			"value": "SUBJECT_WISE",
			"label": "Subject Wise"
		}
		// ... all 15 categories
	],
	"total": 15
}
```

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/article-categories" \
  -H "Authorization: your-api-key"
```

---

### Tags

#### `GET /api/v1/tags`

Get all tags.

**Query Parameters:**

- `category` (optional) - Filter by tag category

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "category": "TagCategory | null",
      "_count": {
        "articles": 5
      }
    }
  ],
  "groupedByCategory": {
    "EXAM": [...],
    "SUBJECT": [...]
  },
  "categoryLabels": {
    "EXAM": "Exam Tags",
    "SUBJECT": "Subject Tags"
  },
  "total": 50
}
```

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/tags?category=EXAM" \
  -H "Authorization: your-api-key"
```

---

### Category Tags

#### `GET /api/v1/article-categories/{category}/tags`

Get all tags used by articles in a specific category.

**Path Parameters:**

- `category` (required) - Article category enum value

**Response:**

```json
{
	"data": [
		{
			"id": "string",
			"name": "string",
			"slug": "string",
			"category": "TagCategory | null",
			"articleCount": 5
		}
	],
	"category": "EXAM_PREPARATION",
	"total": 10
}
```

**Example:**

```bash
curl -X GET "https://yourdomain.com/api/v1/article-categories/EXAM_PREPARATION/tags" \
  -H "Authorization: your-api-key"
```

---

## Article Categories Enum

Available article categories:

- `EXAM_PREPARATION` - Exam Preparation
- `SUBJECT_WISE` - Subject Wise
- `TOPIC_EXPLAINER` - Topic Explainer
- `QUESTION_STRATEGY` - Question Strategy
- `MOCK_TEST_ANALYSIS` - Mock Test Analysis
- `PERSONALIZED_LEARNING` - Personalized Learning
- `REVISION_SYSTEM` - Revision System
- `EXAM_PHASE_STRATEGY` - Exam Phase Strategy
- `STUDENT_PSYCHOLOGY` - Student Psychology
- `RANK_IMPROVEMENT_CASES` - Rank Improvement Cases
- `TOOLS_RESOURCES` - Tools & Resources
- `PLATFORM_UPDATES` - Platform Updates
- `COMPARISONS` - Comparisons
- `PARENT_GUIDANCE` - Parent Guidance
- `EXAM_NEWS` - Exam News

## Tag Categories Enum

Available tag categories:

- `EXAM` - Exam Tags
- `SUBJECT` - Subject Tags
- `TOPIC` - Topic Tags
- `DIFFICULTY_INTENT` - Difficulty / Intent Tags
- `STUDENT_PHASE` - Student Phase Tags
- `PSYCHOLOGY_MISTAKE` - Psychology / Mistake Tags

## Error Responses

All endpoints return errors in the following format:

```json
{
	"error": "Error message",
	"status": 400
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `204` - No Content (DELETE)
- `400` - Bad Request
- `401` - Unauthorized (Invalid or missing API key)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting in production.

## Notes

- All timestamps are in ISO 8601 format
- Pagination starts at page 1
- Maximum limit per page is 100 items
- Only published articles are returned in list/search endpoints (unless authenticated as admin)
- Article slugs are auto-generated from titles and are unique
