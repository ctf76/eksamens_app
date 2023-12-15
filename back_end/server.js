import sequelize from "./setup_db/db_conn.js";
import { Op } from "sequelize";
import cors from "cors";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import createDatabase from "./setup_db/create_db.js";
import User from "./models/user.js";
import FriendShip from "./models/friendship.js";
import Post from "./models/post.js";
import Reaction from "./models/reaction.js";
import { usersWith10plusFriends, usersMostPosts, postsWMostReactions } from './setup_db/rawQueries.js';
import wOT from "./setup_db/wallOfText.js"
const __dirname = dirname(fileURLToPath(import.meta.url));

// Creating database if it doesn't exist already - set force_reset to true if database should be recreated and records reimported
// force_reset is only necessary if db has already been created once and you need to reset it
(async () => {
  const initializedSequelize = await createDatabase(sequelize, { force_reset: false });
})();

// Setup of express and cors
const app = express();
app.use(cors());
app.use(express.json());

// Defining default port
const port = process.env.PORT || 3000;

// Post requst for getting user by id
app.get("/api/user/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const user = await User.findByPk(id);
    response.json(user);
  } catch (err) {
    console.log(err);
  };
});

app.get("/api/user_name/:partName", async (request, response) => {
  try {
    const partName = request.params.partName;
    const users = await User.findAll(
      {
        where: {
          surname: {
            [Op.like]: `${partName}%`
          }
        }
      }
    );
    // Checking if any users surname starts with input
    if (users.length === 0) {
      response.status(404).send(`No users found with a surname which starts with: ${partName}`);
    } else {
      // If users are found, send the JSON response
      response.json(users);
    }    
  } catch (err) {
    console.log(err);
  };
});

// Route for updating user
app.put("/api/user/:id", async (request, response) => {
  const user_id = request.params.id;
  const user = request.body;
  const [result] = await User.update(user, { where: { user_id: user_id } });

  if (result) {
    response.json({ message: "User updated" });
  } else {
    response.json({ message: "User not found" });
  }
});

// Route for deleting user
// Creating a transaction as onDelete: 'CASCADE' isn't actually having effect in the MySQL db for some reason...
app.delete("/api/user/:id", async (request, response) => {
  const user_id = parseInt(request.params.id, 10);
  try {
    await sequelize.transaction(async (t) => {
      await FriendShip.destroy({
        where: {
          [Op.or]: [{ user_id }, { friend_id: user_id }],
        },
        transaction: t,
      });
      await Reaction.destroy({
        where: { user_id },
        transaction: t
      });
      await Post.destroy({
        where: { user_id },
        transaction: t
      });

      const result = await User.destroy({
        where: { user_id },
        transaction: t,
      });

      if (result) {
        response.json({ message: "User and associated reltionships (friendships and posts) deleted" });
      } else {
        response.json({ message: "User not found" });
      }
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/api/create_user', async (request, response) => {
  try {
    const { name, surname, age } = request.body;
    const newUser = await User.create({
      name,
      surname,
      age
    });
    const userId = newUser.user_id;
    response.status(201).json(newUser);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      validationErrors.forEach((error) => {
        console.error(`Validation Error - Field: ${error.field}, Message: ${error.message}`);
      });

      response.status(400).json({ errors: validationErrors });
      console.error(validationErrors)
    };
  };
});

const executeRawQuery = async (url, query, response) => {
  try {
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    response.status(201).json(results);
  } catch (error) {
    console.error('Error executing raw SQL query:', error);
    response.status(500).send('Internal Server Error');
  }
};

app.get('/api/usersw10f', async (request, response) => {
  const query = usersWith10plusFriends;
  await executeRawQuery('/api/usersw10f', query, response);
});

app.get('/api/usersmostposts', async (request, response) => {
  const query = usersMostPosts;
  await executeRawQuery('/api/usersmostposts', query, response);
});

app.get('/api/postswithmostreactions', async (request, response) => {
  const query = postsWMostReactions;
  await executeRawQuery('/api/postswithmostreactions', query, response);
});

const wallOfText = wOT

app.get('/', async (request, response) => {
  response.send(wallOfText);
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
