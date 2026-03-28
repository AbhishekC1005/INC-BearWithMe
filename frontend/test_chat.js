// Temporary Frontend Test Script
// Simulating data flow from React Native to FastAPI without Firebase login

async function testFrontendFlow() {
  console.log("🚀 [Frontend Test] Sending 'Hello, who are you?' to backend API...");

  try {
    // Calling the Uvicorn local server directly
    const response = await fetch("http://127.0.0.1:8000/test-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Hello, who are you?" }),
    });

    if (!response.ok) {
      console.error("❌ [Frontend Error] HTTP status:", response.status);
      const text = await response.text();
      console.error("❌ [Backend Response]:", text);
      return;
    }

    const data = await response.json();
    console.log("\n✅ [Success! Payload received from Backend]:");
    console.log(data.reply);
    
  } catch (error) {
    if (error.cause && error.cause.code === 'ECONNREFUSED') {
       console.error("❌ [Frontend Error]: Could not connect to the Backend. Is Uvicorn running?");
    } else {
       console.error("❌ [Frontend Error]:", error.message);
    }
  }
}

testFrontendFlow();
