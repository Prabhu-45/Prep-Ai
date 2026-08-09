const aiService = require('./src/services/ai.service');

async function test() {
    console.log("Testing AI...");
    try {
        const result = await aiService.generateBulkResumeScore("We need a React dev", "I know React and Node", "Test Candidate");
        console.log("SUCCESS:", result);
    } catch (e) {
        console.error("FAILED:", e);
    }
}
test();
