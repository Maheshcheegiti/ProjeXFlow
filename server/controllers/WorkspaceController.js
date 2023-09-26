const Workspace = require("../models/workspace");
const Members = require("../models/members");

exports.createWS = (req, res) => {
  const { owner, wsname, wspwd, maxmem, status } = req.body;
  Workspace.findOne({ wsname })
    .then((existingws) => {
      if (existingws) {
        // User with the same username or mailid already exists
        return res.status(400).json({ error: "Workspace already registered" });
      }

      // Create a new user document
      const worspace = new Workspace({
        owner,
        wsname,
        wspwd,
        maxmem,
        status,
      });

      // Save the user document to the MongoDB database
      return worspace
        .save()
        .then(() => {
          console.log("workspace saved to the database");
          res.status(201).json({ message: "Workspace created successfully" });
        })
        .catch((error) => {
          console.error("Error creating workspace:", error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((error) => {
      console.error("Error checking for existing workspace:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getWsStatus = (req, res) => {
  const wsname = req.body.wsname; // Assuming you're passing wsname as a query parameter
  Workspace.findOne({ wsname })
    .then((workspace) => {
      if (workspace) {
        // If a workspace with the given wsname is found
        const status = workspace.status;
        res.status(200).json({ status });
      } else {
        // If no workspace is found with the given wsname
        res.status(404).json({ message: "Workspace not found" });
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.joinWS = (req, res) => {
  const { owner, wsname, wspwd } = req.body;
  const mailid = owner;
  Workspace.findOne({ wsname })
    .then((workspace) => {
      if (workspace) {
        // If a workspace with the given wsname is found
        if (workspace.wspwd === wspwd) {
          Members.findOne({ mailid, wsname })
            .then((existingmem) => {
              if (existingmem) {
                // User with the same username or mailid already exists
                return res
                  .status(400)
                  .json({ error: "You already in the workspace" });
              } else if (mailid === workspace.owner) {
                return res
                  .status(400)
                  .json({ error: "You already in the workspace" });
              }

              // Create a new user document
              const member = new Members({
                mailid,
                wsname,
              });

              if (workspace.status === workspace.maxmem) {
                res.status(402).json({ error: "Workspace is fulled." });
                return;
              } else {
                workspace.status = workspace.status + 1;
                workspace.save();
              }
              // Save the user document to the MongoDB database
              return member
                .save()
                .then(() => {
                  console.log("member saved to the database");
                  res
                    .status(201)
                    .json({ message: "you are joined in a new workspace." });
                })
                .catch((error) => {
                  console.error("Error joining workspace:", error);
                  res.status(500).json({ error: "Internal Server Error" });
                });
            })
            .catch((error) => {
              console.error("Error checking for existing mailid:", error);
              res.status(500).json({ error: "Internal Server Error" });
            });
        } else {
          res.status(401).json({ message: "Password not matched" });
        }
      } else {
        // If no workspace is found with the given wsname
        res.status(404).json({ message: "Workspace not found" });
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getWS = async (req, res) => {
  const mailid = req.body.mailid;

  try {
    // Use Promise.all to run both queries concurrently
    const [userWorkspaces, createdWorkspaces] = await Promise.all([
      Members.find({ mailid: mailid }, "wsname"), // Workspaces where the user is a member
      Workspace.find({ owner: mailid }, "wsname"), // Workspaces created by the user
    ]);

    const userWorkspaceNames = userWorkspaces.map(
      (workspace) => workspace.wsname
    );
    const createdWorkspaceNames = createdWorkspaces.map(
      (workspace) => workspace.wsname
    );

    res.status(200).json({
      userWorkspaces: userWorkspaceNames,
      createdWorkspaces: createdWorkspaceNames,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



