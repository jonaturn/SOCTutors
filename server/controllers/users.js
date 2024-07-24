import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.connections.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, userPicturePath }) => {
        return { _id, firstName, lastName, occupation, userPicturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getTopUsers = async (req, res) => {
  try {
    // Fetch the top 3 users based on the level
    const topUsers = await User.find({})
      .sort({ level: -1 }) // Sort by level in descending order
      .limit(3) // Limit to top 3 users
      .select("_id firstName lastName level userPicturePath"); // Select only required fields

    res.status(200).json(topUsers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.connections.includes(friendId)) {
      user.connections = user.connections.filter((id) => id !== friendId);
      friend.connections = friend.connections.filter((id) => id !== id);
    } else {
      user.connections.push(friendId);
      friend.connections.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.connections.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, userPicturePath }) => {
        return { _id, firstName, lastName, occupation, userPicturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
