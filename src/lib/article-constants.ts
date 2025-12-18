export const ARTICLE_CATEGORIES = [
	{ value: "EXAM_PREPARATION", label: "Exam Preparation" },
	{ value: "SUBJECT_WISE", label: "Subject Wise" },
	{ value: "TOPIC_EXPLAINER", label: "Topic Explainer" },
	{ value: "QUESTION_STRATEGY", label: "Question Strategy" },
	{ value: "MOCK_TEST_ANALYSIS", label: "Mock Test Analysis" },
	{ value: "PERSONALIZED_LEARNING", label: "Personalized Learning" },
	{ value: "REVISION_SYSTEM", label: "Revision System" },
	{ value: "EXAM_PHASE_STRATEGY", label: "Exam Phase Strategy" },
	{ value: "STUDENT_PSYCHOLOGY", label: "Student Psychology" },
	{ value: "RANK_IMPROVEMENT_CASES", label: "Rank Improvement Cases" },
	{ value: "TOOLS_RESOURCES", label: "Tools & Resources" },
	{ value: "PLATFORM_UPDATES", label: "Platform Updates" },
	{ value: "COMPARISONS", label: "Comparisons" },
	{ value: "PARENT_GUIDANCE", label: "Parent Guidance" },
	{ value: "EXAM_NEWS", label: "Exam News" }
] as const

export type ArticleCategoryType = (typeof ARTICLE_CATEGORIES)[number]["value"]

export const TAG_CATEGORIES = {
	EXAM: [
		"JEE_MAIN",
		"JEE_ADVANCED",
		"NEET",
		"CLASS_11",
		"CLASS_12",
		"DROPPER",
		"FOUNDATION"
	],
	SUBJECT: ["PHYSICS", "CHEMISTRY", "MATHEMATICS", "BIOLOGY"],
	TOPIC: [
		"ROTATIONAL_MOTION",
		"THERMODYNAMICS",
		"ELECTROSTATICS",
		"ORGANIC_REACTIONS",
		"INTEGRALS",
		"GENETICS"
		// Add more topic tags as needed
	],
	DIFFICULTY_INTENT: [
		"BEGINNER",
		"ADVANCED",
		"TRICKY",
		"MULTI_STEP",
		"HIGH_WEIGHTAGE",
		"PYQ_BASED"
	],
	STUDENT_PHASE: [
		"SYLLABUS_ONGOING",
		"SYLLABUS_COMPLETED",
		"FINAL_60_DAYS",
		"REVISION_PHASE"
	],
	PSYCHOLOGY_MISTAKE: [
		"CONCEPTUAL_ERROR",
		"CALCULATION_MISTAKE",
		"TIME_MANAGEMENT",
		"OVERCONFIDENCE",
		"EXAM_ANXIETY"
	]
} as const

export const ALL_TAGS = Object.values(TAG_CATEGORIES).flat()

export const TAG_CATEGORY_LABELS = {
	EXAM: "Exam Tags",
	SUBJECT: "Subject Tags",
	TOPIC: "Topic Tags",
	DIFFICULTY_INTENT: "Difficulty / Intent Tags",
	STUDENT_PHASE: "Student Phase Tags",
	PSYCHOLOGY_MISTAKE: "Psychology / Mistake Tags"
} as const

export function formatTagName(tag: string): string {
	return tag
		.split("_")
		.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
		.join(" ")
}

