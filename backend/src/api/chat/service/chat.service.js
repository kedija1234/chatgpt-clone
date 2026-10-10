import db from "../../../../db/db.config.js";
import { geminiClient, geminiModel } from "../../../utils/gemini.js";
import SYSTEM_PROMPT from "../../../utils/system-prompt.js";

// ======================================================
// Get conversation rows
// ======================================================

export const getConversationRows = async (limit = 5) => {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 5, 100));

  const [rows] = await db.execute(
    `SELECT id, role, content, token_count, created_at FROM conversations ORDER BY id DESC LIMIT ${safeLimit}`,
  );

  return rows.reverse();
};

// ======================================================
// Get recent conversations for GET API
// ======================================================

export const getRecentConversationRows = async (limit = 100) => {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 100));

  const [rows] = await db.execute(
    `SELECT id, role, content, token_count, created_at FROM conversations ORDER BY id DESC LIMIT ${safeLimit}`,
  );

  return rows.reverse();
};

// ======================================================
// Generate assistant answer
// ======================================================

export const generateAssistantAnswer = async ({ history, question }) => {
  const contents = [];

  for (const message of history) {
    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    });
  }

  contents.push({ role: "user", parts: [{ text: question }] });

  const response = await geminiClient.models.generateContent({
    model: geminiModel,
    contents,
    config: { systemInstruction: SYSTEM_PROMPT },
  });

  const answer =
    typeof response.text === "function" ? response.text() : response.text;
  const cleanedAnswer = typeof answer === "string" ? answer.trim() : "";

  if (!cleanedAnswer) {
    throw new Error("The model returned an empty answer");
  }

  const tokenCount = response.usageMetadata?.totalTokenCount || 0;

  return { content: cleanedAnswer, tokenCount };
};

// ======================================================
// Create conversation
// ======================================================

export const createConversationService = async (question) => {
  // 1. Validate
  if (typeof question !== "string" || !question.trim()) {
    const error = new Error("question is required");
    error.statusCode = 400;
    throw error;
  }

  // 2. Normalize
  const normalizedQuestion = question.trim();

  if (normalizedQuestion.length > 65535) {
    const error = new Error("question is too long");
    error.statusCode = 400;
    throw error;
  }

  // 3. Get previous 5 messages
  const history = await getConversationRows(5);

  // 4. Save user question
  const [userResult] = await db.execute(
    `INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)`,
    ["user", normalizedQuestion, 0],
  );

  const userId = userResult.insertId;

  // 5. Generate AI answer
  let assistant;

  try {
    assistant = await generateAssistantAnswer({
      history,
      question: normalizedQuestion,
    });
  } catch (error) {
    // The user message has already been saved.
    // We intentionally do not delete it because
    // the database should preserve what the user sent.
    throw error;
  }

  // 6. Save assistant answer
  const [assistantResult] = await db.execute(
    `INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)`,
    ["assistant", assistant.content, assistant.tokenCount],
  );

  const assistantId = assistantResult.insertId;

  // 7. Fetch both newly created rows
  const [rows] = await db.execute(
    `SELECT id, role, content, token_count, created_at FROM conversations WHERE id IN (?, ?) ORDER BY id ASC`,
    [userId, assistantId],
  );

  const userRow = rows.find((row) => row.id === userId);
  const assistantRow = rows.find((row) => row.id === assistantId);

  return {
    userConversation: formatConversation(userRow),
    assistantConversation: formatConversation(assistantRow),
  };
};

// ======================================================
// Format database row
// ======================================================

export const formatConversation = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    role: row.role,
    content: row.content,
    tokenCount: row.token_count,
    createdAt: row.created_at,
  };
};
