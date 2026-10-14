
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

app.use(cors());
app.use(express.json());

// Google Sheets authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

// Homepage route
app.get("/", (req, res) => {
  res.send("Node.js Backend is Running Successfully!");
});

// Test API route
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Node.js Backend!",
  });
});

// Hanco Fort Heights enquiry form API
app.post("/api/submit", async (req, res) => {
  const {
    name,
    phone,
    email,
    city,
    dialCode = "+91",
    type = "enquiry",
  } = req.body || {};

  // Validate form fields
  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !/^[0-9]+$/.test(phone) ||
    typeof dialCode !== "string" ||
    !/^\+[0-9]{1,4}$/.test(dialCode) ||
    !["enquiry", "visit"].includes(type) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter valid name, phone and email.",
    });
  }

  try {
    const leadType = type === "visit" ? "Site Visit" : "Enquiry";

    // Prevent spreadsheet formula injection
    const safeValue = (value) => {
      const text = String(value ?? "").trim();
      return /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
    };

    // Add a new row to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Leads!A:F",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[
          new Date().toISOString(),
          safeValue(name),
          safeValue(email),
          safeValue(dialCode + phone),
          safeValue(city),
          leadType,
        ]],
      },
    });

    console.log("Hanco lead saved to Google Sheets");

    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully!",
    });
  } catch (error) {
    console.error("Google Sheets error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save enquiry. Please try again.",
    });
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
