export const usersWith10plusFriends = `
SELECT u.user_id, CONCAT(u.name,' ', u.surname) as full_name, COUNT(fs.friendship_id) as nb_friends
FROM users u
    LEFT JOIN friendships fs ON u.user_id = fs.user_id
    LEFT JOIN friendships fs2 ON 
        fs.friend_id = fs2.user_id AND fs2.friend_id = u.user_id
GROUP BY u.user_id
HAVING nb_friends > 10;
`;

export const usersMostPosts = `
SELECT users.user_id, CONCAT(users.name,' ', users.surname) as full_name, COUNT(posts.post_id) AS post_count
FROM users
JOIN posts ON users.user_id = posts.user_id
GROUP BY users.user_id
HAVING post_count = (
    SELECT COUNT(post_id)
    FROM posts
    GROUP BY user_id
    ORDER BY COUNT(post_id) DESC
    LIMIT 1
);`;

export const postsWMostReactions = `
SELECT
    p.post_id,
    p.post_type,
    u.user_id,
    CONCAT(u.name,' ', u.surname) AS user_name,
    COUNT(r.reaction_id) AS reaction_count
FROM
    posts as p
JOIN users as u ON p.user_id = u.user_id
LEFT JOIN reactions as r ON p.post_id = r.post_id
GROUP BY
    p.post_id, u.user_id
ORDER BY
    reaction_count DESC;`;


