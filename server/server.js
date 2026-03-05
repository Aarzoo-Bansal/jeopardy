const app = require('./app');
const PORT = process.env.PORT || 3000;

// ─── START SERVER ────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});