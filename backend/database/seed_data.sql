-- Insert Users

INSERT INTO Users 
(account_id, email, password, first_name, last_name, age, location, languages, bio, profile_picture, religion, created_at, notification_preferences, privacy_settings, language_preferences) 
VALUES 
('uuid-1', 'user1@example.com', 'hashedpassword1', 'John', 'Doe', 25, 'Toronto', 'English, French', 'Just a cool person.', NULL, 'None', NOW(), '{"email": "true"}', '{"public": "false"}', 'English'),
('uuid-2', 'user2@example.com', 'hashedpassword2', 'Jane', 'Smith', 27, 'Vancouver', 'English', 'Loves hiking.', NULL, 'None', NOW(), '{"email": "true"}', '{"public": "false"}', 'English');

-- Insert Messages (Only insert after Users exist)

INSERT INTO Messages (sender_account_id, receiver_account_id, content) 
VALUES 
('uuid-1', 'uuid-2', 'Hey, how are you?'),
('uuid-2', 'uuid-1', 'Doing great, thanks!');

-- Insert Friends

INSERT INTO Friends (user_account_id, friend_account_id, status) 
VALUES 
('uuid-1', 'uuid-2', 'Accepted');
