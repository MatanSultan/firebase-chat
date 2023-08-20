const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addChatMessage = functions.https.onCall((data, context) => {
  // Check user authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to call this function."
    );
  }

  // Validate the message content
  if (
    !data.content ||
    typeof data.content !== "string" ||
    data.content.length > 500
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid message content."
    );
  }

  // Save the message to the database
  return admin
    .database()
    .ref("messages")
    .push({
      content: data.content,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      uid: context.auth.uid,
    })
    .then((ref) => {
      return {
        messageId: ref.key,
        content: data.content,
        uid: context.auth.uid,
      };
    });
});
