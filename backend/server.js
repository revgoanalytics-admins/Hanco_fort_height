
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Homepage route
app.get("/", (req, res) => {
  res.send("Node.js Backend is Running Successfully!");
});

// Test API route
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Node.js Backend!"
  });
});

// Hanco Fort Heights enquiry form API
app.post("/api/submit", (req, res) => {
  const { name, phone, email, city, dialCode = "+91", type = "enquiry" } = req.body || {};

  // Validate form fields
  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !/^[0-9]+$/.test(phone) ||
    typeof dialCode !== "string" || !/^\+[0-9]{1,4}$/.test(dialCode) ||
    !["enquiry", "visit"].includes(type) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter valid name, phone and email."
    });
  }

  // Display submitted form data in terminal
  console.log("New Hanco Fort Heights Enquiry:", {
    name,
    phone,
    email,
    city,
    dialCode,
    type
  });

  // Send response to React
  res.status(200).json({
    success: true,
    message: "Enquiry submitted successfully!"
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
