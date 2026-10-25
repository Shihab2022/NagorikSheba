import assert from "node:assert/strict";
import test from "node:test";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { MessagesAnnotation } from "@langchain/langgraph";
import {
  routeAfterTools,
  routeAfterChatbot,
  routeAfterRetrieval,
  cleanAnswerBody,
  isLikelyServiceQuestion,
} from "./ai.graph";

function makeState(entries: Array<{
  role: "human" | "ai" | "tool" | "system";
  content: string;
  name?: string;
  tool_calls?: unknown;
}>): typeof MessagesAnnotation.State {
  return {
    messages: entries.map((e) => {
      switch (e.role) {
        case "human": return new HumanMessage(e.content);
        case "ai": {
          const msg = new AIMessage(e.content);
          if (e.tool_calls) (msg as any).tool_calls = e.tool_calls;
          return msg;
        }
        case "tool": {
          const msg = new ToolMessage(e.content, e.name ?? "tool-call-id");
          msg.name = e.name ?? "tool";
          return msg;
        }
        case "system": return new SystemMessage(e.content);
        default: return new HumanMessage(e.content);
      }
    }),
  } as typeof MessagesAnnotation.State;
}
// --- routeAfterChatbot tests ---

test("routeAfterChatbot: model with tool calls routes to tools", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "ai", content: "", tool_calls: [{ name: "search_services", args: { query: "passport" }, id: "1" }] },
  ]);
  assert.equal(routeAfterChatbot(state), "tools");
});

test("routeAfterChatbot: tools already used this turn routes to finalAnswer", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Passport" } }), name: "search_services" },
    { role: "ai", content: "The fee is 500 BDT." },
  ]);
  assert.equal(routeAfterChatbot(state), "finalAnswer");
});

test("routeAfterChatbot: chit-chat without retrieval routes to end", () => {
  const state = makeState([
    { role: "human", content: "Hello, how are you?" },
    { role: "ai", content: "I'm doing well, thank you!" },
  ]);
  assert.equal(routeAfterChatbot(state), "end");
});

test("routeAfterChatbot: empty state routes to end", () => {
  const state = makeState([]);
  assert.equal(routeAfterChatbot(state), "end");
});

test("routeAfterChatbot: service question with retrieval prompt routes to retrieval", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "system", content: "[SERVICE_RETRIEVAL_PROMPTED]\nPlease use retrieval tools." },
    { role: "ai", content: "I don't know the fee." },
  ]);
  assert.equal(routeAfterChatbot(state), "retrieval");
});

test("routeAfterChatbot: service question without retrieval prompt routes to end", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "ai", content: "I don't know the fee." },
  ]);
  assert.equal(routeAfterChatbot(state), "end");
});

test("routeAfterChatbot: chit-chat with retrieval prompt marker still routes to end", () => {
  const state = makeState([
    { role: "human", content: "Hello, how are you?" },
    { role: "system", content: "[SERVICE_RETRIEVAL_PROMPTED]\nPlease use retrieval tools." },
    { role: "ai", content: "I'm doing well." },
  ]);
  assert.equal(routeAfterChatbot(state), "end");
});

test("routeAfterChatbot: previous-turn marker does not affect current turn", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "system", content: "[SERVICE_RETRIEVAL_PROMPTED]\nPlease use retrieval tools." },
    { role: "ai", content: "I don't know." },
    { role: "human", content: "Hello" },
    { role: "ai", content: "Hi there!" },
  ]);
  assert.equal(routeAfterChatbot(state), "end");
});

// --- routeAfterTools tests ---

test("routeAfterTools: sufficient evidence routes to chatbot", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Passport", fees: [{ amount: 500 }] } }), name: "get_service_details" },
  ]);
  assert.equal(routeAfterTools(state), "chatbot");
});

test("routeAfterTools: insufficient evidence triggers officialWebFallback", () => {
  const state = makeState([
    { role: "human", content: "How much is the driving licence fee?" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Driving Licence", slug: "driving-licence", fees: [] } }), name: "get_service_details" },
  ]);
  assert.equal(routeAfterTools(state), "officialWebFallback");
});

test("routeAfterTools: already fell back does not repeat", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "system", content: "[OFFICIAL_WEB_SEARCH_FALLBACK_RESULT] {\"found\": true}" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Passport", fees: [] } }), name: "get_service_details" },
  ]);
  assert.equal(routeAfterTools(state), "chatbot");
});

test("routeAfterTools: no tool messages routes to chatbot", () => {
  const state = makeState([
    { role: "human", content: "Hello" },
  ]);
  assert.equal(routeAfterTools(state), "chatbot");
});

// --- routeAfterRetrieval tests ---

