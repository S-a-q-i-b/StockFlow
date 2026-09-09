const Activity = require("../models/activity.model");

const logActivity = async ({
  action,
  entityType,
  entityId,
  userId,
  metadata,
}) => {
  try {
    await Activity.create({
      action,
      entityType,
      entityId,
      user: userId,
      metadata,
    });
  } catch (error) {
    console.error("Activity log failed:", error.message);
  }
};

module.exports = logActivity;
