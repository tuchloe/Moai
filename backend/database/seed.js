const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mysql = require("mysql2/promise");
const { faker } = require("@faker-js/faker");

// 🔗 Connect to MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

const NUM_USERS = 30; // Increase users to 30

// 🔄 Function to generate a UUID
const generateUUID = () => faker.string.uuid();

// 🔄 Function to generate Users data
const generateUsers = () => {
  return Array.from({ length: NUM_USERS }, () => ({
    account_id: generateUUID(),
    email: faker.internet.email(),
    password: faker.internet.password(10), // ⚠ Hash in production!
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 60, max: 90 }),
    location: faker.helpers.weightedArrayElement([
      { value: "Toronto", weight: 0.6 },
      { value: "Vancouver", weight: 0.1 },
      { value: "Montreal", weight: 0.1 },
      { value: "Calgary", weight: 0.1 },
      { value: "Ottawa", weight: 0.1 },
    ]),
    languages: faker.helpers.arrayElements(["English", "French", "Spanish", "Mandarin"], 2).join(", "),
    bio: faker.lorem.sentences(2),
    religion: faker.helpers.arrayElement(["None", "Christian", "Muslim", "Hindu", "Buddhist"]),
    privacy_settings: JSON.stringify({ public: faker.datatype.boolean() }),
    language_preferences: faker.helpers.arrayElement(["English", "French", "Spanish"]),
    interests: JSON.stringify(faker.helpers.arrayElements(["Reading", "Walking", "Chess", "Gardening", "Cooking"], 3)), // Ensure interests are stored as JSON
  }));
};

// 🔄 Function to generate Messages data
const generateMessages = (users) => {
  return Array.from({ length: NUM_USERS * 2 }, () => {
    const sender = faker.helpers.arrayElement(users);
    let receiver;
    do {
      receiver = faker.helpers.arrayElement(users);
    } while (receiver.account_id === sender.account_id);

    return {
      sender_account_id: sender.account_id,
      receiver_account_id: receiver.account_id,
      content: faker.lorem.sentence(),
    };
  });
};

// 🔄 Function to generate Friends data
const generateFriends = (users) => {
  const friendsSet = new Set(); // Prevent duplicate friendships
  return Array.from({ length: NUM_USERS }, () => {
    let user, friend;
    do {
      user = faker.helpers.arrayElement(users);
      friend = faker.helpers.arrayElement(users);
    } while (user.account_id === friend.account_id || friendsSet.has(`${user.account_id}-${friend.account_id}`));

    friendsSet.add(`${user.account_id}-${friend.account_id}`);
    return {
      user_account_id: user.account_id,
      friend_account_id: friend.account_id,
      status: faker.helpers.arrayElement(["Pending", "Accepted", "Rejected"]),
    };
  });
};

// 🚀 Run Seeding
const seedDatabase = async () => {
  try {
    const db = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL Database");

    // 🗑 Clear existing data
    await db.query("SET FOREIGN_KEY_CHECKS=0");
    await db.query("TRUNCATE TABLE Messages");
    await db.query("TRUNCATE TABLE Friends");
    await db.query("TRUNCATE TABLE Users");
    await db.query("SET FOREIGN_KEY_CHECKS=1");

    // 🔹 Insert Users
    const users = generateUsers();
    const userValues = users.map((u) => [
      u.account_id,
      u.email,
      u.password,
      u.first_name,
      u.last_name,
      u.age,
      u.location,
      u.languages,
      u.bio,
      u.religion,
      new Date(),
      u.privacy_settings,
      u.language_preferences,
      u.interests,
    ]);

    await db.query(
      `INSERT INTO Users (account_id, email, password, first_name, last_name, age, location, languages, bio, religion, created_at, privacy_settings, language_preferences, interests) 
      VALUES ?`,
      [userValues]
    );

    console.log("✅ Inserted Users:", users.slice(0, 2)); // Show preview of inserted users

    // 🔹 Insert Messages
    const messages = generateMessages(users);
    const messageValues = messages.map((m) => [m.sender_account_id, m.receiver_account_id, m.content, new Date()]);
    await db.query(`INSERT INTO Messages (sender_account_id, receiver_account_id, content, timestamp) VALUES ?`, [messageValues]);

    console.log("✅ Inserted Messages:", messages.slice(0, 2));

    // 🔹 Insert Friends
    const friends = generateFriends(users);
    const friendValues = friends.map((f) => [f.user_account_id, f.friend_account_id, f.status]);
    await db.query(`INSERT INTO Friends (user_account_id, friend_account_id, status) VALUES ?`, [friendValues]);

    console.log("✅ Inserted Friends:", friends.slice(0, 2));

    console.log("🎉 Database successfully seeded!");
    await db.end();
  } catch (error) {
    console.error("❌ Error inserting seed data:", error.message);
  }
};

seedDatabase();
