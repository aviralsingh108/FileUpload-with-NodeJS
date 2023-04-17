const path = require("path");

async function changePassword(req, res) {
  res.sendFile(path.join(__dirname, "..", "ui", "login", "login.html"));

  const { token, newPassword: plainTextPassword } = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }
  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password length shouldn't be lesser than 5 characters",
    });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword, 10);
    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "mehnat karo" });
  }
}

module.exports = { changePassword };
