-- Users Table (Consolidated with Profile Data)

CREATE TABLE IF NOT EXISTS Users (
    account_id VARCHAR(36) UNIQUE NOT NULL,   
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,  
    first_name VARCHAR(50) NOT NULL, 
    last_name VARCHAR(50) NOT NULL,  
    age INT NOT NULL,
    location VARCHAR(100), 
    languages VARCHAR(255),    
    bio TEXT,                         
    profile_picture VARCHAR(255) NULL,           
    religion VARCHAR(50),        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notification_preferences JSON,
    privacy_settings JSON,
    language_preferences VARCHAR(50), 
    PRIMARY KEY (account_id)
);

-- Messages Table (Updated)

CREATE TABLE IF NOT EXISTS Messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_account_id VARCHAR(36) NOT NULL,
    receiver_account_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_account_id) REFERENCES Users(account_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_account_id) REFERENCES Users(account_id) ON DELETE CASCADE
);

-- Friends Table (Updated)

CREATE TABLE IF NOT EXISTS Friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_account_id VARCHAR(36) NOT NULL,
    friend_account_id VARCHAR(36) NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (user_account_id) REFERENCES Users(account_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_account_id) REFERENCES Users(account_id) ON DELETE CASCADE
);

-- Settings Table (Updated)

CREATE TABLE IF NOT EXISTS Settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_account_id VARCHAR(36) UNIQUE NOT NULL,
    notification_preferences JSON,
    privacy_settings JSON,
    language_preferences VARCHAR(50),
    FOREIGN KEY (user_account_id) REFERENCES Users(account_id) ON DELETE CASCADE
);