import User from '../models/User.js';

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id) => {
            return User.findById(id);
        }));
    
    const formattedFriends = friends.map({
        firstName, 
        lastName, 
        email, 
        password,
        userPicturePath,
        connections,
        occupation
    });
    res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // facebook's way of handling add/remove friends
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId); 
            //if filter condition is passed then copied, so we are removing when id == friend id
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        //get updated list of friends again
        const friends = await Promise.all(
            user.friends.map((id) => {
                return User.findById(id);
            }));
        //format friends for the frontend
        const formattedFriends = friends.map({
            firstName, 
            lastName, 
            email, 
            password,
            userPicturePath,
            connections,
            occupation
        });

        res.status(200).json(formattedFriends);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
}