test("routeAfterRetrieval: sufficient DB evidence routes to finalAnswer", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Passport", fees: [{ amount: 500 }] } }), name: "get_service_details" },
  ]);
  assert.equal(routeAfterRetrieval(state), "finalAnswer");
});

test("routeAfterRetrieval: insufficient DB evidence routes to officialWebFallback", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Passport", fees: [] } }), name: "get_service_details" },
  ]);
  assert.equal(routeAfterRetrieval(state), "officialWebFallback");
});

test("routeAfterRetrieval: fallback already attempted routes to finalAnswer (no loop)", () => {
  const state = makeState([
    { role: "human", content: "What is the passport fee?" },
    { role: "system", content: "[OFFICIAL_WEB_SEARCH_FALLBACK_RESULT] {\"found\": true}" },
    { role: "tool", content: JSON.stringify({ success: true, service: { name: "Passport", fees: [] } }), name: "get_service_details" },
  ]);
  assert.equal(routeAfterRetrieval(state), "finalAnswer");
});

test("routeAfterRetrieval: no tool messages routes to finalAnswer", () => {
  const state = makeState([
    { role: "human", content: "Hello" },
  ]);
  assert.equal(routeAfterRetrieval(state), "finalAnswer");
});

// --- isLikelyServiceQuestion tests ---

test("isLikelyServiceQuestion: English service questions are detected", () => {
  assert.equal(isLikelyServiceQuestion("What is the passport fee?"), true);
  assert.equal(isLikelyServiceQuestion("How much is the driving licence fee?"), true);
  assert.equal(isLikelyServiceQuestion("What are the land mutation steps?"), true);
  assert.equal(isLikelyServiceQuestion("How do I apply for NID correction?"), true);
  assert.equal(isLikelyServiceQuestion("What is the tax deadline?"), true);
});

test("isLikelyServiceQuestion: Bangla service questions are detected", () => {
  assert.equal(isLikelyServiceQuestion("পাসপোর্ট ফি কত?"), true);
  assert.equal(isLikelyServiceQuestion("নামজারি কীভাবে করব?"), true);
  assert.equal(isLikelyServiceQuestion("এনআইডি সংশোধনের ডকুমেন্ট কী কী?"), true);
});

test("isLikelyServiceQuestion: greetings and chit-chat are not service questions", () => {
  assert.equal(isLikelyServiceQuestion("Hello"), false);
  assert.equal(isLikelyServiceQuestion("Hi, how are you?"), false);
  assert.equal(isLikelyServiceQuestion("Thank you!"), false);
  assert.equal(isLikelyServiceQuestion("Good morning"), false);
  assert.equal(isLikelyServiceQuestion(""), false);
  assert.equal(isLikelyServiceQuestion("Who are you?"), false);
});

test("isLikelyServiceQuestion: partial word matches do not trigger", () => {
  assert.equal(isLikelyServiceQuestion("disservice"), false);
  assert.equal(isLikelyServiceQuestion("I like coffee"), false);
});

// --- cleanAnswerBody tests ---

test("cleanAnswerBody: removes localhost URLs", () => {
  const result = cleanAnswerBody("Visit http://localhost:3000/services for details.");
  assert.ok(!/localhost/.test(result));
});

test("cleanAnswerBody: removes markdown links", () => {
  const result = cleanAnswerBody("The fee is 500 BDT. [Source](https://example.com/page)");
  assert.ok(!/https?:\/\//.test(result));
});

test("cleanAnswerBody: removes bare domains", () => {
  const result = cleanAnswerBody("Check example.com for more info.");
  assert.ok(!/example\.com/.test(result));
});

test("cleanAnswerBody: removes internal service paths", () => {
  const result = cleanAnswerBody("See /services/passport for details.");
  assert.ok(!/\/services\//.test(result));
});

test("cleanAnswerBody: removes source sections", () => {
  const result = cleanAnswerBody("Some answer text.\n\n**Sources**\n- [Link](https://example.com)");
  assert.ok(!/Sources/.test(result));
  assert.ok(!/https?:\/\//.test(result));
});

test("cleanAnswerBody: removes citation markers", () => {
  const result = cleanAnswerBody("The fee is 500 BDT【source】.");
  assert.ok(!/【source】/.test(result));
});

test("cleanAnswerBody: normalizes whitespace", () => {
  const result = cleanAnswerBody("Hello   world    !");
  assert.equal(result, "Hello world!");
});

test("cleanAnswerBody: preserves legitimate answer text", () => {
  const result = cleanAnswerBody("The passport fee is 500 BDT for 5 years.");
  assert.equal(result, "The passport fee is 500 BDT for 5 years.");
});

