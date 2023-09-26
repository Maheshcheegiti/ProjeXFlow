const Workspace = require("../models/workspace");
const Members = require("../models/members");
const User = require("../models/user");

exports.Teams = async (req, res) => {
  const wsname = req.body.wsname;

  try {
    // Use Promise.all to run both queries concurrently
    const [userWorkspaces, createdWorkspaces] = await Promise.all([
      Members.find({ wsname: wsname }),
      Workspace.find({ wsname: wsname }),
    ]);
    const userWorkspaceEmails = userWorkspaces.map(
      (workspace) => workspace.mailid
    );
    const createdWorkspaceEmails = createdWorkspaces.map(
      (workspace) => workspace.owner
    );

    // Find user information (username, linkedin, github) for the extracted emails
    const users = await User.find(
      {
        $or: [
          { mailid: { $in: userWorkspaceEmails } },
          { mailid: { $in: createdWorkspaceEmails } },
        ],
      },
      "mailid username linkedin github"
    );

    // Prepare the response with user information and mark the owner
    const userInformation = users.reduce((result, user) => {
      result[user.mailid] = {
        username: user.username,
        linkedin: user.linkedin,
        github: user.github,
        isOwner: createdWorkspaceEmails.includes(user.mailid), // Check if the user is the owner
      };
      return result;
    }, {});
    let wsmax = 0;
    if (createdWorkspaces.length > 0) {
      wsmax = createdWorkspaces[0].maxmem;
    }

    res.status(200).json({
      userInformation: userInformation,
      wsmax: wsmax,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
